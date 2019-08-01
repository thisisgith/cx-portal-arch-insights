import { RouteWatch } from '@apollo/cypress-util';
import MockService from '../support/mockService';

const advisoryMock = new MockService('AdvisorySecurityAdvisoryScenarios');
const advisoryScenario = advisoryMock.getScenario('GET', 'Advisory Security Advisories');
const advisories = advisoryScenario.response.body.data;

const impactMap = severity => {
	switch (severity) {
		case 'Critical':
			return 'label--danger';
		case 'High':
			return 'label--warning';
		case 'Medium':
			return 'label--warning-alt';
		case 'Low':
			return 'label--success';
		case 'Info':
			return 'label--indigo';
		default:
			return 'label--circle'; // gray by default
	}
};

describe('Advisories', () => { // PBC-306
	before(() => {
		cy.login();
		cy.loadApp('/solution/advisories');
		cy.waitForAppLoading();
	});

	it('Does not make redundant API calls', () => {
		MockService.disableAll();
		const psirtAPI = new RouteWatch('**/advisories-security-advisories?customerId=2431199&rows=10&page=1');
		const fnAPI = new RouteWatch('**/advisories-field-notices?*');
		const bugAPI = new RouteWatch('**/critical-bugs?*');

		cy.reload();
		cy.waitForAppLoading().then(() => {
			cy.wrap(psirtAPI.called).should('eq', 1);
			cy.wrap(fnAPI.called).should('eq', 1);
			cy.wrap(bugAPI.called).should('eq', 1);
		});

		MockService.enableAll();
		cy.loadApp('/solution/advisories');
		cy.waitForAppLoading();
	});

	context('Security Advisories', () => { // PBC-308 / PBC-314
		before(() => cy.getByAutoId('SECURITY ADVISORIESTab').click());

		it('Advisories are properly displayed in list format', () => {
			cy.get('app-advisories tbody tr').each((row, index) => {
				const advisory = advisories[index];
				cy.wrap(row).within(() => {
					cy.getByAutoId('ImpactIcon').should('have.class', impactMap(advisory.severity));
					const impact = advisory.severity ? advisory.severity : 'N/A'; // PBC-362
					cy.getByAutoId('ImpactText').should('have.text', impact);
					cy.getByAutoId('Title-Cell').should('have.text', advisory.title);
					let count = `${advisory.assetsImpacted} `;
					if (advisory.assetsPotentiallyImpacted > 0) {
						count += `(+${advisory.assetsPotentiallyImpacted})`;
					}
					cy.getByAutoId('ImpactedCountText').should('have.text', count);
					let date;
					if (advisory.lastUpdated) {
						date = Cypress.moment(advisory.lastUpdated).format('YYYY MMM DD');
					} else {
						date = 'Never';
					}
					cy.getByAutoId('Last Updated-Cell').should('have.text', date);
					const version = advisory.version ? advisory.version.toString() : '';
					cy.getByAutoId('Version-Cell').should('have.text', version); // PBC-363
				});
			});
		});
	});
});
