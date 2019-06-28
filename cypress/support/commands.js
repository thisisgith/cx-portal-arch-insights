/**
* Launches the app under test
*/
Cypress.Commands.add('loadApp', (path = '/') => {
	cy.visit(`pbc${path}`);
});

/**
 * Waits for the specified loading property in the app to be set to false (finished loading)
 * @param {String} property - Property to check to be set to false
 * @param {Integer} timeout - Time in milliseconds to wait before failing
 */
Cypress.Commands.add('waitForAppLoading', (property = 'loading', timeout = 30000) => {
	Cypress.log({
		name: 'loading',
		message: { property, timeout },
	});
	cy.window({ timeout, log: false }).should('have.property', property, false);
});

/**
 * Refreshes a component by calling its ngOnInit function.
 * NOTE: The component must be exposed in the window.activeComponents object.
 * @param {String} componentName - Name of the component to refresh
 */
Cypress.Commands.add('refreshComponent', componentName => {
	Cypress.log({
		name: 'refresh',
		message: componentName,
	});
	cy.window({ log: false }).then(win => win.activeComponents[componentName].ngOnInit());
});
