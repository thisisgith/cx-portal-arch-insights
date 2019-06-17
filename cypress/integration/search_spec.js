// import MockService from '../support/mockService';


// const commMock = new MockService('CommunitiesScenarios'); // for future changes
// environments/mock/communities.ts
// const commOnboardScenario = commMock.getScenario('GET', '(Communities) IBN-Assurance-Onboard');
// will give error if commItems is not used below
// const commItems = commOnboardScenario.response.body.items;

describe('Search (Search)', () => { // Jira: PBC-tbd
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();
	});

	it('Search and close', () => {
		cy.getByAutoId('searchBarInput').should('exist').type('639530286{enter}');
		cy.wait(1000);
		cy.getByAutoId('searchClose').click();
		// cy.getByAutoId('searchBarInput').type('test string');
		// cy.getByAutoId('communitytitle-Lifecycle').should('have.text', 'Lifecycle');
		// cy.getByAutoId('communitytitle-Public').should('have.text', 'Public');
	});
});
