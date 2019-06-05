import RacetrackHelper from '../support/racetrackCoords';

const racetrackHelper = new RacetrackHelper();

describe('Racetrack Content', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();
	});

	// it.only('Rotation', () => {
	// 	cy.getByAutoId('Racetrack-StagePoint-purchase').then(pt1 => {
	// 		const pt1CX = parseFloat(pt1.attr('cx'));
	// 		const pt1CY = parseFloat(pt1.attr('cy'));
	// 		cy.getByAutoId('Racetrack-StagePoint-onboard').then(pt2 => {
	// 			const pt2CX = parseFloat(pt2.attr('cx'));
	// 			const pt2CY = parseFloat(pt2.attr('cy'));

	// 			console.log('PT2X: ', pt2CX);
	// 			console.log('PT2Y: ', pt2CY);

	// 			let deltaY = pt1CY - pt2CY;
	// 			let deltaX = pt2CX - pt1CX;
	// 			let result = Math.atan2(deltaY, deltaX) * 180.0 / Math.PI;
	// 			let rotations = (17.0 + (360.0 - result)) % 360.0;
	// 			console.log('CALC ROTATIONS: ', rotations);
	// 		});
	// 	});
	// });

	// TODO: Calculate the rotations like the app does, will require knowing the starting point...
	const stages = [
		{ stageName: 'need', rotate: 165.73480224609372 },
		{ stageName: 'evaluate', rotate: -123.7313690185547 },
		{ stageName: 'select', rotate: -33.18197631835939 },
		{ stageName: 'purchase', rotate: 51.77642822265622 },
		{ stageName: 'onboard', rotate: 52.20236206054684 },
		{ stageName: 'implement', rotate: 31.256347656250014 },
		{ stageName: 'use', rotate: -5.071258544921932 },
		{ stageName: 'engage', rotate: -37.948150634765646 },
		{ stageName: 'adopt', rotate: -75.02737426757815 },
		{ stageName: 'optimize', rotate: -116.25038146972655 },
		{ stageName: 'renew', rotate: -145.07516479492188 },
		{ stageName: 'recommend', rotate: -179.7330932617188 },
		{ stageName: 'advocate', rotate: 163.4903564453125 },
	];
	stages.forEach(stage => {
		it(`Racetrack - Car position for stage ${stage.stageName}`, () => {
			// Click the stage circle to move the car there
			cy.getByAutoId(`Racetrack-StagePoint-${stage.stageName}`).click();

			cy.getByAutoId(`Racetrack-StagePoint-${stage.stageName}`).then(point => {
				const pointCX = parseFloat(point.attr('cx'));
				const pointCY = parseFloat(point.attr('cy'));

				const expectedCoords = racetrackHelper
					.calculateRacecarCoords(pointCX, pointCY, stage.rotate);

				// Wait for the car to finish moving
				cy.waitForAppLoading('carMoving');

				// Get the car's transform, verify the coordinates are "close enough"
				// Note: The calculations may not be exact due to rounding, so just making sure the integer
				// matches...
				cy.get('#racecar').should('have.attr', 'transform').then(transform => {
					// Note: The tranform attribute look like transform: "translate(10, 20) rotate(30)"
					const transformSplit = transform.split(' ');
					const translateX = transformSplit[0];
					const translateY = transformSplit[1];
					const transformRotate = transformSplit[2];
					expect(translateX).contains(expectedCoords.x.toString().split('.')[0]);
					expect(translateY).contains(expectedCoords.y.toString().split('.')[0]);
					expect(transformRotate).contains(stage.rotate.toString());
				});
			});
		});
	});
});
