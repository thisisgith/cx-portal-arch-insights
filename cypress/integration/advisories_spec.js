import { RouteWatch } from '@apollo/cypress-util';
import MockService from '../support/mockService';

const advisoryMock = new MockService('AdvisorySecurityAdvisoryScenarios');
const advisoryScenario = advisoryMock.getScenario('GET', 'Advisory Security Advisories');
const advisories = advisoryScenario.response.body.data;
const advisoryCountMock = new MockService('SecurityAdvisoryLastUpdatedCountScenarios');
const fieldNoticeMock = new MockService('FieldNoticeAdvisoryScenarios');
const fnScenario = fieldNoticeMock.getScenario('GET', 'Field Notice Advisories');
const fieldNotices = fnScenario.response.body.data;
const fnCountMock = new MockService('FieldNoticeCountScenarios');

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

		it('Advisory list gracefully handles lack of response from API', () => {
			advisoryMock.enable('Advisory Security Advisories - Unreachable');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Advisories').click();

			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			advisoryMock.enable('Advisory Security Advisories');
		});

		it('Uses proper pagination for advisories list', () => {
			advisoryMock.enable('Advisory Security Advisories - Page 1');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Advisories').click();

			cy.getByAutoId('CUIPager-Page2').click()
				.wait('Advisory Security Advisories - Page 2')
				.then(xhr => {
					const params = new URLSearchParams(new URL(xhr.url).search);
					const pagination = xhr.response.body.Pagination;
					expect(params.get('page')).to.eq('2');
					expect(params.get('rows')).to.eq('10');
					cy.get('[data-auto-id*="CUIPager-Page"]')
						.should('have.length', Cypress._.ceil(pagination.total / pagination.rows));
				});
			cy.getByAutoId('CUIPager-NextPage').click();
			cy.wait('Advisory Security Advisories - Page 3').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('3');
				expect(params.get('rows')).to.eq('10');
			});
			cy.getByAutoId('CUIPager-PrevPage').click();
			cy.wait('Advisory Security Advisories - Page 2').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('10');
			});

			cy.getByAutoId('CUIPager-Page1').click();
			advisoryMock.disable('Advisory Security Advisories - Page 1');
		});

		context('Filtering', () => { // PBC-308
			it.skip('Supports filtering on advisory Impact and/or Last Updated time', () => {
				// TODO: Implement after CSCvq61853 is resolved
			});

			// TODO: Skipped for PBC-433
			it.skip('Clears applied filters one at a time', () => { // PBC-433
				cy.getByAutoId('MediumPoint').click({ force: true });
				cy.getByAutoId('< 30dPoint').click({ force: true });
				cy.get('[data-auto-id="FilterTag-medium"] > span.icon-close').click();
				cy.getByAutoId('FilterTag-medium').should('not.exist');
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('be.visible');
				cy.get('[data-auto-id="FilterTag-gt-0-lt-30-days"] > span.icon-close').click();
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('not.exist');
			});

			it('Clears all applied filters with a "Clear All" link', () => {
				cy.getByAutoId('MediumPoint').click({ force: true });
				cy.getByAutoId('< 30dPoint').click({ force: true });
				cy.getByAutoId('FilterTag-medium').should('be.visible');
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('be.visible');
				// PBC-366
				cy.getByAutoId('FilterBarClearAllFilters').click().should('not.exist');
				cy.getByAutoId('FilterTag-medium').should('not.exist');
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('not.exist');
			});

			it('Visual filters can be collapsed/expanded', () => {
				cy.getByAutoId('MediumPoint').click({ force: true });
				cy.getByAutoId('VisualFilterCollapse').click();
				cy.getByAutoId('FilterTag-medium').should('be.visible');
				cy.getByAutoId('TotalVisualFilter').should('not.be.visible');
				cy.getByAutoId('VisualFilterCollapse').click();
				cy.getByAutoId('TotalVisualFilter').should('be.visible');

				cy.getByAutoId('FilterBarClearAllFilters').click();
			});

			it('Hides visual filters when APIs are unavailable', () => {
				advisoryCountMock.enable('Security Advisory Count - Unreachable');
				cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
				cy.getByAutoId('Facet-Advisories').click();

				cy.getByAutoId('SelectVisualFilter-lastUpdate').should('not.be.visible');
				cy.getByAutoId('SelectVisualFilter-impact').should('be.visible');

				advisoryCountMock.enable('Mock Last Updated Count');
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.getByAutoId('Facet-Advisories').click();
				cy.waitForAppLoading();
				cy.getByAutoId('SelectVisualFilter-lastUpdate').should('be.visible');
			});
		});
	});

	context('Field Notices', () => { // PBC-309 / PBC-315
		before(() => cy.getByAutoId('FIELD NOTICESTab').click());

		it('Field Notices are properly displayed in list format', () => {
			cy.get('app-advisories tbody tr').each((row, index) => {
				const fieldNotice = fieldNotices[index];
				cy.wrap(row).within(() => {
					cy.getByAutoId('ID-Cell')
						.should('have.text', fieldNotice.id.toString());
					cy.getByAutoId('Title-Cell').should('have.text', fieldNotice.title);
					cy.getByAutoId('Vulnerable Assets-Cell')
						.should('have.text', fieldNotice.assetsImpacted.toString());
					cy.getByAutoId('Potentially Vulnerable Assets-Cell')
						.should('have.text', fieldNotice.assetsPotentiallyImpacted.toString());
					let date;
					if (fieldNotice.lastUpdated) {
						date = Cypress.moment(fieldNotice.lastUpdated).format('YYYY MMM DD');
					} else {
						date = 'Never';
					}
					cy.getByAutoId('Last Updated-Cell').should('have.text', date);
					const version = fieldNotice.version ? fieldNotice.version.toString() : '';
					cy.getByAutoId('Version-Cell').should('have.text', version); // PBC-363
				});
			});
		});

		it('Field Notice list gracefully handles lack of response from API', () => {
			fieldNoticeMock.enable('Field Notice Advisories - Unreachable');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Advisories').click();
			cy.getByAutoId('FIELD NOTICESTab').click();

			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			fieldNoticeMock.enable('Field Notice Advisories');
		});

		it('Uses proper pagination for Field Notices list', () => {
			fieldNoticeMock.enable('Field Notice Advisories - Page 1');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Advisories').click();
			cy.getByAutoId('FIELD NOTICESTab').click();

			cy.getByAutoId('CUIPager-Page2').click()
				.wait('Field Notice Advisories - Page 2')
				.then(xhr => {
					const params = new URLSearchParams(new URL(xhr.url).search);
					const pagination = xhr.response.body.Pagination;
					expect(params.get('page')).to.eq('2');
					expect(params.get('rows')).to.eq('10');
					cy.get('[data-auto-id*="CUIPager-Page"]')
						.should('have.length', Cypress._.ceil(pagination.total / pagination.rows));
				});
			cy.getByAutoId('CUIPager-NextPage').click();
			cy.wait('Field Notice Advisories - Page 3').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('3');
				expect(params.get('rows')).to.eq('10');
			});
			cy.getByAutoId('CUIPager-PrevPage').click();
			cy.wait('Field Notice Advisories - Page 2').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('10');
			});

			cy.getByAutoId('CUIPager-Page1').click();
			fieldNoticeMock.disable('Field Notice Advisories - Page 1');
		});

		context('Filtering', () => { // PBC-309
			it.skip('Supports filtering on Field Notice Last Updated time', () => {
				// TODO: Implement after CSCvq61901 is fixed
			});

			it.skip('Clears applied filters one at a time', () => {
				// TODO: Implement after PBC-433 is fixed
			});

			it('Hides visual filters when APIs are unavailable', () => {
				fnCountMock.enable('Field Notice Counts - Unreachable');
				cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('FIELD NOTICESTab').click();

				cy.getByAutoId('SelectVisualFilter-lastUpdate').should('not.be.visible');
				cy.getByAutoId('TotalVisualFilter').should('be.visible');

				fnCountMock.enable('Field Notice Update Counts');
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('FIELD NOTICESTab').click();
				cy.waitForAppLoading();
				cy.getByAutoId('SelectVisualFilter-lastUpdate').should('be.visible');
			});
		});
	});
});
