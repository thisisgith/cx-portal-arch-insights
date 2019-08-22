/**
 * Various helper functions for the cypress automation framework
 */
class Util {
	/**
	 * Gets currently configured viewport size
	 * @returns {ViewportSize}
	 */
	getViewportSize () {
		const { viewportWidth, viewportHeight } = Cypress.config();
		return {
			width: viewportWidth,
			height: viewportHeight,
			widthInPx: `${viewportWidth}px`,
			heightInPx: `${viewportHeight}px`,
			halfWidthInPx: `${(viewportWidth / 2)}px`,
			halfHeightInPx: `${(viewportHeight / 2)}px`,
		};
	}
}

module.exports = new Util();
