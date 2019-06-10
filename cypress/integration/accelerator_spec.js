// import MockService from '../support/mockService'; //not needed yet for accelerator
// const accMock = new MockService('CommunitiesScenarios'); // for future changes
// environments/mock/communities.ts
// const accOnboardScenario = accMock.getScenario('GET', '(Accelerator) IBN-Assurance-Onboard');
// will give error if accItems is not used below
// const accItems = accOnboardScenario.response.body.items;

describe('Accelerator (Accelerator)', () => { // Jira: PBC-tbd
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();
	});

	it('Renders Accelerator tile', () => {
		cy.getByAutoId('Accelerator Panel').should('exist');
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', 'Accelerator');
		cy.getByAutoId('recommendedACCTitle').should('have.text', 'Cisco DNA Center Project Planning');
		cy.getByAutoId('recommendedACCWatchButton').should('have.text', 'Register');
		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});
});
