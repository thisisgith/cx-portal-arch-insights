import MockService from '../support/mockService';

const cgtMock = new MockService('CGTScenarios');
const cgtCompletedScenario = cgtMock.getScenario('GET', '(CGT) CGT-GetCompletedTrainings');

const cgtCompletedItems = cgtCompletedScenario.response.body;

const visibleCgtCompletedItems = cgtCompletedItems.slice(0, 2);
const invisibleCgtCompletedItems = cgtCompletedItems.slice(2);

const accUserInfoMock = new MockService('ACCUserInfoScenarios');
const accUserInfoScenario = accUserInfoMock.getScenario('GET', '(ACC) ACC-Request User Info');
const accUserInfoResponse = accUserInfoScenario.response.body;

// When displaying completed CGT items, the month gets converted to text
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Helper function to convert start and end dates to the range format
 * @param {String} startDate The start_date field of the CGT item
 * @param {String} endDate The end_date field of the CGT item
 * @returns {String} The formatted date range string that should match the UI display
 */
const convertDates = (startDate, endDate) => {
	let startDateConverted = `${monthNames[new Date(startDate).getMonth()]} ${new Date(startDate).getUTCDate()}`;
	startDateConverted += Cypress._.isEqual(new Date(startDate).getUTCFullYear(),
		new Date(endDate).getUTCFullYear())
		? '' : ` ${
			new Date(startDate).getUTCFullYear()
		}`;

	let endDateConverted = Cypress._.isEqual(monthNames[new Date(startDate).getMonth()],
		monthNames[new Date(endDate).getMonth()])
		? '' : `${
			monthNames[new Date(endDate).getMonth()]
		} `;
	endDateConverted += new Date(endDate).getUTCDate();
	endDateConverted += Cypress._.isEqual(new Date(startDate).getUTCFullYear(),
		new Date(endDate).getUTCFullYear())
		? `, ${
			new Date(endDate).getUTCFullYear()
		}` : ` ${
			new Date(endDate).getUTCFullYear()
		}`;

	return `${startDateConverted}-${endDateConverted}`;
};

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Customized Group Training (CGT)', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for CGT to finish loading
		cy.waitForAppLoading('cgtLoading', 15000);

		// Close the setup wizard so it doesn't block other elements
		cy.getByAutoId('setup-wizard-header-close-btn').click();
	});

	describe('PBC-301: (UI View) Lifecycle - Customized Group Training Request', () => {
		after(() => {
			// Ensure we are set back to the default mocks
			cgtMock.enable('(CGT) CGT-GetCompletedTrainings');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('cgtLoading', 15000);
		});

		it('Should display max of two completed items', () => {
			cy.getByAutoId('Customized Group Training Panel').within(() => {
				visibleCgtCompletedItems.forEach(item => {
					const expectedSessionText = `with ${item.instructors}, ${item.city}, ${item.country}`;

					cy.getByAutoId('CGTCompletedList')
						.should('contain', expectedSessionText)
						.and('contain', `${convertDates(item.start_date, item.end_date)}`);
				});
				invisibleCgtCompletedItems.forEach(item => {
					const expectedSessionText = `with ${item.instructors}, ${item.city}, ${item.country}`;

					cy.getByAutoId('CGTCompletedList')
						.should('not.contain', expectedSessionText)
						.and('not.contain', `${convertDates(item.start_date, item.end_date)}`);
				});
			});
		});

		it('Should hide completed list if none completed', () => {
			// Switch to a mock with no completed items
			cgtMock.enable('(CGT) CGT-GetCompletedTrainings-Empty');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('cgtLoading', 15000);

			// Verify the entire completed list is hidden
			cy.getByAutoId('CGTCompletedList').should('not.exist');
		});

		it('Should prevent scheduling if max sessions reached', () => {
			// Switch to mock data with enough sessions completed
			cgtMock.enable('(CGT) CGT-GetCompletedTrainings-fourCompleted');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('cgtLoading', 15000);

			// Verify clicking the register button shows a pop-up message and disables button
			cy.getByAutoId('Request-CgtCompleted')
				.click()
				.should('have.class', 'disabled');
			cy.getByAutoId('cgtTrainingLimitPopup')
				.should('contain', i18n._CGTSessionLimitReached_);

			// Verify clicking the X button on the pop-up closes it, but does not re-enable button
			cy.getByAutoId('Close-CgtTrainingComplete-Popup')
				.click();
			cy.getByAutoId('cgtTrainingLimitPopup')
				.should('not.exist');
			cy.getByAutoId('Request-CgtCompleted')
				.should('not.have.class', 'disabled');
		});

		it('Should only allow two sessions per calendar year per contract', () => {
			// Switch to the mock with two completed this year
			cgtMock.enable('(CGT) CGT-GetCompletedTrainings-twoCompletedThisYear');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('cgtLoading', 15000);

			// Open the modal and select the contract, verify error is displayed
			cy.getByAutoId('Request-CgtTraining').click();
			cy.getByAutoId('cgtRequestModal').should('be.visible');
			cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
			cy.getByAutoId('cgtRequestModal-NoSessionsAvailableBanner')
				.should('be.visible')
				.and('have.text', 'No Sessions available for the contract 222222, please select another contract.');

			// Close the form
			cy.getByAutoId('Close-CgtForm').click();
			cy.getByAutoId('cgtRequestModal').should('not.exist');
		});

		describe('Customized Group Training Request Form', () => {
			before(() => {
				// Ensure we are set back to the default mocks
				cgtMock.enable('(CGT) CGT-GetCompletedTrainings');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.waitForAppLoading('cgtLoading', 15000);
			});

			it('Should be able to open request form from Lifecycle page', () => {
				cy.getByAutoId('Request-CgtTraining').click();
				cy.getByAutoId('cgtRequestModal').should('be.visible');
				cy.getByAutoId('Close-CgtForm').click();
				cy.getByAutoId('cgtRequestModal').should('not.exist');
			});

			it('Should be able to close or cancel form', () => {
				cy.getByAutoId('Request-CgtTraining').click();
				cy.getByAutoId('cgtRequestModal').should('be.visible');
				cy.getByAutoId('Close-CgtForm').click();
				cy.getByAutoId('cgtRequestModal').should('not.exist');

				cy.getByAutoId('Request-CgtTraining').click();
				cy.getByAutoId('cgtRequestModal').should('be.visible');
				cy.getByAutoId('cgtRequestModal-Cancel').click();
				cy.getByAutoId('cgtRequestModal').should('not.exist');
			});

			describe('Form field validation', () => {
				beforeEach(() => {
					// Start with a clean modal for each test
					cy.getByAutoId('Request-CgtTraining').click();
					cy.getByAutoId('cgtRequestModal').should('be.visible');
				});

				afterEach(() => {
					cy.getByAutoId('Close-CgtForm').click();
					cy.getByAutoId('cgtRequestModal').should('not.exist');
				});

				it('Form should have all required fields', () => {
					// Check the title
					cy.getByAutoId('cgtRequestModal-Title').should('have.text', i18n._CustomizedGroupTraining_);

					// Check the pre-filled field headings
					cy.getByAutoId('cgtRequestModal-CompanyName-Heading').should('have.text', i18n._CompanyName_);
					cy.getByAutoId('cgtRequestModal-CustomerUserName-Heading').should('have.text', i18n._CustomerUserName_);
					cy.getByAutoId('cgtRequestModal-JobTitle-Heading').should('have.text', i18n._JobTitle_);
					cy.getByAutoId('cgtRequestModal-Email-Heading').should('have.text', i18n._Email_);
					cy.getByAutoId('cgtRequestModal-Phone-Heading').should('have.text', i18n._Phone_);
					cy.getByAutoId('cgtRequestModal-CiscoContact-Heading').should('have.text', i18n._CiscoContact_);
					cy.getByAutoId('cgtRequestModal-CCOID-Heading').should('have.text', i18n._CCOID_);
					cy.getByAutoId('cgtRequestModal-Country-Heading').should('have.text', i18n._Country_);

					// Check the user-entry field headings
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Heading').should('have.text', i18n._ApplicableContract_);
					cy.getByAutoId('cgtRequestModal-SessionsAvailableThrough-Heading').should('contain', 'Sessions available through');
					cy.getByAutoId('cgtRequestModal-TechnologyArea-Heading').should('have.text', i18n._TechnologyArea_);
					cy.getByAutoId('cgtRequestModal-TimeZone-Heading').should('have.text', i18n._TimeZone_);
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Heading').should('have.text', i18n._PreferredTimeMeeting_);
					cy.getByAutoId('cgtRequestModal-LanguagePreference-Heading').should('have.text', i18n._LanguagePreference_);
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Heading').should('have.text', i18n._WhatIsYourGoalForThisTraining_);
				});

				it('Form should have user information pre-filled', () => {
					cy.getByAutoId('cgtRequestModal-CompanyName-Value').should('have.text', accUserInfoResponse.companyName);
					cy.getByAutoId('cgtRequestModal-CustomerUserName-Value').should('have.text', accUserInfoResponse.userFullName);
					cy.getByAutoId('cgtRequestModal-JobTitle-Value').should('have.text', accUserInfoResponse.jobTitle);
					cy.getByAutoId('cgtRequestModal-Email-Value').should('have.text', accUserInfoResponse.userEmail);
					cy.getByAutoId('cgtRequestModal-Phone-Value').should('have.text', accUserInfoResponse.userPhoneNumber);
					cy.getByAutoId('cgtRequestModal-CiscoContact-Value').should('have.text', accUserInfoResponse.ciscoContact);
					cy.getByAutoId('cgtRequestModal-CCOID-Value').should('have.text', accUserInfoResponse.ccoId);
					cy.getByAutoId('cgtRequestModal-Country-Value').should('have.text', accUserInfoResponse.country);
				});

				it('Training session goal field has max length of 512 characters', () => {
					// Field with between 1-512 chars should be valid
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('junk')
						.should('have.class', 'ng-valid');

					// Field with more than 512 chars should be invalid
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('a'.repeat(513), { timeout: 2500 });	// Typing can take a while...

					// Field should only have ended up with 512 characters
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.invoke('val')
						.then(text => {
							expect(text.length).to.eq(512);
						});

					// Cleared field should be invalid
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.should('have.class', 'ng-invalid');
				});

				it('Preferred time options are exclusive', () => {
					// Select morning, afternoon should be unchecked
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning')
						.click()
						.parent()
						.find('input')
						.should('be.checked');
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Afternoon')
						.parent()
						.find('input')
						.should('not.be.checked');

					// Swap options to afternoon, should un-check morning
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Afternoon')
						.click()
						.parent()
						.find('input')
						.should('be.checked');
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning')
						.parent()
						.find('input')
						.should('not.be.checked');
				});

				it('Invalid fields should block form submission', () => {
					// Fill in all required fields
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
					cy.getByAutoId('cgtRequestModal-TechnologyArea-Select').select('Cloud');
					cy.getByAutoId('cgtRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning').click();
					cy.getByAutoId('cgtRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('Automation training goal');

					// Clear out each required field, verify the submit button is disabled
					// Note that selects have to be force-cleared, see here for reference:
					// https://stackoverflow.com/questions/56340978/how-do-i-clear-a-multi-select-input-using-cypress
					// Note also that radio buttons can NOT be unchecked, so check those separately
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select')
						.invoke('val', '')
						.trigger('change');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.disabled');
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled');

					cy.getByAutoId('cgtRequestModal-TechnologyArea-Select')
						.invoke('val', '')
						.trigger('change');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.disabled');
					cy.getByAutoId('cgtRequestModal-TechnologyArea-Select').select('Cloud');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled');

					cy.getByAutoId('cgtRequestModal-TimeZone-Select')
						.invoke('val', '')
						.trigger('change');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.disabled');
					cy.getByAutoId('cgtRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
					cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled');

					cy.getByAutoId('cgtRequestModal-LanguagePreference-Select')
						.invoke('val', '')
						.trigger('change');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.disabled');
					cy.getByAutoId('cgtRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled');

					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear();
					cy.getByAutoId('cgtRequestModal-Submit').should('be.disabled');
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('Automation training goal');
					cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled');
				});

				it('Form can NOT be submitted without picking radio options', () => {
					// Fill in all fields except radio buttons, submit should remain disabled
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
					cy.getByAutoId('cgtRequestModal-TechnologyArea-Select').select('Cloud');
					cy.getByAutoId('cgtRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
					cy.getByAutoId('cgtRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('Automation training goal');

					cy.getByAutoId('cgtRequestModal-Submit').should('be.disabled');

					// Make selections for the radio options, submit should now be enabled
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning').click();

					cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled');
				});

				it('Form should show error message when selected contract has 0 sessions left', () => {
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select')
						.select('111111');
					cy.getByAutoId('cgtRequestModal-NoSessionsAvailableBanner')
						.should('be.visible')
						.and('contain', 'No Sessions available for the contract');
				});
			});

			describe('Form completion/submission', () => {
				after(() => {
					// Re-enable default app-based mocks
					accUserInfoMock.enable('(ACC) ACC-Request User Info');
					cgtMock.enable('(CGT) CGT-Request Training');
				});

				it('Should be able to submit when all fields are filled correctly', () => {
					// Open the request form modal
					cy.getByAutoId('Request-CgtTraining').click();
					cy.getByAutoId('cgtRequestModal').should('be.visible');

					// Fill in all required fields
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
					cy.getByAutoId('cgtRequestModal-TechnologyArea-Select').select('Cloud');
					cy.getByAutoId('cgtRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning').click();
					cy.getByAutoId('cgtRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('Automation training goal');

					// Click submit, should show the success message (PBC-380)
					cy.getByAutoId('cgtRequestModal-Submit')
						.should('be.enabled')
						.click();
					cy.getByAutoId('cgtRequestModal-SubmitSuccessBanner')
						.should('exist')
						.and('have.text', i18n._RequestSuccess_);

					// Note that there is a ~5 second delay between showing success and closing the modal
					cy.getByAutoId('cgtRequestModal', { timeout: 6000 }).should('not.exist');
				});

				it('Should show error message when the form fails to submit', () => {
					// Create a new mock to force a 500 error and disable the default mock
					cy.server();
					cy.route({
						method: 'POST',
						url: '/api/customerportal/racetrack/v1/grouptraining/request',
						status: 500,
						response: 'Forced error from QA',
					}).as('cgtFailedPostRequestForm');
					cgtMock.disable('(CGT) CGT-Request Training');

					// Open the request form modal
					cy.getByAutoId('Request-CgtTraining').click();
					cy.getByAutoId('cgtRequestModal').should('be.visible');

					// Fill in all required fields
					cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
					cy.getByAutoId('cgtRequestModal-TechnologyArea-Select').select('Cloud');
					cy.getByAutoId('cgtRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
					cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning').click();
					cy.getByAutoId('cgtRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
						.clear()
						.type('Automation training goal');

					// Click submit, wait for the error response, verify we show the error message (PBC-380)
					cy.getByAutoId('cgtRequestModal-Submit')
						.should('be.enabled')
						.click();
					cy.wait('@cgtFailedPostRequestForm');
					cy.getByAutoId('cgtRequestModal-SubmitErrorBanner')
						.should('exist')
						.and('have.text', i18n._RequestError_);

					// Close the form
					cy.getByAutoId('Close-CgtForm').click();
				});
			});

			describe('API Integration', () => {
				beforeEach(() => {
					// Setup Cypress mocks and disable app-based mocks so we can verify calls/responses
					cy.server();
					cy.route({
						method: 'GET',
						url: '/api/customerportal/racetrack/v1/acc/request/user-info',
					}).as('getUserInfo');
					cy.route({
						method: 'POST',
						url: '/api/customerportal/racetrack/v1/grouptraining/request',
						status: 200,
						response: '',
					}).as('postRequestForm');

					accUserInfoMock.disable('(ACC) ACC-Request User Info');
					cgtMock.disable('(CGT) CGT-Request Training');
				});

				after(() => {
					// Re-enable default app-based mocks
					accUserInfoMock.enable('(ACC) ACC-Request User Info');
					cgtMock.enable('(CGT) CGT-Request Training');
				});

				it('Opening the Request CGT form should call user info API', () => {
					cy.getByAutoId('Request-CgtTraining').click();

					// Should show the loading header
					cy.getByAutoId('cgtRequestModal-LoadingCustomerInfoBanner')
						.should('exist')
						.and('have.text', i18n._LoadingCustomerInfo_);

					cy.wait('@getUserInfo').its('response.body').then(body => {
						cy.getByAutoId('cgtRequestModal-CompanyName-Value').should('have.text', body.companyName);
						cy.getByAutoId('cgtRequestModal-CustomerUserName-Value').should('have.text', body.userFullName);
						cy.getByAutoId('cgtRequestModal-JobTitle-Value').should('have.text', body.jobTitle);
						cy.getByAutoId('cgtRequestModal-Email-Value').should('have.text', body.userEmail);
						cy.getByAutoId('cgtRequestModal-Phone-Value').should('have.text', body.userPhoneNumber);
						cy.getByAutoId('cgtRequestModal-CiscoContact-Value').should('have.text', body.ciscoContact);
						cy.getByAutoId('cgtRequestModal-CCOID-Value').should('have.text', body.ccoId);
						cy.getByAutoId('cgtRequestModal-Country-Value').should('have.text', body.country);
					});

					// Should not show the loading banner after loading is complete
					cy.getByAutoId('cgtRequestModal-LoadingCustomerInfoBanner').should('not.exist');

					// Close the form
					cy.getByAutoId('Close-CgtForm').click();
					cy.getByAutoId('cgtRequestModal').should('not.exist');
				});

				it('Failed GET user-info calls should show an error message', () => {
					// Create a new route to force a 500 error
					cy.route({
						method: 'GET',
						url: '/api/customerportal/racetrack/v1/acc/request/user-info',
						status: 500,
						response: 'Forced error from QA',
					}).as('failedGetUserInfo');

					cy.getByAutoId('Request-CgtTraining').click();
					cy.wait('@failedGetUserInfo');

					// Should show the error header
					cy.getByAutoId('cgtRequestModal-UserInfoErrorBanner')
						.should('exist')
						.and('have.text', i18n._ErrorCustomerInfo_);

					// Close the form
					cy.getByAutoId('Close-CgtForm').click();
					cy.getByAutoId('cgtRequestModal').should('not.exist');
				});

				// TODO: Cuurently failing due to PBC-536: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-536
				it.skip('Submitting the Request form should call the POST /request API with user input', () => {
					// Open the request form modal
					cy.getByAutoId('Request-CgtTraining').click();
					cy.getByAutoId('cgtRequestModal').should('be.visible');
					cy.wait('@getUserInfo').its('response.body').then(() => {
						// Fill in all required fields
						cy.getByAutoId('cgtRequestModal-ApplicableContract-Select').select('222222');
						cy.getByAutoId('cgtRequestModal-TechnologyArea-Select').select('Cloud');
						cy.getByAutoId('cgtRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
						cy.getByAutoId('cgtRequestModal-PreferredTimeMeeting-Morning').click();
						cy.getByAutoId('cgtRequestModal-LanguagePreference-Select').select(i18n._English_);
						cy.getByAutoId('cgtRequestModal-TrainingGoal-Input')
							.clear()
							.type('Automation training goal');

						// Click submit, should close the modal
						// Note that there is a ~5 second delay between showing success and closing the modal
						cy.getByAutoId('cgtRequestModal-Submit').should('be.enabled').click();
						cy.getByAutoId('cgtRequestModal', { timeout: 6000 }).should('not.exist');

						// Wait for the API call and verify we sent the correct data
						cy.wait('@postRequestForm').its('request').then(request => {
							expect(request.body.contract)
								.to.include('222222');
							expect(request.body.pitstop)
								.to.include('Onboard');
							expect(request.body.preferredLanguage)
								.to.include('English');
							expect(request.body.preferredSlot)
								.to.include('Morning');
							expect(request.body.solution)
								.to.include('IBN');
							expect(request.body.technologyArea)
								.to.include('Cloud');
							expect(request.body.timezone)
								.to.include('Eastern Time/US');
							expect(request.body.trainingSessionGoal)
								.to.eq('Automation training goal');
							expect(request.body.usecase)
								.to.include('Campus Network Assurance');
						});
					});
					cy.getByAutoId('accRequestModal').should('not.exist');
				});
			});
		});
	});
});
