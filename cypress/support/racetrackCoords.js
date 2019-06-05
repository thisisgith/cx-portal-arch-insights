
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
}
