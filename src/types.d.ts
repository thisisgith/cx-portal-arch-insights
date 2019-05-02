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
