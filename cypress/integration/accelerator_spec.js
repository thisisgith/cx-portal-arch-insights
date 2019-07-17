import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios'); // for future changes
const solution = 'IBN';
const useCase = 'Wireless Assurance';
const accScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard`);
let accItems = accScenario.response.body.items;

// ACC items are being sorted by the UI in the following order by status:
// recommended, requested, in-progress, completed
// TODO: This sorting is currently incorrect. Should be in the following order, according to PBC-238
// requested, in-progress, recommended, completed
// Pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
accItems = Cypress._.union(Cypress._.filter(accItems, { status: 'recommended' }),
	Cypress._.filter(accItems, { status: 'requested' }),
	Cypress._.filter(accItems, { status: 'in-progress' }),
	Cypress._.filter(accItems, { status: 'completed' }));

const validACCItems = Cypress._.filter(accItems, acc => acc.description || acc.title);
const visibleACCItems = accItems.slice(0, 3);
const invisibleACCItems = accItems.slice(3);

// The recommended panel should only show the first recommended ACC item
const firstRecommendedACC = Cypress._.head(Cypress._.filter(accItems, { status: 'recommended' }));

// Default ACC request form customer data
const defaultCustomerData = {
	ccoID: '12345678',
	ciscoContact: 'CSE Name',
	companyName: 'Company',
	country: 'USA',
	email: 'Breadf23@company.com',
	jobTitle: 'Title',
	phoneNumber: '1-818-555-5555',
	userName: 'User',
};

const possibleAttendeesValues = [1, 2, 3, 4, 5];

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Accelerator (ACC)', () => { // PBC-32
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for the ACC panel to finish loading
		cy.waitForAppLoading('accLoading', 15000);
	});

	it('Renders Accelerator tile', () => {
		cy.getByAutoId('Accelerator Panel').should('exist');
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', i18n._Accelerator_);
		cy.getByAutoId('recommendedACC-Flag').should('exist');
		cy.getByAutoId('recommendedACC-Title').should('have.text', 'Cisco DNA Center Project Planning');
		cy.getByAutoId('recommendedACCWatchButton').should('have.text', i18n._Request1on1_);
		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});

	it('ACC tile has a view all link to display ACCs in card view', () => { // PBC-159
		cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		cy.get('.modal__header.acc__header').should('contain', i18n._Accelerator_)
			.and('contain', i18n._1on1Coaching_);
		cy.getByAutoId('ACCTopicsAvailable').should(
			'have.text', `${validACCItems.length} topics available for ${solution} > ${useCase}:`
		);

		cy.getByAutoId('ACCCard').then($cards => {
			expect($cards.length).to.eq(validACCItems.length);
		});

		validACCItems.forEach((acc, index) => {
			cy.getByAutoId('ACCCard').eq(index).within(() => {
				if (acc.status === 'recommended') {
					cy.getByAutoId('ACCCardHeader').should('have.class', 'text-info');
				} else {
					cy.getByAutoId('ACCCardHeader').should('have.class', 'text-clear');
				}
				cy.getByAutoId('ACCCardTitle').should('have.text', acc.title);
				cy.get('.atx-card__body').should('contain', acc.description);
				switch (acc.status) {
					case 'completed':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', 'Completed');
						break;
					case 'in-progress':
					case 'requested':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', i18n._CSETouch_);
						break;
					default:	// Default: recommended
						cy.getByAutoId('Request1on1Button')
							.should('contain', i18n._Request1on1_);
				}

				// PBC-237 Check bookmark ribbon
				if (acc.status === 'completed') {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__green');
					cy.get('.star').should('exist');
				} else if (acc.isFavorite) {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__blue');
				} else {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__clear');
				}
			});
		});
		cy.getByAutoId('ACCCloseModal').click();
	});

	describe('PBC-33: (UI) View - Solution Based: ACC Details', () => {
		afterEach(() => {
			// Make sure we're set back to the default mock data
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-Empty');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');
		});

		it.skip('Should only display the ACC section if there are ACC items', () => {
			// TODO: Waiting on PBC-317: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-317
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-Empty');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');

			// The section should not exist at all
			cy.getByAutoId('Accelerator Panel').should('not.exist');
			cy.getByAutoId('recommendedACC').should('not.exist');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('Should only display up to two items in the more list', () => {
			// Verify only up to the first three ACC shown
			// Note, however, the first recommended item will be displayed outside the More list
			// TODO: Will need to be updated to account for cases where the first ACC is not
			// recommended, but this is pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
			const accMoreItems = visibleACCItems.slice(1, 3);
			accMoreItems.forEach(acc => {
				cy.getByAutoId('moreACCList-item')
					.should('contain', acc.title);
			});
			invisibleACCItems.forEach(acc => {
				cy.getByAutoId('moreACCList-item')
					.should('not.contain', acc.title);
			});
		});
	});

	describe('PBC-166: Mouse hover to show recommended ACC/ATX description', () => {
		// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
		// that the hover modal and it's elements exist in the DOM. See below for reference:
		// https://docs.cypress.io/api/commands/hover.html#Workarounds
		// https://github.com/cypress-io/cypress/issues/10

		afterEach(() => {
			// Ensure we are set back to mock data with a recommended item
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-Empty');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneNonRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-allButRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data by clicking the lifecycle tab, and wait for load
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading', 5000);
		});

		it('Accelerator Tile Tooltip', () => {
			if (firstRecommendedACC) {
				// Recommended panel should show title, image (placeholder), and request button
				cy.getByAutoId('recommendedACC').should('exist');
				cy.getByAutoId('recommendedACC-Title').should('exist')
					.and('contain', firstRecommendedACC.title);
				cy.getByAutoId('recommendedACC-Image').should('exist')
					.and('have.attr', 'src', 'assets/img/solutions/acc.png');
				cy.getByAutoId('recommendedACCWatchButton').should('exist')
					.and('have.text', 'Request a 1-on-1');

				// Recommended hover modal should show title and description
				cy.getByAutoId('recommendedACC-HoverModal').should('exist');
				cy.getByAutoId('recommendedACC-HoverModal-Title').should('exist')
					.and('contain', firstRecommendedACC.title);
				cy.getByAutoId('recommendedACC-HoverModal-Description').should('exist')
					.and('contain', firstRecommendedACC.description);
			}
		});

		it.skip('Should not have hover modal if there are no recommended ACC', () => {
			// TODO: Pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
			// Switch the mock data to one with no recommended items
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-allButRecommended');

			// Refresh the data by clicking the lifecycle tab, and wait for load
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading', 5000);

			cy.getByAutoId('recommendedACC').should('not.exist');
		});
	});

	describe('PBC-220: (UI View) - Lifecycle  - ACC - Request Form', () => {
		it('PBC-260: Should be able to open request form from Lifecycle page', () => {
			cy.getByAutoId('recommendedACCWatchButton').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		it('PBC-260: Should be able to open request form from View All cards', () => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('Request1on1Button').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
			cy.getByAutoId('ACCCloseModal').click();
		});

		it('PBC-260: Should be able to close or cancel request form', () => {
			cy.getByAutoId('recommendedACCWatchButton').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');

			cy.getByAutoId('recommendedACCWatchButton').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('accRequestModal-Cancel').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		describe('Form field validation', () => {
			beforeEach(() => {
				// Start with a clean modal for each test
				cy.getByAutoId('recommendedACCWatchButton').click();
				cy.getByAutoId('accRequestModal').should('be.visible');
			});

			afterEach(() => {
				cy.getByAutoId('ACCCloseRequestModal').click();
				cy.getByAutoId('accRequestModal').should('not.exist');
			});

			it('PBC-260: Request 1-on-1 form should have all required fields', () => {
				// Check the titles
				cy.getByAutoId('accRequestModal-Title').should('have.text', i18n._Request1on1_);
				cy.getByAutoId('accRequestModal-SubTitle').should('have.text', i18n._FindCiscoExpert_);
				cy.getByAutoId('accRequestModal-ItemTitle').should('have.text', firstRecommendedACC.title);

				// Check the pre-filled field headings
				cy.getByAutoId('accRequestModal-CompanyName-Heading').should('have.text', i18n._CompanyName_);
				cy.getByAutoId('accRequestModal-CustomerUserName-Heading').should('have.text', i18n._CustomerUserName_);
				cy.getByAutoId('accRequestModal-JobTitle-Heading').should('have.text', i18n._JobTitle_);
				cy.getByAutoId('accRequestModal-Email-Heading').should('have.text', i18n._Email_);
				cy.getByAutoId('accRequestModal-Phone-Heading').should('have.text', i18n._Phone_);
				cy.getByAutoId('accRequestModal-CiscoContact-Heading').should('have.text', i18n._CiscoContact_);
				cy.getByAutoId('accRequestModal-CCOID-Heading').should('have.text', i18n._CCOID_);
				cy.getByAutoId('accRequestModal-Country-Heading').should('have.text', i18n._Country_);

				// Check the user-entry field headings
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Heading').should('have.text', i18n._NumberOfAttendees_);
				cy.getByAutoId('accRequestModal-TimeZone-Heading').should('have.text', i18n._TimeZone_);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Heading').should('have.text', i18n._PreferredTimeMeeting_);
				cy.getByAutoId('accRequestModal-LanguagePreference-Heading').should('have.text', i18n._LanguagePreference_);
				cy.getByAutoId('accRequestModal-DNACVersion-Heading').should('have.text', i18n._DNACVersion_);
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Heading').should('have.text', i18n._WhyInterestedAccelerator_);
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Heading').should('have.text', i18n._WhatWouldLikeToSeeOutcome_);
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Heading').should('have.text', i18n._PreferredEnvironmentAccelerator_);
			});

			it('PBC-260: Request 1-on-1 form should have employee information pre-filled', () => {
				// TODO: This is default data. When PBC-259 is complete, switch to use mocks
				cy.getByAutoId('accRequestModal-CompanyName-Value').should('have.text', defaultCustomerData.companyName);
				cy.getByAutoId('accRequestModal-CustomerUserName-Value').should('have.text', defaultCustomerData.userName);
				cy.getByAutoId('accRequestModal-JobTitle-Value').should('have.text', defaultCustomerData.jobTitle);
				cy.getByAutoId('accRequestModal-Email-Value').should('have.text', defaultCustomerData.email);
				cy.getByAutoId('accRequestModal-Phone-Value').should('have.text', defaultCustomerData.phoneNumber);
				cy.getByAutoId('accRequestModal-CiscoContact-Value').should('have.text', defaultCustomerData.ciscoContact);
				cy.getByAutoId('accRequestModal-CCOID-Value').should('have.text', defaultCustomerData.ccoID);
				cy.getByAutoId('accRequestModal-Country-Value').should('have.text', defaultCustomerData.country);
			});

			it('PBC-260: Selecting number of attendees should configure additional attendee fields', () => {
				possibleAttendeesValues.forEach((option, index) => {
					cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select(option.toString());
					const visibleFields = possibleAttendeesValues.slice(0, index);
					const invisibleFields = possibleAttendeesValues.slice(index,
						possibleAttendeesValues.length - 1);

					if (option === 1) {
						// 1 attendee will not show any additional fields/headers
						cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Heading').should('not.exist');
						cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Heading').should('not.exist');
					} else {
						// 2 or more attendees will show fields/headers
						cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Heading').should('exist');
						cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Heading').should('exist');
					}

					visibleFields.forEach(visibleOption => {
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${visibleOption - 1}`).should('exist');
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${visibleOption - 1}`).should('exist');
					});
					invisibleFields.forEach(invisibleOption => {
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${invisibleOption - 1}`).should('not.exist');
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${invisibleOption - 1}`).should('not.exist');
					});
				});
			});

			it('PBC-260: Interested field has max length of 512 characters', () => {
				// Field with between 1-512 chars should be valid
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.clear()
					.type('junk')
					.should('have.class', 'ng-valid');

				// Field with more than 512 chars should be invalid
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.clear()
					.type('a'.repeat(513), { timeout: 2500 })	// Typing can take a while...
					.should('have.class', 'ng-invalid');

				// Blank field should be invalid
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.clear()
					.should('have.class', 'ng-invalid');
			});

			it('PBC-260: Outcome field has max length of 512 characters', () => {
				// Field with between 1-512 chars should be valid
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.clear()
					.type('junk')
					.should('have.class', 'ng-valid');

				// Field with more than 512 chars should be invalid
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.clear()
					.type('a'.repeat(513), { timeout: 2500 })	// Typing can take a while...
					.should('have.class', 'ng-invalid');

				// Blank field should be invalid
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.clear()
					.should('have.class', 'ng-invalid');
			});

			it('PBC-260: Email fields should require valid emails', () => {
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('5');

				// Note with 5 attendees, we only show 4 fields ('additional' attendees)
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.clear()
						.type('im-an-invalid-email')
						.should('have.class', 'ng-invalid');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.clear()
						.type('valid@cisco.com')
						.should('have.class', 'ng-valid');
				});
			});

			it('PBC-260: Decreasing number of attendees should clear name and email', () => {
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('5');

				// Note with 5 attendees, we only show 4 fields ('additional' attendees)
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${index - 1}`)
						.clear()
						.type(`Automation User ${index}`)
						.should('have.class', 'ng-valid');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.clear()
						.type(`automation_user_${index}@cisco.com`)
						.should('have.class', 'ng-valid');
				});

				// Decrease number of attendees to 1, verify the addtional name/email fields went away
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${index - 1}`)
						.should('not.exist');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.should('not.exist');
				});

				// Increase back to 5 attendees, verify the fields are blank again
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('5');
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${index - 1}`)
						.should('have.text', '');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.should('have.text', '');
				});
			});

			it('PBC-260: Preferred time options are exclusive', () => {
				// Select morning, afternoon should be unchecked
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
					.click()
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Afternoon')
					.parent()
					.find('input')
					.should('not.be.checked');

				// Swap options to afternoon, should un-check morning
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Afternoon')
					.click()
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
					.parent()
					.find('input')
					.should('not.be.checked');
			});

			it('PBC-260: Environment options are exclusive', () => {
				// Select NonProd, Cisco should be unchecked
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd')
					.click()
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Cisco')
					.parent()
					.find('input')
					.should('not.be.checked');

				// Swap options to Cisco, should un-check NonProd
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Cisco')
					.click()
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd')
					.parent()
					.find('input')
					.should('not.be.checked');
			});

			it('PBC-260: Invalid fields should block form submission', () => {
				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				// Clear out each required field, verify the submit button is disabled
				// Note that selects have to be force-cleared, see here for reference:
				// https://stackoverflow.com/questions/56340978/how-do-i-clear-a-multi-select-input-using-cypress
				// Note also that radio buttons can NOT be unchecked, so check thos separately
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-TimeZone-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-LanguagePreference-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-DNACVersion-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				// Add an additional attendee and check the name/email fields block submission as well
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('2');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
					.clear()
					.type('Automation User 1');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
					.clear()
					.type('automation_user_0@cisco.com');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
					.clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
					.clear()
					.type('Automation User 1');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
					.clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
					.clear()
					.type('automation_user_0@cisco.com');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');
			});

			it('PBC-260: Form can NOT be submitted without picking radio options', () => {
				// Fill in all fields except radio buttons, submit should remain disabled
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');

				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');

				// Make selections for the radio options, submit should now be enabled
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');
			});
		});

		describe('Form completion/submission', () => {
			after(() => {
				// Reload the app to clear the pending scheduled item
				cy.loadApp();
				cy.waitForAppLoading();

				// Wait for the ACC panel to finish loading
				cy.waitForAppLoading('accLoading', 15000);
			});

			// TODO: PBC-259 tests to check API calls on form submission

			it('PBC-260: Should be able to submit when all fields are filled correctly', () => {
				// Open the request form modal
				cy.getByAutoId('recommendedACCWatchButton').click();
				cy.getByAutoId('accRequestModal').should('be.visible');

				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

				// Click submit, should close the modal, and display the confirmation text
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled').click();
				cy.getByAutoId('accRequestModal').should('not.exist');
				cy.getByAutoId('accRequestSubmitted').should('be.visible').and('have.text', i18n._ACCRequestSubmitted_);
			});
		});
	});

	describe('PBC-237: (UI) View -  Lifecycle - ACC Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		});

		after(() => {
			cy.getByAutoId('ACCCloseModal').click();

			// Reload the page to force-reset any changed bookmarks
			// This is required since the mock bookmark APIs don't actually bookmark the ACC items
			cy.loadApp();
			cy.waitForAppLoading();

			// Wait for the ACC panel to finish loading
			cy.waitForAppLoading('accLoading', 15000);
		});

		it('Should be able to bookmark an ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (!acc.isFavorite && acc.status !== 'completed') {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__clear')
							.click();
						cy.waitForAppLoading('accLoading', 5000);
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue');
					}
				});
			});
		});

		it('Should be able to UN-bookmark an ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (acc.isFavorite && acc.status !== 'completed') {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue')
							.click();
						cy.waitForAppLoading('accLoading', 5000);
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__clear');
					}
				});
			});
		});

		it('Should NOT be able to bookmark a completed ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (acc.status === 'completed') {
						// For completed items, the ribbon is behind the star, so force the click through
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.click({ force: true });
						cy.waitForAppLoading('accLoading', 5000);
						// Ribbon should remain green
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__green');
					}
				});
			});
		});
	});

	describe('PBC-238: (UI) View - Lifecycle - ACC List & Hover', () => {
		before(() => {
			// Ensure we're set to the default mock data
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-Empty');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneNonRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-allButRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');
		});

		afterEach(() => {
			// Make sure we're set back to the default mock data
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');
		});

		it('Should only show the More section if there is more than 1 ACC item', () => {
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');

			// Should hide the "More" list
			cy.getByAutoId('moreACCList-Header');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('ACC More list items should have hover modal', () => {
			// TODO: Will need to be updated to account for cases where the first ACC is not
			// recommended, but this is pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
			const accMoreItems = visibleACCItems.slice(1, 3);
			accMoreItems.forEach((acc, index) => {
				cy.getByAutoId('moreACCList-item').eq(index).within(() => {
					cy.getByAutoId('moreACCList-HoverModal').should('exist').within(() => {
						cy.getByAutoId('moreACCList-HoverModal-Title').should('have.text', acc.title);
						cy.getByAutoId('moreACCList-HoverModal-Description').should('have.text', acc.description);
						cy.getByAutoId('ACCCardRibbon').should('exist');

						// Ribbon is blue for bookmarked, green w/ star for completed, clear otherwise
						if (acc.isFavorite) {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__blue');
							cy.getByAutoId('.star').should('not.exist');
						} else if (acc.status === 'completed') {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__green');
							// cy.getByAutoId('.star').should('exist'); TODO: Pending PBC-325
						} else {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__clear');
							cy.getByAutoId('.star').should('not.exist');
						}
					});
				});
			});
		});
	});
});
