import RacetrackHelper from '../support/racetrackHelper';

const racetrackHelper = new RacetrackHelper();
let trackPoints = Array.from({ length: 200 });

describe('Racetrack Content', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Pull all the points off the track for rotation and position calculations
		cy.get('#secrettrack').then(track => {
			trackPoints = Array.from({ length: track.attr('pointsLength') });
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
		it(`Racetrack - Car position for stage ${stageName}`, () => {
			// Click the stage circle to move the car there
			cy.getByAutoId(`Racetrack-Point-${stageName}`).click();

			cy.getByAutoId(`Racetrack-Point-${stageName}`).then(point => {
				const rotations = racetrackHelper.calculateRacecarRotations(point, trackPoints);

				const pointCX = parseFloat(point.attr('cx'));
				const pointCY = parseFloat(point.attr('cy'));

				const expectedCoords = racetrackHelper
					.calculateRacecarCoords(pointCX, pointCY, rotations);

				// Wait for the car to finish moving
				cy.waitForAppLoading('carMoving');

				/**
				 * Get the car's transform, verify the coordinates are "close enough"
				 * Note: The calculations will probably not match the transform attribute exactly, looks
				 * like the SVG transform gets mangled slightly.
				 * For example, setting an element to [100, 100] works, but setting an element to
				 * [100.1, 100.1] becomes translate(100.0999984741211, 100.0999984741211)... Go figure...
				 */
				cy.get('#racecar').should('have.attr', 'transform').then(transform => {
					// Note: The tranform attribute look like transform: "translate(10, 20) rotate(30)"
					const transformSplit = transform.split(' ');
					const translateX = transformSplit[0];
					const translateY = transformSplit[1];
					const transformRotate = transformSplit[2];
					expect(translateX).contains(expectedCoords.x.toString().split('.')[0]);
					expect(translateY).contains(expectedCoords.y.toString().split('.')[0]);
					expect(transformRotate).contains(rotations.toString().split('.')[0]);
				});
			});
		});
	});
});
