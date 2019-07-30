import RacetrackHelper from '../support/racetrackHelper';
import MockService from '../support/mockService';

let racetrackHelper;
let trackPoints;

const infoMock = new MockService('RacetrackScenarios');
const infoOnboardScenario = infoMock.getScenario('GET', '(Racetrack) IBN-Assurance-Onboard');
const infoItems = infoOnboardScenario.response.body.solutions[0];
// Abbrevieating Campus Network Assurance to CNA
const CNATech = Cypress._.find(infoItems.technologies, tech => tech.name === 'Campus Network Assurance');
const CNAPitstopActions = Cypress._.find(CNATech.pitstops, pitstop => pitstop.name === CNATech.currentPitstop).pitstopActions;

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
		context(`"${stageName}" Stage`, () => {
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

	describe('PBC-124: Lifecycle: Pitstop percentage completed', () => {
		after(() => {
			// Ensure we're set back to the default mock data
			infoMock.enable('(Racetrack) IBN-Assurance-Onboard');
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Checking a pitstop action should update the completion percentage', () => {
			// Check to see if any items are pre-completed
			let numCompleted = Cypress._.filter(
				CNAPitstopActions, action => action.isComplete === true
			).length;
			let expectedPercent = Math.floor((numCompleted / CNAPitstopActions.length) * 100);

			// Check each item, verify the percentage is updated
			CNAPitstopActions.forEach((action, index) => {
				if (!action.isComplete) {
					// Force the click through the overlapping span checkbox__input
					cy.getByAutoId('pitstopCheckbox')
						.eq(index)
						.click({ force: true });
					numCompleted += 1;
				}

				expectedPercent = Math.floor((numCompleted / CNAPitstopActions.length) * 100);
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
