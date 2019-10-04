import RacetrackHelper from '../support/racetrackHelper';
import MockService from '../support/mockService';

let racetrackHelper;
let trackPoints;

const infoMock = new MockService('RacetrackScenarios');
const accMock = new MockService('ACCScenarios');
const atxMock = new MockService('ATXScenarios');
const elearningMock = new MockService('ELearningScenarios');
const successPathsMock = new MockService('SuccessPathScenarios');
const allManualCheckableScenario = infoMock.getScenario('GET',
	'(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
const allManualCheckableItems = allManualCheckableScenario.response.body.solutions[0];
// Abbrevieating Campus Network Assurance to CNA
const allManualCheckableCNATech = Cypress._.find(allManualCheckableItems.technologies,
	tech => tech.name === 'Campus Network Assurance');
const allManualCheckableCNAPitstopActions = Cypress._.find(
	allManualCheckableCNATech.pitstops,
	pitstop => pitstop.name === allManualCheckableCNATech.currentPitstop
).pitstopActions;

const defaultScenario = infoMock.getScenario('GET',
	'(Racetrack) IBN-Assurance-Onboard');
const defaultCheckableItems = defaultScenario.response.body.solutions[0];
// Abbrevieating Campus Network Assurance to CNA
const defaultCheckableCNATech = Cypress._.find(defaultCheckableItems.technologies,
	tech => tech.name === 'Campus Network Assurance');
const defaultCurrentPitstopActions = Cypress._.find(
	defaultCheckableCNATech.pitstops,
	pitstop => pitstop.name === defaultCheckableCNATech.currentPitstop
).pitstopActions;

const actionMock = new MockService('ActionScenarios');

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Racetrack Content', () => {
	before(() => {
		cy.login();
		cy.loadApp();

		// Disable the setup wizard and quick tour so they don't block other elements
		cy.window().then(win => {
			win.Cypress.hideDNACHeader = true;
			win.Cypress.showQuickTour = false;
		});

		cy.waitForAppLoading();

		// Pull all the points off the track for rotation and position calculations
		cy.get('#secrettrack').then(track => {
			const pointsLength = parseFloat(track.attr('pointslength'));
			trackPoints = Array.from({ length: pointsLength });
			racetrackHelper = new RacetrackHelper(parseFloat(track.attr('tracklength')), pointsLength);
			for (let index = 0; index < pointsLength; index += 1) {
				trackPoints[index] = { x: parseFloat(track.attr(`point${index}x`)), y: parseFloat(track.attr(`point${index}y`)) };
			}
		});
	});

	const stages = [
		// 'Onboard', // Can not click current pitstop, as it is covered by the car
		'Implement',
		'Use',
		'Engage',
		'Adopt',
		'Optimize',
	];
	stages.forEach(stageName => {
		// TODO: Racetrack was re-built and broke these events... Needs re-work...
		context.skip(`Click to preview "${stageName}" Stage`, () => {
			before(() => {
				// Click the stage circle to move the car there
				// When scaling, points can end up "behind" the car or the secrettrack, so we need to
				// force the click
				cy.getByAutoId(`Racetrack-Point-${stageName}`).click({ force: true });

				// Wait for the progress to finish moving
				cy.wait('progressMovingEnd', { eventObj: 'racetrackEvents' });
			});

			// TODO: This test "works", but introduces flake, so stability needs investigating
			it.skip('Progress Position', () => {
				cy.get('#progress').then(progressPath => {
					const progressStrokeDasharray = progressPath.attr('stroke-dasharray');
					const expectedStrokeDasharray = racetrackHelper
						.calculateTrackProgress(stageName);

					expect(progressStrokeDasharray).eq(expectedStrokeDasharray);
				});
			});

			it('pitstopActions checklist should update with preview', () => {
				const previewPitstopActions = Cypress._.find(
					defaultCheckableCNATech.pitstops,
					pitstop => pitstop.name === stageName.charAt(0).toUpperCase() + stageName.slice(1)
				).pitstopActions;

				previewPitstopActions.forEach((action, index) => {
					cy.getByAutoId('pitstopAction')
						.eq(index)
						.should('contain', action.name);
				});
			});

			it('PBC-600: pitstopActions title/percentage should remain at currentPitstop', () => {
				cy.getByAutoId('CurrentPitstopTitle')
					.should('have.text', defaultCheckableCNATech.currentPitstop);

				const currentPitstop = Cypress._.find(
					defaultCheckableCNATech.pitstops,
					pitstop => pitstop.name === defaultCheckableCNATech.currentPitstop
				);
				const expectedPercent = currentPitstop.pitstop_adoption_percentage;
				if (expectedPercent === 0) {
					cy.getByAutoId('CompletedActionsPercent')
						.should('contain', 'start');
				} else {
					cy.getByAutoId('CompletedActionsPercent')
						.should('contain', `${expectedPercent}%`);
				}
			});
		});
	});

	stages.forEach(stageName => {
		// TODO: This test "works", but introduces flake, so stability needs investigating
		// TODO: Racetrack was re-built and broke these events... Needs re-work...
		context.skip(`Car Position - currentPitstop: "${stageName}"`, () => {
			let expectedCoords;
			let expectedRotations;

			before(() => {
				// Change the mock data to put the car on each pitstop
				infoMock.enable(`(Racetrack) IBN-Assurance-${stageName.charAt(0).toUpperCase() + stageName.slice(1)}`);
				// Unfortunately for Cypress, the racetrack panel only reloads data on page load...
				cy.loadApp();
				cy.waitForAppLoading();

				// Wait for the car to finish moving
				cy.wait('carMovingEnd', { eventObj: 'racetrackEvents' });

				cy.getByAutoId(`Racetrack-Point-${stageName}`).then(point => {
					expectedRotations = racetrackHelper
						.calculateRacecarRotations(point, trackPoints);

					const pointCX = parseFloat(point.attr('cx'));
					const pointCY = parseFloat(point.attr('cy'));

					expectedCoords = racetrackHelper
						.calculateRacecarCoords(pointCX, pointCY, expectedRotations);
				});
			});

			after(() => {
				// Switch back to the default mock data
				infoMock.enable('(Racetrack) IBN-Assurance-Onboard');
				// Unfortunately for Cypress, the racetrack panel only reloads data on page load...
				cy.loadApp();
				cy.waitForAppLoading();
			});

			it('Car Position', () => {
				/**
				 * Get the car's transform, verify the coordinates are "close enough"
				 * Note: The calculations will probably not match the transform attribute exactly, looks
				 * like the SVG transform gets mangled slightly.
				 * For example, setting an element to [100, 100] works, but setting an element to
				 * [100.1, 100.1] becomes translate(100.0999984741211, 100.0999984741211)... Go figure...
				 * Also, since the rounding does not appear to be linear, we'll check that the translate is
				 * within +/- 1 of the expected values, to account for future moving/scaling/etc.
				 */
				cy.get('#racecar').should('have.attr', 'transform').then(transform => {
					// Note: The tranform attribute look like transform: "translate(10, 20) rotate(30)"
					const transformSplit = transform.split(' ');
					const translateX = parseFloat(transformSplit[0].replace('translate(', ''));
					const translateY = parseFloat(transformSplit[1].replace(')', ''));
					const transformRotate = parseFloat(transformSplit[2]
						.replace('rotate(', '').replace(')', ''));
					expect(translateX).to.be.within(expectedCoords.x - 1, expectedCoords.x + 1);
					expect(translateY).to.be.within(expectedCoords.y - 1, expectedCoords.y + 1);

					// Sometimes, D3 doesn't actually convert the rotations to between [-179, 180]...
					// I can't for the life of me find why, so this is a hack to handle this flake...
					if (transformRotate > 180.0) {
						expect(transformRotate)
							.to.be.within(expectedRotations + 359, expectedRotations + 361);
					} else {
						expect(transformRotate)
							.to.be.within(expectedRotations - 1, expectedRotations + 1);
					}
				});
			});
		});
	});

	// TODO: Racetrack was re-built and broke these events... Needs re-work...
	describe.skip('Racetrack Arrows', () => {
		before(() => {
			// Ensure we are using the default mock data
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard');
			// Unfortunately for Cypress, the racetrack panel only reloads data on page load...
			cy.loadApp();
			cy.waitForAppLoading();
		});

		afterEach(() => {
			// Refresh the page to reset any preview movement
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Clicking right arrow should advance preview one pitstop', () => {
			cy.getByAutoId('Racetrack-RightArrow').click();
			cy.wait('progressMovingEnd', { eventObj: 'racetrackEvents' });
			cy.get('#progress').then(progressPath => {
				const progressStrokeDasharray = progressPath.attr('stroke-dasharray');
				const expectedStrokeDasharray = racetrackHelper
					.calculateTrackProgress('implement');

				expect(progressStrokeDasharray).eq(expectedStrokeDasharray);
			});
		});

		it('Clicking left arrow should move preview back one pitstop', () => {
			cy.getByAutoId('Racetrack-LeftArrow').click();
			cy.wait('progressMovingEnd', { eventObj: 'racetrackEvents' });
			cy.get('#progress').then(progressPath => {
				const progressStrokeDasharray = progressPath.attr('stroke-dasharray');
				const expectedStrokeDasharray = racetrackHelper
					.calculateTrackProgress('optimize');

				expect(progressStrokeDasharray).eq(expectedStrokeDasharray);
			});
		});
	});

	describe('PBC-116: Lifecycle: Selectable Pitstop Action', () => {
		before(() => {
			// Disable all default content mocks
			accMock.disable('(ACC) IBN-Campus Network Assurance-Onboard');
			atxMock.disable('(ATX) IBN-Campus Network Assurance-Onboard');
			elearningMock.disable('(E-Learning) IBN-Campus Network Assurance-Onboard');
			successPathsMock.disable('(SP) IBN-Campus Network Assurance-Onboard');
		});

		beforeEach(() => {
			// Setup Cypress mocks to intercept each content type's calls
			cy.server();
			cy.route({
				method: 'GET',
				url: '/api/customerportal/racetrack/v1/acc*',
				status: 200,
				response: '',
			}).as('getACC');
			cy.route({
				method: 'GET',
				url: '/api/customerportal/racetrack/v1/atx*',
				status: 200,
				response: '',
			}).as('getATX');
			cy.route({
				method: 'GET',
				url: '/api/customerportal/racetrack/v1/elearning*',
				status: 200,
				response: '',
			}).as('getELearning');
			cy.route({
				method: 'GET',
				url: '/api/customerportal/racetrack/v1/successPaths*',
				status: 200,
				response: '',
			}).as('getSuccessPaths');
		});

		after(() => {
			// Re-enable the default mocks
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');
			atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard');
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard');
			successPathsMock.enable('(SP) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
		});

		defaultCurrentPitstopActions.forEach(action => {
			it(`Selecting pitstop actions should filter API calls: ${action.name}`, () => {
				// Click the pitstop action
				cy.getByAutoId(`actionLink-${action.name}`).click();

				// Verify all four API calls are made with the expected suggestedAction param
				cy.wait('@getACC').its('url').then(url => {
					expect(url).to.include(`suggestedAction=${action.name}`);
				});
				cy.wait('@getATX').its('url').then(url => {
					expect(url).to.include(`suggestedAction=${action.name}`);
				});
				cy.wait('@getELearning').its('url').then(url => {
					expect(url).to.include(`suggestedAction=${action.name}`);
				});
				cy.wait('@getSuccessPaths').its('url').then(url => {
					expect(url).to.include(`suggestedAction=${action.name}`);
				});
			});
		});

		it('Clicking the reset filters link should remove suggestedAction param', () => {
			const firstAction = defaultCurrentPitstopActions[0];
			// Click the first pitstop action
			cy.getByAutoId(`actionLink-${firstAction.name}`).click();

			// Verify all four API calls are made with the expected suggestedAction param
			cy.wait('@getACC').its('url').then(url => {
				expect(url).to.include(`suggestedAction=${firstAction.name}`);
			});
			cy.wait('@getATX').its('url').then(url => {
				expect(url).to.include(`suggestedAction=${firstAction.name}`);
			});
			cy.wait('@getELearning').its('url').then(url => {
				expect(url).to.include(`suggestedAction=${firstAction.name}`);
			});
			cy.wait('@getSuccessPaths').its('url').then(url => {
				expect(url).to.include(`suggestedAction=${firstAction.name}`);
			});

			// Clear the pitstop action filter
			cy.getByAutoId('ResetFilter').click();

			// Verify all four API calls are made WITHOUT the suggestedAction param
			cy.wait('@getACC').its('url').then(url => {
				expect(url).to.not.include(`suggestedAction=${firstAction.name}`);
			});
			cy.wait('@getATX').its('url').then(url => {
				expect(url).to.not.include(`suggestedAction=${firstAction.name}`);
			});
			cy.wait('@getELearning').its('url').then(url => {
				expect(url).to.not.include(`suggestedAction=${firstAction.name}`);
			});
			cy.wait('@getSuccessPaths').its('url').then(url => {
				expect(url).to.not.include(`suggestedAction=${firstAction.name}`);
			});
		});
	});

	describe('PBC-123: Lifecycle: Pitstop Action checkbox', () => {
		const allCheckableScenario = infoMock.getScenario('GET', '(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
		const allCheckableSolutions = allCheckableScenario.response.body.solutions[0];
		const allCheckableTech = Cypress._.find(allCheckableSolutions.technologies, tech => tech.name === 'Campus Network Assurance');
		const allCheckableActions = Cypress._.find(
			allCheckableTech.pitstops, pitstop => pitstop.name === allCheckableTech.currentPitstop
		).pitstopActions;

		beforeEach(() => {
			// Setup our own mock so we can intercept PATCH calls for checking items
			cy.server();
			cy.route({
				method: 'PUT',
				url: '**/api/customerportal/pitstop/v1/action/status',
				status: 200,
				response: {},
			}).as('putActionStatus');
			actionMock.disable('Update to complete the first Action');
		});

		afterEach(() => {
			// To uncheck items, we have to nuke the mock and refresh the page completely...
			cy.clearLocalStorage('MockDB');
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Checking a pitstop action should call SDP API', () => {
			// Switch mocks and refresh the page
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
			cy.loadApp();
			cy.waitForAppLoading();

			allCheckableActions.forEach((action, index) => {
				cy.getByAutoId('pitstopCheckboxSpan')
					.eq(index)
					.click({ force: true });
				cy.wait('@putActionStatus');
			});
		});

		it('SDP API 200 response for checked item should trigger data refreshes', () => {
			// Switch mocks
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allManualCheckable');

			// Set up mocks for all Lifecycle GETs
			cy.route({
				method: 'GET',
				url: '**/api/customerportal/racetrack/v1/acc*',
			}).as('getACC');
			cy.route({
				method: 'GET',
				url: '**/api/customerportal/racetrack/v1/atx*',
			}).as('getATX');
			// cy.route({
			// 	method: 'GET',
			// 	url: '**/api/customerportal/racetrack/v1/communities*',
			// }).as('getCommunities');	// TODO: There is no communities API yet
			cy.route({
				method: 'GET',
				url: '**/api/customerportal/racetrack/v1/elearning*',
			}).as('getELearning');
			cy.route({
				method: 'GET',
				url: '**/api/customerportal/racetrack/v1/successPaths*pitstop*',
			}).as('getSuccessPaths');
			infoMock.disable('(ACC) IBN-Campus Network Assurance-Onboard');
			infoMock.disable('(ATX) IBN-Campus Network Assurance-Onboard');
			// infoMock.disable('COMMUNITIES API MOCK');	// TODO: There is no communities API yet
			infoMock.disable('(E-Learning) IBN-Campus Network Assurance-Onboard');
			infoMock.disable('(SP) IBN-Campus Network Assurance-Onboard');

			// Reload to load in the new mock data
			cy.loadApp();
			cy.waitForAppLoading();
			// Wait for all the GET calls to settle, so the Cypress mocks don't get confused
			cy.wait('@getACC');
			cy.wait('@getATX');
			// cy.wait('@getCommunities');	// TODO: There is no communities API yet
			cy.wait('@getELearning');
			cy.wait('@getSuccessPaths');

			// Click a checkbox and wait for the PUT call to complete
			cy.getByAutoId('pitstopCheckboxSpan')
				.first()
				.click();
			cy.wait('@putActionStatus');

			// Verify all of the other Lifecycle APIs were called to refresh the data with the next
			// suggestedAction
			cy.wait('@getACC')
				.its('url')
				.then(url => {
					expect(url).to.contain(`suggestedAction=${allCheckableActions[1].name}`);
				});
			cy.wait('@getATX')
				.its('url')
				.then(url => {
					expect(url).to.contain(`suggestedAction=${allCheckableActions[1].name}`);
				});
			// TODO: There is no communities API yet
			// cy.wait('@getCommunities')
			// 	.its(url => {
			// 	expect(url).to.contain(`suggestedAction=${allCheckableActions[1].name}`);
			// 	});
			cy.wait('@getELearning')
				.its('url')
				.then(url => {
					expect(url).to.contain(`suggestedAction=${allCheckableActions[1].name}`);
				});
			cy.wait('@getSuccessPaths')
				.its('url')
				.then(url => {
					expect(url).to.contain(`suggestedAction=${allCheckableActions[1].name}`);
				});
		});

		it('Pitstop actions should be checkable in any order', () => {
			// Switch mocks and refresh the checkboxes
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
			cy.loadApp();
			cy.waitForAppLoading();

			// Randomize the order of the pitstop actions
			const actionsShuffled = Cypress._.shuffle(allCheckableActions);
			actionsShuffled.forEach(action => {
				cy.getByAutoId('pitstopAction')
					.contains(action.name) // cy.contains will return the action link <a>
					.parentsUntil('[data-auto-id="pitstopAction"]')	// Back us up to the parent pitstopAction
					.within(() => {
						cy.getByAutoId('pitstopCheckboxSpan')
							.click({ force: true });
						cy.wait('@putActionStatus');
					});
			});
		});

		it('Pitstop actions that are checked should not be un-checkable', () => {
			// Switch mocks and refresh the checkboxes
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allCompleted');
			cy.loadApp();
			cy.waitForAppLoading();

			cy.getByAutoId('pitstopCheckboxLabel').each($checkbox => {
				cy.wrap($checkbox).should('have.class', 'disabled');
			});
		});

		it('Checking the last pitstop action should show popup', () => {
			// Switch mocks and refresh the page
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
			cy.loadApp();
			cy.waitForAppLoading();

			// Check all the items
			allCheckableActions.forEach((action, index) => {
				cy.getByAutoId('pitstopCheckboxSpan')
					.eq(index)
					.click({ force: true });
				cy.wait('@putActionStatus');
			});

			// Check that the pop-up message is present
			cy.getByAutoId('AllCompletionPopup')
				.should('exist')
				.within(() => {
					cy.getByAutoId('AllCompletionPopup-Flag').should('exist');
					cy.getByAutoId('AllCompletionPopup-Title')
						.should('exist')
						.and('have.text', i18n._NiceJob_);
					cy.getByAutoId('AllCompletionPopup-Message')
						.should('exist')
						.and('contain', 'Your checklist status will be updated within 24 hrs so you can keep cruising in');
				});

			// Check that the pop-up message fades away
			cy.wait(5000);
			cy.getByAutoId('AllCompletionPopup').should('not.exist');
		});
	});

	describe('PBC-124: Lifecycle: Pitstop percentage completed', () => {
		after(() => {
			// Ensure we're set back to the default mock data
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard');
			cy.loadApp();
			cy.waitForAppLoading();
		});

		// PBC-725 has disabled all checkboxes in the pitstopActions list
		it.skip('Checking a pitstop action should update the completion percentage', () => {
			// Switch mocks and refresh the checkboxes
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
			cy.loadApp();
			cy.waitForAppLoading();

			// Check to see if any items are pre-completed
			let numCompleted = Cypress._.filter(
				allManualCheckableCNAPitstopActions, action => action.isComplete === true
			).length;
			let expectedPercent = Math.floor(
				(numCompleted / allManualCheckableCNAPitstopActions.length) * 100
			);

			// Check each item, verify the percentage is updated
			allManualCheckableCNAPitstopActions.forEach((action, index) => {
				if (!action.isComplete) {
					cy.getByAutoId('pitstopCheckboxSpan')
						.eq(index)
						.click();
					numCompleted += 1;
				}

				expectedPercent = Math.floor(
					(numCompleted / allManualCheckableCNAPitstopActions.length) * 100
				);
				cy.getByAutoId('CompletedActionsPercent')
					.should('contain', `${expectedPercent}%`);
			});
		});

		it('Should show "start" when 0% complete, instead of 0%', () => {
			// Switch to a mock dataset with no completed items and refresh the data
			infoMock.enable('(Racetrack) IBN-Assurance-Use');
			// Unfortunately for Cypress, the racetrack panel only reloads data on page load...
			cy.loadApp();
			cy.waitForAppLoading();

			cy.getByAutoId('CompletedActionsPercent')
				.should('contain', 'start');
		});

		it('PBC-600: Should show "start" when there are no checklist items', () => {
			// Switch to a mock dataset with no completed items and refresh the data
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-noPitstopActions');
			// Unfortunately for Cypress, the racetrack panel only reloads data on page load...
			cy.loadApp();
			cy.waitForAppLoading();

			cy.getByAutoId('CompletedActionsPercent')
				.should('contain', 'start');
		});
	});

	describe('PBC-725: UATT F8334 - Lifecycle - Need to disable Checklist from user interactions', () => {
		it('All pitstopActions checkboxes should be disabled', () => {
			cy.getByAutoId('pitstopCheckboxLabel').each($checkbox => {
				cy.wrap($checkbox).should('have.class', 'disabled');
			});
		});
	});

	describe('PBC-732: UAT F8334 -  Lifecycle - Lifecycle Adoption % not being rendered in UI', () => {
		it('Overall adoption percentage should be set by API response', () => {
			cy.getByAutoId('LifecycleAdoptionProgress')
				.should('contain', defaultCheckableCNATech.usecase_adoption_percentage);
		});
	});
});
