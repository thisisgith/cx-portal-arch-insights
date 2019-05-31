import * as mocks from '../../src/environments/mock/index';

/**
 * Used to interact with the application's mock scenarios.
 */
export default class MockService {
	/**
	 * @param {string} mock The name of the mock to load.
	 * This should map to the name of export from the app's mock/index.ts (ex: ATXScenarios)
	 */
	constructor (mock) {
		this.mock = mocks[mock];
	}

	/**
	 * Get a mocked scenario object based on its request method and name
	 * @param {string} method HTTP request method
	 * @param {string} scenarioName
	 * @returns {object} foundScenario
	 * @example
	 * mockService.getScenario('GET', '(ATX) IBN-Assurance-Onboard');
	 */
	getScenario (method, scenarioName) {
		let foundScenario;
		this.mock.forEach(mock => {
			mock.scenarios[method.toUpperCase()].forEach(scenario => {
				if (scenario.description === scenarioName) {
					foundScenario = scenario;
				}
			});
		});

		return foundScenario;
	}
}
