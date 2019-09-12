import RouteWatch from '../support/routeWatch';
import MockService from '../support/mockService';


const advisoryMock = new MockService('AdvisorySecurityAdvisoryScenarios');
const advisoryScenario = advisoryMock.getScenario('GET', 'Advisory Security Advisories');
const advisories = advisoryScenario.response.body;
const advisoryCountMock = new MockService('SecurityAdvisoryLastUpdatedCountScenarios');
const fieldNoticeMock = new MockService('FieldNoticeAdvisoryScenarios');
const fnScenario = fieldNoticeMock.getScenario('GET', 'Field Notice Advisories');
const fieldNotices = fnScenario.response.body;
const fnCountMock = new MockService('FieldNoticeCountScenarios');
const bugMock = new MockService('CriticalBugScenarios');
const bugScenario = bugMock.getScenario('GET', 'Critical Bugs');
const bugs = bugScenario.response.body;
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
		case 'Info':
			return 'label--info';
		default:
			return 'label--circle'; // gray by default
	}
};

describe('Advisories', () => { // PBC-306
	before(() => {
		cy.login();
		cy.loadApp('/solution/advisories');
		cy.window().then(win => { // Must be done after app loads
			win.Cypress.hideDNACHeader = true;
		});
		cy.waitForAppLoading();
	});

	it('Does not make redundant API calls', () => { // PBC-361
		advisoryMock.disable('Advisory Security Advisories');
		fieldNoticeMock.disable('Field Notice Advisories');
		bugMock.disable('Critical Bugs');
		const psirtAPI = new RouteWatch('**/advisories-security-advisories?*');
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
			cy.getByAutoId('Security AdvisoriesPoint')
				.should('have.text', advisories.Pagination.total.toString());
			cy.getByAutoId('Field NoticesPoint')
				.should('have.text', fieldNotices.Pagination.total.toString());
			cy.getByAutoId('BugsPoint').should('have.text', bugs.Pagination.total.toString());
		});
	});

	it('Gracefully handles invalid API responses', () => {
		advisoryMock.enable('Advisory Security Advisories - Count Unreachable');
		cy.loadApp('/solution/advisories');
		cy.waitForAppLoading();
		cy.getByAutoId('Security AdvisoriesPoint').should('have.text', '0');

		advisoryMock.enable('Advisory Security Advisories - Count Missing Keys');
		cy.loadApp('/solution/advisories');
		cy.waitForAppLoading();
		cy.getByAutoId('Security AdvisoriesPoint').should('have.text', '0');

		advisoryMock.enable('Advisory Security Advisories - Count');
	});

	context('Security Advisories', () => { // PBC-308 / PBC-314
		before(() => cy.getByAutoId('SECURITY ADVISORIESTab').click());

		it('Advisories are properly displayed in list format', () => {
			cy.get('app-advisories tbody tr').each((row, index) => {
				const advisory = advisories.data[index];
				cy.wrap(row).within(() => {
					cy.getByAutoId('ImpactIcon').should('have.class', impactMap(advisory.severity));
					const impact = advisory.severity ? advisory.severity : 'N/A'; // PBC-362
					cy.getByAutoId('ImpactText').should('have.text', impact);
					cy.getByAutoId('TitleText').should('have.text', advisory.title);
					let count = `${advisory.assetsImpacted} `;
					if (advisory.assetsPotentiallyImpacted > 0) {
						count += `(+${advisory.assetsPotentiallyImpacted})`;
					}
					cy.getByAutoId('ImpactedCountText').should('have.text', count);
					let date = advisory.lastUpdated ? advisory.lastUpdated : advisory.publishedOn;
					if (date) {
						date = Cypress.moment(date).format('YYYY MMM DD');
					} else {
						date = 'Never';
					}
					cy.getByAutoId('LastUpdatedText').should('have.text', date);
					const version = advisory.version ? advisory.version.toString() : '';
					cy.getByAutoId('VersionText').should('have.text', version); // PBC-363
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
			advisoryMock.enable('Advisory Security Advisories');
		});

		context('Filtering', () => { // PBC-308
			it('Supports filtering on advisory Impact and/or Last Updated time', () => {
				cy.server();
				cy.route('**/product-alerts/v1/advisories-security-advisories?*').as('advisories');
				cy.getByAutoId('HighPoint').click({ force: true });
				cy.wait('@advisories').its('url').should('contain', 'severity=high');
				cy.getByAutoId('< 30 DaysPoint').click({ force: true });
				cy.wait('@advisories').its('url')
					.should('match', /lastUpdatedDateRange=[0-9]+,[0-9]+/);

				cy.getByAutoId('FilterBarClearAllFilters').click(); // cleanup
			});

			it('Clears applied filters one at a time', () => { // PBC-433, PBC-608
				cy.getByAutoId('MediumPoint').click({ force: true });
				cy.getByAutoId('< 30 DaysPoint').click({ force: true });
				cy.get('[data-auto-id="FilterTag-medium"] > span.icon-close').click();
				cy.getByAutoId('FilterTag-medium').should('not.exist');
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('be.visible');
				cy.get('[data-auto-id="FilterTag-gt-0-lt-30-days"] > span.icon-close').click();
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('not.exist');
			});

			it('Clears all applied filters with a "Clear All" link', () => {
				cy.getByAutoId('MediumPoint').click({ force: true });
				cy.getByAutoId('< 30 DaysPoint').click({ force: true });
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

				cy.getByAutoId('VisualFilter-lastUpdate').should('not.be.visible');
				cy.getByAutoId('VisualFilter-severity').should('be.visible');

				advisoryCountMock.enable('Mock Last Updated Count');
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.getByAutoId('Facet-Advisories').click();
				cy.waitForAppLoading();
				cy.getByAutoId('VisualFilter-lastUpdate').should('be.visible');
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
				const updatedDate = Cypress.moment(advisories.data[0].lastUpdated)
					.format(dateFormat);
				cy.getByAutoId('SecurityAdvisoryLastUpdated')
					.should('have.text', `Last Updated${updatedDate}`);
				cy.getByAutoId('SecurityAdvisoryVersion')
					.should('have.text', `Version${secBulletin.bulletinVersion}`);
				cy.getByAutoId('SecurityDetailsTitleText')
					.should('have.text', secBulletin.bulletinTitle);
				cy.getByAutoId('SecurityDetailsSummaryText')
					.should('have.text', secBulletin.summaryText);
				cy.getByAutoId('CloseDetails').click();
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
				cy.getByAutoId('CloseDetails').click();

				secBulletinMock.enable('Security Advisory Details for ID 485 - Missing keys');
				cy.get('app-advisories tbody tr').eq(0).click();
				validate360();
				cy.getByAutoId('CloseDetails').click();

				secBulletinMock.enable('Security Advisory Details for ID 485');
			});
		});
	});

	context('Field Notices', () => { // PBC-309 / PBC-315
		before(() => cy.getByAutoId('FIELD NOTICESTab').click());

		it('Field Notices are properly displayed in list format', () => {
			cy.get('app-advisories tbody tr').each((row, index) => {
				const fieldNotice = fieldNotices.data[index];
				cy.wrap(row).within(() => {
					cy.getByAutoId('ID-Cell')
						.should('have.text', fieldNotice.id.toString());
					cy.getByAutoId('Title-Cell').should('have.text', fieldNotice.title);
					cy.getByAutoId('ImpactedAssetsText')
						.should('have.text', fieldNotice.assetsImpacted.toString());
					cy.getByAutoId('PotentiallyImpactedAssetsText')
						.should('have.text', fieldNotice.assetsPotentiallyImpacted.toString());
					let date = fieldNotice.lastUpdated ? fieldNotice.lastUpdated : fieldNotice.publishedOn;
					if (date) {
						date = Cypress.moment(date).format('YYYY MMM DD');
					} else {
						date = 'Never';
					}
					cy.getByAutoId('LastUpdatedText').should('have.text', date);
					const version = fieldNotice.version ? fieldNotice.version.toString() : 'N/A';
					cy.getByAutoId('VersionText').should('have.text', version); // PBC-363
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
			it('Supports filtering on Field Notice Last Updated time', () => {
				cy.server();
				cy.route('**//product-alerts/v1/advisories-field-notices?*').as('advisories');
				cy.getByAutoId('< 30 DaysPoint').click({ force: true });
				cy.wait('@advisories').its('url')
					.should('match', /lastUpdatedDateRange=[0-9]+,[0-9]+/);

				cy.getByAutoId('FilterBarClearAllFilters').click(); // cleanup
			});

			it('Clears applied filters one at a time', () => {
				cy.getByAutoId('< 30 DaysPoint').click({ force: true });
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('be.visible');
				cy.get('[data-auto-id="FilterTag-gt-0-lt-30-days"] > span.icon-close').click();
				cy.getByAutoId('FilterTag-gt-0-lt-30-days').should('not.exist');
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

				cy.getByAutoId('VisualFilter-lastUpdate').should('not.be.visible');
				cy.getByAutoId('TotalVisualFilter').should('be.visible');

				fnCountMock.enable('Field Notice Update Counts');
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('FIELD NOTICESTab').click();
				cy.getByAutoId('VisualFilter-lastUpdate').should('be.visible');
			});
		});
	});

	context('Critical Bugs', () => { // PBC-310 / PBC-316
		before(() => cy.getByAutoId('CRITICAL BUGSTab').click());

		it('Bugs are properly displayed in list format', () => {
			cy.get('app-advisories tbody tr').each((row, index) => {
				const bug = bugs.data[index];
				cy.wrap(row).within(() => {
					cy.getByAutoId('ID-Cell').should('have.text', bug.id);
					cy.getByAutoId('Title-Cell').should('have.text', bug.title);
					cy.getByAutoId('Impacted Assets-Cell')
						.should('have.text', bug.assetsImpacted.toString());
					cy.getByAutoId('StateText')
						.should('have.text', Cypress._.startCase(bug.state));
					let date = bug.lastUpdated ? bug.lastUpdated : bug.publishedOn;
					if (date) {
						date = Cypress.moment(date).format('YYYY MMM DD');
					} else {
						date = 'Never';
					}
					cy.getByAutoId('LastUpdatedText').should('have.text', date);
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
				const bug = bugs.data[0];
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
				cy.get('[data-auto-id*="IMPACTED ASSETS"]')
					.should('have.text', `IMPACTED ASSETS (${bug.assetsImpacted})`);
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
					cy.getByAutoId('StateText').each($cell => {
						cy.wrap($cell).should('have.text', 'Resolved');
					});
					cy.getByAutoId('ResolvedPoint').click({ force: true });
				});
			});

			it('Clears applied filters one at a time', () => { // PBC-433
				cy.getByAutoId('ResolvedPoint').click({ force: true });
				cy.getByAutoId('FilterTag-resolved').should('be.visible');
				cy.get('[data-auto-id="FilterTag-resolved"] > span.icon-close').click();
				cy.getByAutoId('FilterTag-resolved').should('not.exist');
			});

			it('Clears all applied filters with a "Clear All" link', () => { // PBC-434
				cy.getByAutoId('ResolvedPoint').click({ force: true });
				cy.getByAutoId('FilterTag-resolved').should('be.visible');
				cy.getByAutoId('FilterBarClearAllFilters').click().should('not.exist');
				cy.getByAutoId('FilterTag-resolved').should('not.exist');
			});

			it('Hides visual filters when APIs are unavailable', () => {
				bugMock.enable('Critical Bug State Counts - Unreachable');
				cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('CRITICAL BUGSTab').click();

				cy.getByAutoId('VisualFilter-state').should('not.be.visible');
				cy.getByAutoId('VisualFilter-total').should('be.visible');

				bugMock.enable('Critical Bug State Counts');
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.getByAutoId('Facet-Advisories').click();
				cy.getByAutoId('CRITICAL BUGSTab').click();
				cy.getByAutoId('VisualFilter-state').should('be.visible');
			});
		});
	});

	context('Open case with Prediction', () => { // PBC-498
		let predict0, predict1, predict2;
		let techID, subID;
		let problemCodes, problemAreas, problemAreaOptions;
		let advtitle;
		const customerAct = {
			configArray: [],
			upgradeArray: [],
			operateArray: [],
			installArray: [],
		};
		it('Open case with prediction', () => {
			cy.server();
			cy.route('POST', '**/classify').as('caseopen');
			cy.route('**/tech/problemArea/**').as('problemcode');
			cy.route('**/tech/subTech/**').as('subtech');
			// Click one advisory, extract the advisory title which will be
			// used for prediction query
			cy.getByAutoId('TitleText').first().then(adv => {
				advtitle = adv.text();
				cy.log(`casetitle is ${advtitle}`);
				cy.log(`casetitle is ${advtitle}`);
				cy.get('app-advisories tbody tr').first().click();
				cy.getByAutoId('SecurityDetailsTitleText').invoke('text')
					.should('eq', advtitle);
				// Click OpenCase button to open OpenCase Modal
				cy.getByAutoId('SecurityAdvisoryOpenCaseBtn').click();
				// Verify xhr query contains the advisory title, extract predictions from the response
				cy.wait('@caseopen').then(xhr => {
					const req = xhr.request.body.data;
					const { predictions } = xhr.response.body;
					expect(req).to.have.property('caseTitle', advtitle);
					predict0 = `${predictions[0].tech.name} > ${predictions[0].sub_tech.name}`;
					predict1 = `${predictions[1].tech.name} > ${predictions[1].sub_tech.name}`;
					predict2 = `${predictions[2].tech.name} > ${predictions[2].sub_tech.name}`;
					techID = predictions[0].tech.id;
					subID = predictions[0].sub_tech.id;
				});
				cy.get('app-case-open-advisories', { timeout: 20000 }).within(() => {
				// Verify the OpenCase Modal has all expected elements
					cy.getByAutoId('CaseOpenFrom')
						.should('have.text', 'Case Initiated from a Cisco Security Advisory')
						.should('be.visible');
					cy.getByAutoId('CaseOpenAsset').should('have.text', 'Asset Associated with the Case')
						.should('be.visible');
					cy.getByAutoId('CaseOpenTitle').should('have.text', 'Case Title')
						.should('be.visible');
					// Verify the Title field is prepopulated with the title of the advisory
					cy.get('input[formcontrolname="title"]').invoke('val')
						.should('eq', advtitle);
					cy.getByAutoId('CaseOpenDescription').should('have.text', 'Describe the Problem')
						.should('be.visible');
					// Verify 'Describe the Problem' field is prepopulated with Advisory Info
					cy.get('textarea[formcontrolname=description]').invoke('val').then(descText => {
						expect(descText).to.include('Event: Security Advisory');
					});
					cy.get('tech-form dt').first().contains('Technology')
						.should('be.visible');
					cy.getByAutoId('CaseOpenSubTech').should('have.text', 'SubTech');
					cy.getByAutoId('CaseOpenProblemArea').should('have.text', 'Problem Area')
						.and('be.visible');
					// Verify 'pre-selected case details' can be expanded and vice versa
					cy.getByAutoId('ExpandContent').contains('View pre-selected case details')
						.click();
					cy.get('div[ng-reflect-height-transition-expanded=false]').should('exist');
					cy.getByAutoId('ExpandContent').contains('View pre-selected case details')
						.click();
					cy.get('div[ng-reflect-height-transition-expanded=true]').should('exist');
					// Verify the predictions provided by API are displayed
					cy.getByAutoId('PanelSelectOption0').contains(predict0);
					cy.getByAutoId('PanelSelectOption1').contains(predict1);
					cy.getByAutoId('PanelSelectOption2').contains(predict2);
					cy.getByAutoId('RefreshSuggestions').should('exist');
					// Select the first prediction
					cy.getByAutoId('PanelSelectOption0').click();
					// Extract the problem codes info from API response for the selected subtech
					cy.wait('@subtech').then(xhr => {
						const sublists = xhr.response.body.subTechList;
						const problem = sublists
							.find(sublist => sublist.techId === techID && sublist._id === subID);
						problemCodes = problem.problemCodes;
					});
					// Extract customer activities groups and the associated problem code names
					cy.wait('@problemcode').then(xhr => {
						problemAreas = xhr.response.body.problemArea.customerActivities;
						problemCodes.forEach(problem => {
							const config = problemAreas
								.find(problemArea => problemArea.problemCode === problem && problemArea.customerActivity === 'Configuration');
							const upgrade = problemAreas
								.find(problemArea => problemArea.problemCode === problem && problemArea.customerActivity === 'Upgrade');
							const operate = problemAreas
								.find(problemArea => problemArea.problemCode === problem && problemArea.customerActivity === 'Operate');
							const install = problemAreas
								.find(problemArea => problemArea.problemCode === problem && problemArea.customerActivity === 'Installation');
							if (config) {
								customerAct.configArray.push(config.problemCodeName);
							}
							if (upgrade) {
								customerAct.upgradeArray.push(upgrade.problemCodeName);
							}
							if (operate) {
								customerAct.operateArray.push(operate.problemCodeName);
							}
							if (install) {
								customerAct.installArray.push(install.problemCodeName);
							}
						});
						customerAct.upgradeArray.sort();
						customerAct.installArray.sort();
						customerAct.configArray.sort();
						customerAct.operateArray.sort();
					});
					// Verify the data input for ProblemArea matches with xhr response
					cy.window().then(win => {
						problemAreaOptions = win.cyProblemAreaCode;
						problemAreaOptions.Configuration = problemAreaOptions.Configuration
							.map(config => config.problemCodeName);
						problemAreaOptions.Installation = problemAreaOptions.Installation
							.map(install => install.problemCodeName);
						problemAreaOptions.Operate = problemAreaOptions.Operate
							.map(operate => operate.problemCodeName);
						problemAreaOptions.Upgrade = problemAreaOptions.Upgrade
							.map(upgrade => upgrade.problemCodeName);
						expect(problemAreaOptions.Configuration).eql(customerAct.configArray);
						expect(problemAreaOptions.Installation).eql(customerAct.installArray);
						expect(problemAreaOptions.Operate).eql(customerAct.operateArray);
						expect(problemAreaOptions.Upgrade).eql(customerAct.upgradeArray);
					});
				});
			});
			// Close the OpenCase Modal
			cy.getByAutoId('CaseOpenClose').click();
			cy.getByAutoId('CaseOpenCancel').click();
			// Verify the OpenCase Modal is no longer displayed
			cy.get('app-case-open-advisories').should('not.exist');
		});
	});
});
