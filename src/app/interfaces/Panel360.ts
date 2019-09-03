/**
 * Interface for components that implement the onPanelClose method
 */
export declare interface Panel360 {
	/**
	 * A method that performs custom clean-up, invoked
	 * after a panel is closed
	 */
	onPanelClose (): void;

	/**
	 * closes current 360 panel
	 */
	onPanelBack (): void;

	/**
	 * closes all 360 panels
	 */
	onAllPanelsClose (): void;
}
