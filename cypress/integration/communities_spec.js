// import MockService from '../support/mockService';


// const commMock = new MockService('CommunitiesScenarios'); // for future changes
// environments/mock/communities.ts
// const commOnboardScenario = commMock.getScenario('GET', '(Communities) IBN-Assurance-Onboard');
// will give error if commItems is not used below
// const commItems = commOnboardScenario.response.body.items;

describe.skip('Communities (Communities)', () => { // Jira: PBC-tbd
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for the Communities panel to finish loading
		cy.waitForAppLoading('communitiesLoading', 15000);
	});

	it('Renders Communities tile', () => {
		// TODO - currently failing possibly due to a loading speed/timing issue
		cy.getByAutoId('PanelTitle-_Communities_').should('have.text', 'Cisco Community');
		cy.getByAutoId('communitytitle-Lifecycle').should('have.text', 'Lifecycle');
		cy.getByAutoId('communitytitle-Public').should('have.text', 'Public');
		// No other data-auto-id's exist at this time
	});
});
