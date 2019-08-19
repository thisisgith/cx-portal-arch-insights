import RacetrackHelper from '../support/racetrackHelper';
import MockService from '../support/mockService';

let racetrackHelper;
let trackPoints;

const infoMock = new MockService('RacetrackScenarios');
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

const actionMock = new MockService('ActionScenarios');

describe('Racetrack Content', () => {
	before(() => {
		cy.login();
		cy.loadApp();
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
		'need',
		'evaluate',
		'select',
		'purchase',
		'onboard',
		'implement',
		'use',
		'engage',
		'adopt',
		'optimize',
		'renew',
		'recommend',
		'advocate',
	];
	stages.forEach(stageName => {
		context.skip(`"${stageName}" Stage`, () => {
			let expectedCoords;
			let expectedRotations;

			before(() => {
				// Click the stage circle to move the car there
				// When scaling, points can end up "behind" the car or the secrettrack, so we need to
				// force the click
				cy.getByAutoId(`Racetrack-Point-${stageName}`).click({ force: true });

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

			it('Progress Position', () => {
				cy.get('#progress').then(progressPath => {
					const progressStrokeDasharray = progressPath.attr('stroke-dasharray');
					const expectedStrokeDasharray = racetrackHelper
						.calculateTrackProgress(stageName);

					expect(progressStrokeDasharray).eq(expectedStrokeDasharray);
				});
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
				method: 'PATCH',
				url: '**/api/customerportal/pitstop/v1/action/status?*',
				status: 200,
				response: {
					isAccChanged: false,
					isAtxChanged: false,
					isCommunitiesChanged: false,
					isElearningChanged: false,
					isSuccessPathChanged: false,
				},
			}).as('patchActionStatus');
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
					.click();
				cy.wait('@patchActionStatus');
			});
		});

		it('SDP API responses for checked item should control data refreshes', () => {
			// Switch mocks and refresh the checkboxes
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allManualCheckable');
			cy.loadApp();
			cy.waitForAppLoading();

			// Set up mocks for patch and all Lifecycle GETs
			cy.route({
				method: 'PATCH',
				url: '**/api/customerportal/pitstop/v1/action/status?*',
				status: 200,
				response: {
					isAccChanged: true,
					isAtxChanged: true,
					isCommunitiesChanged: true,
					isElearningChanged: true,
					isSuccessPathChanged: true,
				},
			}).as('patchActionStatus');
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
				url: '**/api/customerportal/racetrack/v1/successPaths*',
			}).as('getSuccessPaths');
			infoMock.disable('(ACC) IBN-Campus Network Assurance-Onboard');
			infoMock.disable('(ATX) IBN-Campus Network Assurance-Onboard');
			// infoMock.disable('COMMUNITIES API MOCK');	// TODO: There is no communities API yet
			infoMock.disable('(E-Learning) IBN-Campus Network Assurance-Onboard');
			infoMock.disable('(SP) IBN-Campus Network Assurance-Onboard');

			// Click a checkbox and wait for the PATCH call to complete
			cy.getByAutoId('pitstopCheckboxSpan')
				.first()
				.click();
			cy.wait('@patchActionStatus');

			// Verify all of the other Lifecycle APIs were called to refresh the data
			cy.wait('@getACC');
			cy.wait('@getATX');
			// cy.wait('@getCommunities');	// TODO: There is no communities API yet
			cy.wait('@getELearning');
			cy.wait('@getSuccessPaths');
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
							.click();
						cy.wait('@patchActionStatus');
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

		it('Pitstop actions should not be checkable if manualCheckAllowed is false', () => {
			// Switch mocks and refresh the checkboxes
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allNotManualCheckable');
			cy.loadApp();
			cy.waitForAppLoading();

			cy.getByAutoId('pitstopCheckboxLabel').each($checkbox => {
				cy.wrap($checkbox).should('have.class', 'disabled');
			});
		});

		it('Pitstop actions should be auto-checked if isCompleteAuto is true', () => {
			// Switch mocks and refresh the checkboxes
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard-allAutoCompleted');
			cy.loadApp();
			cy.waitForAppLoading();

			cy.getByAutoId('pitstopCheckboxLabel').each($checkbox => {
				cy.wrap($checkbox).should('have.class', 'disabled');
			});

			// Addtionally, all auto-completed items should have an auto icon
			cy.getByAutoId('actionlink').each($checkboxLink => {
				cy.wrap($checkboxLink).within(() => {
					cy.getByAutoId('pitstopCheckboxAutoIcon').should('exist');
				});
			});
		});
	});

	describe('PBC-124: Lifecycle: Pitstop percentage completed', () => {
		after(() => {
			// Ensure we're set back to the default mock data
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard');
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Checking a pitstop action should update the completion percentage', () => {
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
	});
});
