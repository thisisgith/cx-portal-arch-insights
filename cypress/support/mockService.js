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
	 * mockService.getScenario('GET', '(ATX) IBN-Wireless Assurance-Onboard');
	 */
	getScenario (method, scenarioName) {
		let foundScenario;
		this.mock.forEach(mock => {
			if (mock.scenarios[method.toUpperCase()]) {
				mock.scenarios[method.toUpperCase()].forEach(scenario => {
					if (scenario.description === scenarioName) {
						foundScenario = scenario;
					}
				});
			}
		});

		return foundScenario;
	}

	/**
	 * Gets the value of a given response header name
	 * @param {Object} scenario
	 * @param {String} headerName
	 * @returns {String} Header value
	 */
	getResponseHeader (scenario, headerName) {
		scenario.response.headers.lazyInit();
		const headers = Cypress._.get(scenario, 'response.headers.headers', new Map());
		return Cypress._.get(headers.get(headerName.toLowerCase()), 0);
	}

	/**
	 * Enables a specified mock scenario
	 * NOTE: Until AP-5405 is resolved, you might need to manually disable other scenarios
	 * @param {Array | String} scenarios Scenario description(s)
	 */
	enable (scenarios) {
		let scenarioList;
		if (!Array.isArray(scenarios)) {
			scenarioList = [scenarios];
		} else {
			scenarioList = scenarios;
		}

		cy.window({ log: false }).then(win => {
			Cypress.log({
				name: 'Mock On',
				message: scenarioList,
			});
			Cypress._.each(scenarioList, scenario => {
				win.mockService.enable(scenario);
			});
		});
	}

	/**
	 * Enables all mock scenarios
	 */
	static enableAll () {
		cy.window({ log: false }).then(win => {
			Cypress.log({
				name: 'Mock On',
				message: '*',
			});
			cy.wrap(win.mockService.enableAll());
		});
	}

	/**
	 * Disables a specified mock scenario
	 * @param {Array | String} scenarios Scenario description(s)
	 */
	disable (scenarios) {
		let scenarioList;
		if (!Array.isArray(scenarios)) {
			scenarioList = [scenarios];
		} else {
			scenarioList = scenarios;
		}

		cy.window({ log: false }).then(win => {
			Cypress.log({
				name: 'Mock Off',
				message: scenarioList,
			});
			Cypress._.each(scenarioList, scenario => {
				win.mockService.disable(scenario);
			});
		});
	}

	/**
	 * Disables all mock scenarios
	 */
	static disableAll () {
		cy.window({ log: false }).then(win => {
			Cypress.log({
				name: 'Mock Off',
				message: '*',
			});
			cy.wrap(win.mockService.disableAll());
		});
	}

	/**
	 * Intercept XHRs and optionally stub the response'
	 * @static
	 * @param {object[]} routes An array of options for cypress.route
	 */
	static stubXHR (routes) {
		cy.server();
		routes.forEach(route => cy.route(route));
	}

	/**
	 * Create mocks to simulate a user who is not authenticated
	 * @static
	 */
	static mockUnauthenticatedUser () {
		const routes = [
			{
				method: 'GET', url: '/ws/account/v2', status: 401, response: {},
			},
			{
				method: 'GET',
				url: '/ws/oauth/v3/**',
				status: 200,
				response: 'fixture:oauth_notAuthenticated.json',
			},
		];
		this.stubXHR(routes);
	}
}
