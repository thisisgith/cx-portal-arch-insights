import { RouteWatch } from '../support/routeWatch';
import MockService from '../support/mockService';

const advisoryMock = new MockService('AdvisorySecurityAdvisoryScenarios');
const advisoryScenario = advisoryMock.getScenario('GET', 'Advisory Security Advisories');
const advisories = advisoryScenario.response.body.data;
const advisoryCountMock = new MockService('SecurityAdvisoryLastUpdatedCountScenarios');
const fieldNoticeMock = new MockService('FieldNoticeAdvisoryScenarios');
const fnScenario = fieldNoticeMock.getScenario('GET', 'Field Notice Advisories');
const fieldNotices = fnScenario.response.body.data;
const fnCountMock = new MockService('FieldNoticeCountScenarios');
const bugMock = new MockService('CriticalBugScenarios');
const bugScenario = bugMock.getScenario('GET', 'Critical Bugs');
const bugs = bugScenario.response.body.data;
const vulnMock = new MockService('VulnerabilityScenarios');
const vulnScenario = vulnMock.getScenario('GET', 'Advisory Counts');
const vulnResponse = vulnScenario.response.body;
const secBulletinMock = new MockService('SecurityAdvisoryBulletinScenarios');
const secBulletinScenario = secBulletinMock.getScenario(
	'GET', 'Security Advisory Details for ID 485'
);
const secBulletin = secBulletinScenario.response.body.data[0];

const dateFormat = 'MMM DD, YYYY';

const impactMap = severity => {
	switch (Cypress._.startCase(severity)) {
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

	it('Displays a gauge that shows advisory counts', () => { // PBC-307
		cy.getByAutoId('Facet-Advisories').within(() => {
			cy.getByAutoId('Security AdvisoriesPoint').should(
				'have.attr', 'data-auto-value', vulnResponse['security-advisories'].toString()
			);
			cy.getByAutoId('Field NoticesPoint').should(
				'have.attr', 'data-auto-value', vulnResponse['field-notices'].toString()
			);
			cy.getByAutoId('BugsPoint').should(
				'have.attr', 'data-auto-value', vulnResponse.bugs.toString()
			);
		});
	});

	it('Gracefully handles invalid API responses', () => {
		vulnMock.enable('Advisory Counts - Unreachable');
		cy.loadApp('/solution/advisories');
		cy.waitForAppLoading();
		cy.getByAutoId('Facet-Advisories').within(() => {
			cy.get('bar-chart').should('not.be.visible');
		});

		vulnMock.enable('Advisory Counts - Missing keys');
		cy.loadApp('/solution/advisories');
		cy.waitForAppLoading();
		cy.getByAutoId('Facet-Advisories').within(() => {
			cy.getByAutoId('BugsPoint').should('be.visible');
			cy.getByAutoId('Field NoticesPoint').should('not.exist');
		});

		vulnMock.enable('Advisory Counts');
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

		context('Details / 360', () => { // PBC-311
			it('Properly displays advisory details', () => {
				cy.get('app-advisories tbody tr').eq(0).click();
				cy.getByAutoId('SecurityDetailsImpactIcon')
					.should('have.class', impactMap(secBulletin.severity));
				cy.getByAutoId('SecurityDetailsImpactText')
					.should('have.text', secBulletin.severity);
				const publishedDate = Cypress.moment(secBulletin.bulletinFirstPublished)
					.format(dateFormat);
				cy.getByAutoId('SecurityAdvisoryPublished')
					.should('have.text', `Published${publishedDate}`);
				cy.getByAutoId('SecurityAdvisoryLastUpdated')
					.should('have.text', 'Last UpdatedNever'); // TODO: CSCvq80067
				cy.getByAutoId('SecurityAdvisoryVersion')
					.should('have.text', `Version${secBulletin.bulletinVersion}`);
				cy.getByAutoId('SecurityDetailsTitleText')
					.should('have.text', secBulletin.bulletinTitle);
				cy.getByAutoId('SecurityDetailsSummaryText')
					.should('have.text', secBulletin.summaryText);
				cy.get('app-advisories tbody tr').eq(0).click();
			});

			it('Gracefully handles invalid/empty API responses', () => {
				const validate360 = () => {
					cy.getByAutoId('SecurityDetailsImpactText').should('have.text', 'N/A');
					cy.getByAutoId('SecurityAdvisoryVersion').should('have.text', 'VersionN/A');
					cy.getByAutoId('SecurityDetailsTitleText').should('have.text', 'N/A');
					cy.getByAutoId('SecurityDetailsSummaryText').should('have.text', 'N/A');
				};

				secBulletinMock.enable('Security Advisory Details for ID 485 - Unreachable');
				cy.get('app-advisories tbody tr').eq(0).click();
				validate360();
				cy.get('app-advisories tbody tr').eq(0).click();

				secBulletinMock.enable('Security Advisory Details for ID 485 - Missing keys');
				cy.get('app-advisories tbody tr').eq(0).click();
				validate360();
				cy.get('app-advisories tbody tr').eq(0).click();

				secBulletinMock.enable('Security Advisory Details for ID 485');
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

			it('Clears all applied filters with a "Clear All" link', () => {
				cy.getByAutoId('< 30 DaysPoint').click({ force: true });
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('be.visible');
				cy.getByAutoId('FilterBarClearAllFilters').click().should('not.exist');
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('not.exist');
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

	context('Critical Bugs', () => { // PBC-310 / PBC-316
		before(() => cy.getByAutoId('CRITICAL BUGSTab').click());

		it('Bugs are properly displayed in list format', () => {
			cy.get('app-advisories tbody tr').each((row, index) => {
				const bug = bugs[index];
				cy.wrap(row).within(() => {
					cy.getByAutoId('ID-Cell').should('have.text', bug.id);
					cy.getByAutoId('Title-Cell').should('have.text', bug.title);
					cy.getByAutoId('Impacted Assets-Cell')
						.should('have.text', bug.assetsImpacted.toString());
					cy.getByAutoId('State-Cell')
						.should('have.text', Cypress._.startCase(bug.state));
					let date;
					if (bug.lastUpdated) {
						date = Cypress.moment(bug.lastUpdated).format('YYYY MMM DD');
					} else {
						date = 'Never';
					}
					cy.getByAutoId('Last Updated-Cell').should('have.text', date);
				});
			});
		});

		it('Bug list gracefully handles lack of response from API', () => {
			bugMock.enable('Critical Bugs - Unreachable');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Advisories').click();
			cy.getByAutoId('CRITICAL BUGSTab').click();

			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			bugMock.enable('Critical Bugs');
		});

		it('Uses proper pagination for bug list', () => {
			bugMock.enable('Critical Bugs - Page 1');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Advisories').click();
			cy.getByAutoId('CRITICAL BUGSTab').click();

			cy.getByAutoId('CUIPager-Page2').click()
				.wait('Critical Bugs - Page 2')
				.then(xhr => {
					const params = new URLSearchParams(new URL(xhr.url).search);
					const pagination = xhr.response.body.Pagination;
					expect(params.get('page')).to.eq('2');
					expect(params.get('rows')).to.eq('10');
					cy.get('[data-auto-id*="CUIPager-Page"]')
						.should('have.length', Cypress._.ceil(pagination.total / pagination.rows));
				});
			cy.getByAutoId('CUIPager-NextPage').click();
			cy.wait('Critical Bugs - Page 3').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('3');
				expect(params.get('rows')).to.eq('10');
			});
			cy.getByAutoId('CUIPager-PrevPage').click();
			cy.wait('Critical Bugs - Page 2').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('10');
			});

			cy.getByAutoId('CUIPager-Page1').click();
			bugMock.enable('Critical Bugs');
		});

		context('Details / 360', () => { // PBC-313
			it('Properly displays advisory details', () => {
				const bug = bugs[0];
				cy.get('app-advisories tbody [data-auto-id="ID-Cell"]').eq(0).click();
				cy.getByAutoId('DetailsPanelTitle').should('have.text', `Bug ${bug.id}`);
				cy.getByAutoId('BugDetailsSeverityIcon')
					.should('have.class', impactMap(bug.severity));
				cy.getByAutoId('BugDetailsSeverityText').should('have.text', bug.severity);
				const publishedDate = Cypress.moment(bug.publishedOn).format(dateFormat);
				cy.getByAutoId('CriticalBugPublished')
					.should('have.text', `Published${publishedDate}`);
				const updatedDate = Cypress.moment(bug.lastUpdated).format(dateFormat);
				cy.getByAutoId('CriticalBugLastUpdated')
					.should('have.text', `Last Updated${updatedDate}`);
				cy.getByAutoId('CriticalBugStatus')
					.should('have.text', `Status${bug.state}`);
				cy.getByAutoId('CriticalBugImpactedAssets')
					.should('have.text', `Impacted Assets (${bug.assetsImpacted})`);
				cy.getByAutoId('BugDetailsTitleText').should('have.text', bug.title);
				cy.getByAutoId('BugDetailsDescriptionText').should('have.text', bug.description);
				cy.get('app-advisories tbody [data-auto-id="ID-Cell"]').eq(0).click();
			});
		});

		context('Filtering', () => { // PBC-310
			it('Supports filtering on bug state', () => {
				cy.getByAutoId('ResolvedPoint').click({ force: true });
				cy.wait('Critical Bugs (Resolved)').then(xhr => {
					const params = new URLSearchParams(new URL(xhr.url).search);
					expect(params.get('state')).to.eq('resolved');
					cy.getByAutoId('FilterTag-resolved').should('be.visible');
					cy.getByAutoId('State-Cell').each($cell => {
						cy.wrap($cell).should('have.text', 'Resolved');
					});
					cy.getByAutoId('ResolvedPoint').click({ force: true });
				});
			});

			// TODO: Skipped for PBC-433
			it.skip('Clears applied filters one at a time', () => { // PBC-433
			});

			// TODO: Skipped for PBC-434
			it.skip('Clears all applied filters with a "Clear All" link', () => { // PBC-434
			});

			it('Hides visual filters when APIs are unavailable', () => {
				bugMock.enable('Critical Bug State Counts - Unreachable');
				cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('CRITICAL BUGSTab').click();

				cy.getByAutoId('SelectVisualFilter-state').should('not.be.visible');
				cy.getByAutoId('SelectVisualFilter-total').should('be.visible');

				bugMock.enable('Critical Bug State Counts');
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('CRITICAL BUGSTab').click();
				cy.getByAutoId('SelectVisualFilter-state').should('be.visible');
			});
		});
	});
});
