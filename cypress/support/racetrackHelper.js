
/**
 * Used to convert point coordinates to racecar coordinates
 */
export default class RacetrackHelper {
	/**
	 * Initializes the racetrack and car offsets.
	 * These are hard-coded in the app, so hard-coded here as well.
	 */
	constructor () {
		this.racetrackOffsetX = -22.6100006103515;
		this.racetrackOffsetY = -287.230010986328;
		this.carCenterOffsetX = -15;
		this.carCenterOffsetY = -20;
	}

	/**
	 * Converts the point X/Y coordinates to racecar XY/coordinates
	 * @param {Float} pointX - X coordinate of the point on the racetrack
	 * @param {Float} pointY - Y coordinate of the point on the racetrack
	 * @param {Float} rotations - Degress to rotate the car to line up with the track
	 * @returns {Object} The expected racecar coordinates
	 */
	calculateRacecarCoords (pointX, pointY, rotations) {
		const rotationsRadians = rotations * (Math.PI / 180);
		let newX = 0;
		let newY = 0;

		const rotatedOffsetX = (this.carCenterOffsetX * Math.cos(rotationsRadians))
		+ (this.carCenterOffsetY * -1 * Math.sin(rotationsRadians));
		const rotatedOffsetY = (this.carCenterOffsetX * Math.sin(rotationsRadians))
		+ (this.carCenterOffsetY * Math.cos(rotationsRadians));

		// Move the car onto the track, move to the point, then rotate and center the car over the point
		newX = this.racetrackOffsetX + pointX + rotatedOffsetX;
		newY = this.racetrackOffsetY + pointY + rotatedOffsetY;

		return { x: newX, y: newY };
	}

	/**
	 * Calculates the number of degrees the racecar should have been rotated by in order to line up
	 * with the racetrack, based on the current point the car is sitting on and the next point along
	 * the track
	 * @param {String} currentPoint - The point the car is sitting on
	 * @param {Array} trackPoints - The array of points along the track
	 * @returns {Float} rotations - Number of degrees the racecar should be rotated by
	 */
	calculateRacecarRotations (currentPoint, trackPoints) {
		const pt1CX = parseFloat(currentPoint.attr('cx'));
		const pt1CY = parseFloat(currentPoint.attr('cy'));

		// Find the index of the current point, and grab the next point for rotation calculation
		const currentPointIndex = trackPoints
			.findIndex(point => point.x === pt1CX && point.y === pt1CY);

		const nextPointIndex = (
			currentPointIndex === trackPoints.length - 1 ? 0 : currentPointIndex + 1
		);
		const pt2CX = trackPoints[nextPointIndex].x;
		const pt2CY = trackPoints[nextPointIndex].y;

		const deltaY = pt1CY - pt2CY;
		const deltaX = pt2CX - pt1CX;
		const result = Math.atan2(deltaY, deltaX) * 180.0 / Math.PI;
		let rotations = (17.0 + (360.0 - result)) % 360;

		// The d3 transform will actually convert rotations to be between [-179, 180] degrees...
		if (rotations > 180) {
			rotations -= 360;
		}

		return rotations;
	}
}
