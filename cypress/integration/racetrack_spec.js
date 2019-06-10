import RacetrackHelper from '../support/racetrackHelper';

let racetrackHelper;
let trackPoints;

describe('Racetrack Content', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Pull all the points off the track for rotation and position calculations
		cy.get('#secrettrack').then(track => {
			trackPoints = Array.from({ length: track.attr('pointslength') });
			racetrackHelper = new RacetrackHelper(parseFloat(track.attr('tracklength')), parseFloat(track.attr('pointslength')));
			for (let index = 0; index < 200; index += 1) {
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
		it(`Racetrack - Car position for stage '${stageName}'`, () => {
			// Click the stage circle to move the car there
			// When scaling, points can end up "behind" the car or the secrettrack, so we need to
			// force the click
			cy.getByAutoId(`Racetrack-Point-${stageName}`).click({ force: true });

			cy.getByAutoId(`Racetrack-Point-${stageName}`).then(point => {
				const expectedRotations = racetrackHelper.calculateRacecarRotations(point, trackPoints);

				const pointCX = parseFloat(point.attr('cx'));
				const pointCY = parseFloat(point.attr('cy'));

				const expectedCoords = racetrackHelper
					.calculateRacecarCoords(pointCX, pointCY, expectedRotations);

				// Wait for the car to finish moving
				cy.waitForAppLoading('carMoving');

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
					const transformRotate = parseFloat(transformSplit[2].replace('rotate(', '').replace(')', ''));
					expect(translateX).to.be.within(expectedCoords.x - 1, expectedCoords.x + 1);
					expect(translateY).to.be.within(expectedCoords.y - 1, expectedCoords.y + 1);
					expect(transformRotate).to.be.within(expectedRotations - 1, expectedRotations + 1);
				});
			});
		});
	});

	stages.forEach(stageName => {
		it(`Racetrack - Progress path for stage '${stageName}'`, () => {
			// Click the stage circle to move the car there
			// When scaling, points can end up "behind" the car or the secrettrack, so we need to
			// force the click
			cy.getByAutoId(`Racetrack-Point-${stageName}`).click({ force: true });

			// Wait for the car and progress path to finish moving
			cy.waitForAppLoading('carMoving');
			cy.waitForAppLoading('progressMoving');

			cy.get('#progress').then(progressPath => {
				const progressStrokeDasharray = progressPath.attr('stroke-dasharray');
				const expectedStrokeDasharray = racetrackHelper.calculateTrackProgress(stageName);

				expect(progressStrokeDasharray).eq(expectedStrokeDasharray);
			});
		});
	});
});
