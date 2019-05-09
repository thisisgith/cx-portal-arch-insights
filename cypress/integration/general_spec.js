describe('General Spec', () => {
	before(() => {
		cy.loadApp();
	});

	it('Loads the app', () => {
		cy.get('h1.page-title').should('have.text', 'CX Console');
	});
});
