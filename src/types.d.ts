/**
 * Type Module for importing JSON files
 */
declare module '*.json' {
	/**
	 * The value of the key
	 */
	const value: string;

	/**
	 * The value
	 */
	export default value;
}

/**
 * Custom properties added to the global 'window' object during Cypress tests
 */
interface Window {
	Cypress: any;
	loading: boolean;
	elearningLoading: boolean;
	inventoryLoading: boolean;
	successPathsLoading: boolean;
	atxLoading: boolean;
	accLoading: boolean;
	communitiesLoading: boolean;
	cgtLoading: boolean;
	productGuidesLoading: boolean;
	racetrackEvents: any;
	forceCGTDisplay: boolean;
}
