import { startCase, toLower } from 'lodash-es';
import RouteWatch from '../support/routeWatch';
import MockService from '../support/mockService';
import { MockAssets } from '../../src/environments/mock/inventory/assets';

const assetMock = new MockService('AssetScenarios');
const coverageMock = new MockService('CoverageScenarios');
const networkScenario = assetMock.getScenario('GET', 'Assets Page 1');
const cardScenario = assetMock.getScenario('GET', 'Assets Page 1 - Grid View');
const assets = networkScenario.response.body.data;
const assetCards = cardScenario.response.body.data;
const totalCountScenario = coverageMock.getScenario('GET', 'Coverage Counts');
const coverageElements = totalCountScenario.response.body;
const vulnMock = new MockService('VulnerabilityScenarios');
const advisoryScenario = vulnMock.getScenario('GET', 'Advisory Counts - Large');
const advisoryCounts = advisoryScenario.response.body;
const caseMock = new MockService('CaseScenarios');
const caseScenario = caseMock.getScenario('GET', 'Case Details');
const caseListScenario = caseMock.getScenario('GET', `Cases for SN ${assets[0].serialNumber}`);
const caseResponse = caseScenario.response.body;
const caseListResponse = caseListScenario.response.body;
const hwMock = new MockService('HardwareScenarios');
const hwScenario = hwMock.getScenario('GET', 'Hardware');
const hwResponse = hwScenario.response.body.data;
const hwEOLMock = new MockService('HardwareEOLBulletinScenarios');
const hwEOLScenario = hwEOLMock.getScenario('GET', 'Hardware EOL Bulletins');
const hwEOLResponse = hwEOLScenario.response.body.data[0];
const assetSummaryMock = new MockService('AssetSummaryScenarios');
const assetSummaryScenario = assetSummaryMock.getScenario('GET', 'Asset Summary');
const assetSummary = assetSummaryScenario.response.body;
const bugMock = new MockService('CriticalBugScenarios');
const bugScenario = bugMock.getScenario('GET', 'Critical Bugs for FOC1544Y16T');
const bugResponse = bugScenario.response.body;
const advisorySecMock = new MockService('AdvisorySecurityAdvisoryScenarios');
const advisorySecScenario = advisorySecMock.getScenario('GET', 'Security Advisories for FOC1544Y16T');
const advisorySec = advisorySecScenario.response.body;
const advisoryFNMock = new MockService('FieldNoticeAdvisoryScenarios');
const advisoryFNScenario = advisoryFNMock.getScenario('GET', 'Field Notice Advisories for FOC1544Y16T');
const advisoryFN = advisoryFNScenario.response.body;
const neMock = new MockService('NetworkScenarios');
const neScenario = neMock.getScenario('GET', 'Network Elements Page 1');
const networkElements = neScenario.response.body.data;

Cypress.moment.locale('en', {
	// change moment's default formatting to match the app's format
	relativeTime: { dd: '%d days', M: 'a month', MM: '%d months' },
});

const dateFormat = 'YYYY MMM DD';
const i18n = require('../../src/assets/i18n/en-US.json');

describe('Assets', () => { // PBC-41
	before(() => {
		cy.window().then(win => { // Must be done before app loads
			win.sessionStorage.clear();
		});
		cy.login();
		cy.loadApp('/solution/assets');
		cy.window().then(win => { // Must be done after app loads
			MockService.enableAll();
			win.Cypress.hideDNACHeader = true;
		});
		cy.waitForAppLoading();
	});

	context('PBC-151: Asset 360 view', () => {
		it('Provides an Asset 360 view modal', () => { // PBC-152
			/* TODO: Full screen view has been removed until a future sprint
			// const { halfWidthInPx, widthInPx } = util.getViewportSize();
			cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
			cy.get('asset-details').should('have.css', 'width', widthInPx); // expand to full width
			cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
			cy.get('asset-details').should('have.css', 'width', halfWidthInPx); // shrink to half width
			*/
			const validate360 = asset => {
				cy.get('[detailsPanelTitle]').should('have.text', asset.deviceName);
				cy.getByAutoId('Asset360SupportLevel')
					.should('have.text', '2');
				if (asset.lastScan) {
					const scanTime = Cypress._.startCase(Cypress.moment(asset.lastScan).fromNow());
					cy.getByAutoId('Asset360LastScan').should('have.text', `Last Scan${scanTime}`);
				} else {
					cy.getByAutoId('Asset360LastScan').should('have.text', 'Last ScanNever');
				}
				const haveVisibility = asset.supportCovered ? 'be.visible' : 'not.be.visible';
				cy.getByAutoId('Asset360OpenCaseBtn').should(haveVisibility); // PBC-339

				// PBC-153
				cy.getByAutoId('ProductFamily').should('have.text', asset.productFamily);
				cy.getByAutoId('YouHaveInventory').should(
					'have.text', `you have ${hwResponse.length} of these in your inventory`
				);
				cy.getByAutoId('_SoftwareVersion_-Link').should('have.text', asset.osVersion);
			};

			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			validate360(assets[0]);
			cy.get('.icon-asset').should('be.visible');
			cy.getByAutoId('Asset360ScanBtn').should('be.visible');
			cy.getByAutoId('_ProductSeries_-Link')
				.should('have.text', assetSummary.productFamily);
			cy.getByAutoId('_EndOfSale_-data').should(
				'have.text',
				Cypress.moment(assetSummary.eoSaleDate).format(dateFormat)
			);
			cy.getByAutoId('_LastDateOfSupport_-data').should(
				'have.text',
				Cypress.moment(assetSummary.lastDateOfSupport).format(dateFormat)
			);
			cy.getByAutoId('ToggleActiveCases').should('be.visible')
				.and('have.text', `View Open Cases (${caseListResponse.content.length})`);
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(3).click(); // switch to new asset without closing modal
			validate360(assets[3]);
			cy.getByAutoId('ToggleActiveCases').should('not.be.visible'); // PBC-338
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(3).click(); // PBC-164, close the 360 view
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(2).click();
			validate360(assets[2]);

			cy.getByAutoId('CloseDetails').click();
		});

		it('Displays hardware info', () => { // PBC-154, PBC-359, PBC-547
			const formatDate = date => Cypress.moment(date).format('ddd MMM DD YYYY');
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.getByAutoId('HARDWARETab').click();
			cy.get('[data-auto-id="HardwareModulesDrawer"] tbody tr').each((row, index) => {
				cy.wrap(row).within(() => {
					const data = hwResponse[index];
					cy.getByAutoId('Type-Cell').should('have.text', data.productType);
					const pid = data.productId ? data.productId : 'N/A';
					cy.getByAutoId('Product Family / ID-Cell').should(
						'have.text', `${data.productFamily} / ${pid}`
					);
					const serial = data.serialNumber ? data.serialNumber : 'N/A';
					cy.getByAutoId('Serial Number-Cell').should('have.text', serial);
				});
			});
			cy.getByAutoId('Announcement-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.eoLifeExternalAnnouncementDate));
			cy.getByAutoId('End of Sale-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.eoSaleDate));
			cy.getByAutoId('Last Ship-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.lastShipDate));
			cy.getByAutoId('End of Routine Failure Analysis-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.eoRoutineFailureAnalysisDate));
			cy.getByAutoId('End of New Service Attach-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.eoNewServiceAttachmentDate));
			cy.getByAutoId('End of Service Contract Renewal-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.eoServiceContractRenewalDate));
			cy.getByAutoId('Last Date of Support-SubTitle')
				.should('have.text', formatDate(hwEOLResponse.lastDateOfSupport));
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();

			cy.wrap(hwEOLMock.enable('Empty Hardware EOL Bulletins'));
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.getByAutoId('HARDWARETab').click();
			cy.get('pbc-timeline').should('not.exist');
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();

			cy.wrap(hwMock.enable('Empty Hardware'));
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.getByAutoId('HARDWARETab').click();
			cy.getByAutoId('NoHardwareInformationText')
				.should('have.text', 'No Hardware Information');

			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			hwEOLMock.enable('Hardware EOL Bulletins');
			hwMock.enable('Hardware');
		});

		it('Opens Asset 360 view when clicking asset cards', () => {
			const advisoryAPI = new RouteWatch('**/product-alerts/**');
			assetMock.enable('(Assets) Missing data - Grid View');
			cy.getByAutoId('grid-view-btn').click();

			const serial = assetCards[0].serialNumber;
			cy.getByAutoId(`Device-${serial}`).click();
			cy.getByAutoId('Asset360SupportLevel').should('have.text', '2');
			cy.getByAutoId('CloseDetails').click().then(() => {
				expect(advisoryAPI.called).to.eq(0); // PBC-353

				assetMock.disable('Assets Page 1 - Grid View');
				cy.getByAutoId('list-view-btn').click();
			});
		});

		it('Closes 360 view when leaving the assets page', () => { // PBC-165
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.get('details-panel').should('be.visible');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.get('details-panel').should('not.exist');
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading('inventoryLoading');
			cy.get('details-panel').should('not.exist');
		});

		it('Displays relevant asset advisories', () => { // PBC-56, PBC-239, PBC-240, PBC-548
			const getPaginationText = (pagination, type) => {
				let pageText = pagination.total < pagination.rows
					? `Showing ${pagination.total} of `
					: `Showing ${pagination.rows} of `;
				pageText += `${pagination.total} ${type}`;

				return pageText;
			};

			const getImpactIcon = severity => {
				switch (severity) {
					case 'Critical':
						return 'label--danger';
					case 'High':
						return 'label--warning-alt';
					case 'Medium':
						return 'label--warning';
					case 'Low':
					default:
						return 'label--info';
				}
			};

			cy.get('tbody tr').eq(0).click();
			cy.getByAutoId('ADVISORIESTab').click();

			let pageText = getPaginationText(advisorySec.Pagination, 'Security Advisories');
			cy.getByAutoId('AdvisoryTab-ShowingTxt').should('have.text', pageText);
			Cypress._.each(advisorySec.data, (advisory, index) => {
				cy.get('[data-auto-id="AssetDetailsAdvisoryTable"] tbody tr').eq(index).within(() => {
					if (advisory.severity) {
						cy.getByAutoId('ImpactIcon')
							.should('have.class', getImpactIcon(advisory.severity));
						cy.getByAutoId('ImpactText').should('have.text', advisory.severity);
					} else {
						cy.getByAutoId('ImpactText').should('have.text', 'Unknown');
					}
					cy.getByAutoId('AdvisoryTitle')
						.should('have.text', advisory.title);
					let date = advisory.lastUpdated ? advisory.lastUpdated : advisory.publishedOn;
					if (date) {
						date = Cypress.moment(date).format(dateFormat);
					} else {
						date = 'Never';
					}
					cy.getByAutoId('AdvisoryLastUpdated').should('have.text', date);
				});
			});
			// TODO: Disabled for PBC-721
			// if (advisorySec.Pagination.total > advisorySec.data.length) {
			// 	cy.getByAutoId('LoadMoreButton').click();
			// 	cy.waitForAppLoading();
			// 	cy.get('[data-auto-id="AssetDetailsAdvisoryTable"] tbody tr')
			// 		.should('have.length.greaterThan', 10);
			// } else {
			// 	cy.getByAutoId('LoadMoreButton').should('not.be.visible');
			// }

			cy.getByAutoId('AdvisoryTab-field').click();
			pageText = getPaginationText(advisoryFN.Pagination, 'Field Notices');
			cy.getByAutoId('AdvisoryTab-ShowingTxt').should('have.text', pageText);
			Cypress._.each(advisoryFN.data, (advisory, index) => {
				cy.get('[data-auto-id="AssetDetailsAdvisoryTable"] tbody tr').eq(index).within(() => {
					cy.getByAutoId('FieldNoticeId')
						.should('have.text', `FN ${advisory.id}`)
						.and('have.attr', 'href', advisory.url)
						.and('have.attr', 'target', '_blank');
					cy.getByAutoId('AdvisoryTitle').should('have.text', advisory.title);
					let date = advisory.lastUpdated ? advisory.lastUpdated : advisory.publishedOn;
					if (date) {
						date = Cypress.moment(date).format(dateFormat);
					} else {
						date = 'Never';
					}
					cy.getByAutoId('AdvisoryLastUpdated').should('have.text', date);
				});
			});
			// TODO: Disabled for PBC-721
			// if (advisoryFN.Pagination.total > advisoryFN.data.length) {
			// 	cy.getByAutoId('LoadMoreButton').click();
			// 	cy.waitForAppLoading();
			// 	cy.get('[data-auto-id="AssetDetailsAdvisoryTable"] tbody tr')
			// 		.should('have.length.greaterThan', 10);
			// } else {
			// 	cy.getByAutoId('LoadMoreButton').should('not.be.visible');
			// }

			cy.getByAutoId('AdvisoryTab-bug').click();
			pageText = getPaginationText(bugResponse.Pagination, 'Priority Bugs');
			cy.getByAutoId('AdvisoryTab-ShowingTxt').should('have.text', pageText);
			Cypress._.each(bugResponse.data, (bug, index) => {
				cy.get('[data-auto-id="AssetDetailsAdvisoryTable"] tbody tr').eq(index).within(() => {
					cy.getByAutoId('BugID').should('have.text', bug.id);
					cy.getByAutoId('Title-Cell').should('have.text', bug.title);
					cy.getByAutoId('Status-Cell').should('have.text', startCase(bug.state));
					cy.getByAutoId('Last Updated-Cell').should(
						'have.text',
						Cypress.moment(bug.lastUpdated).format(dateFormat)
					);
				});
			});

			cy.get('[data-auto-id*="Device-"]').eq(0).click();
		});

		it('Shows support and warranty coverage', () => { // PBC-52, PBC-351
			const checkDataAndLink = (dataStatus, linkStatus) => {
				cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
				cy.getByAutoId('_SupportCoverage_-Uncovered').should(dataStatus);
				cy.getByAutoId('_SupportCoverage_-Link').should(linkStatus);
				cy.getByAutoId('_Warranty_-Uncovered').should(dataStatus);
				cy.getByAutoId('_Warranty_-Link').should(linkStatus);
				cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			};

			const contractEnd = Cypress.moment(assetSummary.coverageEndDate).format(dateFormat);
			const warrantyEnd = Cypress.moment(assetSummary.warrantyEndDate).format(dateFormat);
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.getByAutoId('_SupportCoverage_-CoveredUntil')
				.should('have.text', `Covered until ${contractEnd}`);
			cy.getByAutoId('_SupportCoverage_-Link')
				.should(
					'have.text', `${assetSummary.contractNumber} ${assetSummary.slaDescription}`
				);
			cy.getByAutoId('_Warranty_-CoveredUntil')
				.should('have.text', `Covered until ${warrantyEnd}`);
			cy.getByAutoId('_Warranty_-Link').should('have.text', assetSummary.warrantyType);
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();

			assetSummaryMock.enable('Not Covered');
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.getByAutoId('_SupportCoverage_-Uncovered').should('have.text', 'Uncovered');
			cy.getByAutoId('_Warranty_-Uncovered').should('have.text', 'Uncovered');
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();

			// PBC-352
			assetSummaryMock.enable('No keys');
			checkDataAndLink('be.visible', 'be.empty');
			assetSummaryMock.enable('No dates');
			checkDataAndLink('be.visible', 'be.empty');
			assetSummaryMock.enable('Null keys');
			checkDataAndLink('be.visible', 'be.empty');
			assetSummaryMock.enable('Null dates');
			checkDataAndLink('be.visible', 'be.empty');

			// Cleanup
			assetSummaryMock.enable('Asset Summary');
		});

		it('Gracefully handles API failures', () => { // PBC-342
			advisoryFNMock.enable('Field Notice Advisories for FOC1544Y16T - Unreachable');
			assetSummaryMock.enable('Asset Summary - Unreachable');
			hwMock.enable('Hardware productId - Unreachable');

			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			cy.getByAutoId('_ProductSeries_-N/A').should('have.text', 'N/A');
			cy.getByAutoId('_EndOfSale_-data').should('have.text', 'Not Announced'); // PBC-707
			cy.getByAutoId('_LastDateOfSupport_-data').should('have.text', 'Not Announced');
			cy.getByAutoId('ADVISORIESTab').click();
			cy.getByAutoId('AdvisoryTab-field').click();
			cy.getByAutoId('AdvisoriesNoResultsFound').should('have.text', 'No Results Found');

			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			advisoryFNMock.enable('Field Notice Advisories for FOC1544Y16T');
			assetSummaryMock.enable('Asset Summary');
			hwMock.enable('Hardware productId');
		});
	});

	context('PBC-178: Assets & Coverage Gauge', () => {
		it('Displays a gauge that shows coverage percentage', () => {
			const total = Cypress._.reduce(coverageElements, (memo, value) => memo + value);
			const coverage = Math.round((coverageElements.covered / total) * 100);
			cy.getByAutoId('Facet-Assets & Coverage').should('contain', `${coverage}%`)
				.and('contain', 'ASSETS & COVERAGE')
				.and('contain', 'Support Coverage');
		});

		it('Gracefully handles invalid responses from the API', () => {
			coverageMock.enable('Coverage - Empty Body');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();

			cy.getByAutoId('Facet-Assets & Coverage').should('contain', '0%');
			coverageMock.enable('Coverage - Invalid Body');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();
			cy.getByAutoId('Facet-Assets & Coverage').should('contain', '0%');
			coverageMock.enable('Coverage 500 Failure');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();
			cy.getByAutoId('Facet-Assets & Coverage').should('contain', '0'); // PBC-227

			coverageMock.enable('Coverage Counts');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();
		});

		it('Shows <1% for small coverage values', () => { // PBC-226, PBC-726
			coverageMock.enable('Coverage < 1%');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();

			cy.getByAutoId('Facet-Assets & Coverage').should('contain', '1%');

			coverageMock.enable('Coverage Counts');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();
		});

		it('Pre-selects the gauge when reloading a page with filters applied', () => { // PBC-271
			cy.getByAutoId('CoveredPoint', { timeout: 30000 }).click({ force: true });
			cy.reload();
			cy.waitForAppLoading('inventoryLoading');
			cy.getByAutoId('Facet-Assets & Coverage')
				.should('have.class', 'km__items__item km__items__item--selected');
			cy.getByAutoId('VisualFilter-coverage')
				.should('have.class', 'visual-filter__card__selected');

			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.waitForAppLoading('inventoryLoading');
		});
	});

	context('PBC-36: Asset List - Table View', () => {
		it('Displays assets correctly in list view', () => {
			cy.get('tbody > tr').should('have.length', assets.length);
			Cypress._.each(assets, (asset, index) => {
				const serial = asset.serialNumber;
				cy.getByAutoId(`InventoryItem-${serial}`).within(() => { // PBC-257
					if (serial === networkElements[index].serialNumber) {
						if (networkElements[index].productType === 'Routers') {
							cy.get('[data-auto-id*="DeviceIcon-"]').should(
								'have.attr', 'src',	'assets/img/assets/device-router-outline.svg'
							);
						} else if (networkElements[index].productType === 	'LAN Switches') {
							cy.get('[data-auto-id*="DeviceIcon-"]').should(
								'have.attr', 'src', 'assets/img/assets/device-switch-outline.svg'
							);
						} else {
							cy.get('[data-auto-id*="DeviceIcon-"]').should('not.exist');
						}
					}
					const deviceName = Cypress._.truncate(asset.deviceName, { length: 53 });
					cy.getByAutoId(`Device-${serial}`).should('have.text', deviceName);
					cy.getByAutoId(`IP Address-${serial}`).should('have.text', asset.ipAddress);
					const scan = asset.lastScan ? Cypress.moment(asset.lastScan).fromNow() : 'Never';
					cy.getByAutoId(`Last Scan-${serial}`).should('have.text', scan);
					if (asset.criticalAdvisories) {
						cy.getByAutoId('CriticalAdvisoriesIcon')
							.should('have.text', asset.criticalAdvisories);
					} else {
						cy.getByAutoId('CriticalAdvisoriesIcon').should('not.exist');
					}
					if (asset.supportCovered) {
						cy.getByAutoId('SupportCoveredIcon').should('exist');
					} else {
						cy.getByAutoId('SupportCoveredIcon').should('not.exist');
					}
					cy.getByAutoId(`Serial Number-${serial}`).should('have.text', serial);
					cy.getByAutoId(`Software Type-${serial}`).should('have.text', asset.osType);
					cy.getByAutoId(`Software Version-${serial}`)
						.should('have.text', asset.osVersion);
					if (asset.role) { // PBC-297
						cy.getByAutoId(`Role-${serial}`)
							.should('have.text', startCase(toLower(asset.role)));
					}
				});
			});
		});

		it('Supports selecting one or more assets in the list', () => {
			cy.getByAutoId(`InventoryItemCheckbox-${assets[0].serialNumber}`).click();
			cy.getByAutoId(`InventoryItemCheckbox-${assets[1].serialNumber}`).click();
			cy.getByAutoId(`InventoryItemSelect-${assets[0].serialNumber}`).should('be.checked');
			cy.getByAutoId(`InventoryItemSelect-${assets[1].serialNumber}`).should('be.checked');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '2 Selected');
			cy.getByAutoId(`InventoryItemCheckbox-${assets[0].serialNumber}`).click();
			cy.getByAutoId(`InventoryItemSelect-${assets[0].serialNumber}`).should('not.be.checked');
			cy.getByAutoId('AllAssetSelectCheckbox').click();
			cy.getByAutoId('TotalSelectedCount').should('have.text', `${assets.length} Selected`);
			cy.getByAutoId('AllAssetSelectCheckbox').click();
			cy.getByAutoId('TotalSelectedCount').should('not.exist');

			// PBC-258
			const singleDeviceContract = '93856991';
			cy.getByAutoId(`${singleDeviceContract}Point`).click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.get('[data-auto-id="AssetsTableBody"] tr').should('have.length', 1);
			cy.get('[data-auto-id*="InventoryItemSelect-"]').click({ force: true });
			cy.getByAutoId('TotalSelectedCount').should('have.text', '1 Selected');
			cy.getByAutoId('FilterBarClearAllFilters').click();
		});

		it('Renders table gracefully when APIs are unavailable', () => {
			assetMock.enable('(Assets) Unreachable API');

			cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			assetMock.enable('Assets Page 1');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading('inventoryLoading');
		});

		it('Uses proper pagination for asset list', () => {
			const response = MockAssets(10, 2);
			const pagination = response.Pagination;

			cy.getByAutoId('CUIPager-Page2').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.url().should('include', 'page=2');
			cy.wrap(pagination.rows).should('eq', 10);
			cy.get('[data-auto-id*="CUIPager-Page"]') // PBC-288
				.should('have.length', Cypress._.ceil(pagination.total / pagination.rows));

			cy.getByAutoId('CUIPager-NextPage').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.url().should('include', 'page=3');

			cy.getByAutoId('CUIPager-PrevPage').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.url().should('include', 'page=2');

			cy.getByAutoId('CUIPager-Page1').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
		});

		it('Filters asset list with all visual filters', () => { // PBC-228, PBC-253, PBC-700
			const checkAdvisoryFilters = () => {
				cy.server();
				cy.route('**/inventory/v1/assets?**').as('assets');
				cy.get('[data-auto-id="VisualFilter-advisories"] [data-auto-id="BugsPoint"]')
					.click({ force: true });
				cy.wait('@assets').its('url').should('contain', 'hasBugs=true');
				cy.getByAutoId('FilterTag-hasBugs').should('exist');
				cy.get('[data-auto-id="VisualFilter-advisories"] [data-auto-id="Field NoticesPoint"]')
					.click({ force: true });
				cy.wait('@assets').its('url').should('contain', 'hasFieldNotices=true');
				cy.getByAutoId('FilterTag-hasFieldNotices').should('exist');
				cy.get('[data-auto-id="VisualFilter-advisories"] [data-auto-id="Security AdvisoriesPoint"]')
					.click({ force: true });
				cy.wait('@assets').its('url').should('contain', 'hasSecurityAdvisories=true');
				cy.getByAutoId('FilterTag-hasSecurityAdvisories').should('exist');
			};

			const { contractNumber, role } = assets[0];
			cy.getByAutoId('CoveredPoint').click({ force: true });
			cy.getByAutoId('FilterTag-covered').should('be.visible');
			cy.getByAutoId(`${contractNumber}Point`).click({ force: true });
			cy.getByAutoId(`FilterTag-${contractNumber}`).should('be.visible');
			cy.getByAutoId(`${Cypress._.capitalize(role.toLowerCase())}Point`)
				.click({ force: true });
			cy.getByAutoId(`FilterTag-${role}`).should('be.visible');
			cy.url().should('contain', 'coverage=covered')
				.and('contain', `contractNumber=${contractNumber}`)
				.and('contain', `role=${role}`);
			cy.getByAutoId(`FilterTag-${contractNumber}`).click().should('not.exist');
			cy.url().should('not.contain', 'contractNumber');
			checkAdvisoryFilters();
			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.getByAutoId('FilterTag-covered').should('not.exist');
			cy.url().should('not.contain', 'coverage').and('not.contain', 'role');
		});

		it('Hides visual filters when count APIs are unavailable', () => { // PBC-254, PBC-691
			coverageMock.enable('Contract Counts Data Unavailable');
			cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
			cy.getByAutoId('Facet-Assets & Coverage').click();

			cy.getByAutoId('VisualFilter-contractNumber').should('not.be.visible');
			cy.getByAutoId('VisualFilter-coverage').should('be.visible');

			coverageMock.enable('Contract Counts Data');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading();
		});

		it('Combines visual filters appropriately', () => {
			cy.server();
			cy.route('**/inventory/v1/assets?*').as('assets');

			cy.getByAutoId('CoveredPoint').click({ force: true }).wait('Covered Assets');
			cy.getByAutoId(`${assets[0].contractNumber}Point`).click({ force: true });
			cy.wait('@assets', { timeout: 30000 }).its('url').should('contain', 'coverage=covered')
				.and('contain', `contractNumber=${assets[0].contractNumber}`);

			cy.getByAutoId('FilterBarClearAllFilters').click();
		});

		it('Visual filters can be collapsed/expanded', () => {
			cy.getByAutoId('CoveredPoint').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.getByAutoId('VisualFilterCollapse').click();
			cy.getByAutoId('FilterTag-covered').should('be.visible');
			cy.getByAutoId('VisualFilter-total').should('not.be.visible');
			cy.getByAutoId('VisualFilterCollapse').click();
			cy.getByAutoId('VisualFilter-total').should('be.visible');

			cy.getByAutoId('FilterBarClearAllFilters').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
		});

		it('Provides an actions menu for each asset', () => { // PBC-255
			const coveredAsset = assets[0].serialNumber;
			const uncoveredAsset = assets[7].serialNumber;
			cy.getByAutoId(`InventoryItem-${coveredAsset}`).within(() => {
				cy.get('cui-dropdown').within($dropdown => {
					cy.wrap($dropdown).click({ force: true });
					cy.get('a').should('have.length', 2);
					cy.get('a').eq(0).should('have.text', 'Open Support Case');
					cy.get('a').eq(1).should('have.text', 'Scan');
					cy.wrap($dropdown).click({ force: true });
				});
			});

			cy.getByAutoId(`InventoryItem-${uncoveredAsset}`).within(() => {
				cy.get('cui-dropdown').within($dropdown => {
					cy.wrap($dropdown).click({ force: true });
					cy.get('a').should('have.length', 1);
					cy.get('a').eq(0).should('have.text', 'Scan');
					cy.wrap($dropdown).click({ force: true });
				});
			});
		});

		it('Properly closes the actions menu when clicking away', () => { // PBC-272, PBC-607
			cy.get('tr cui-dropdown').eq(0).click();
			cy.get('tr div.dropdown__menu').eq(0).should('be.visible');
			cy.get('tr cui-dropdown').eq(1).click(); // another asset's menu
			cy.get('tr div.dropdown__menu').eq(0).should('not.be.visible');
			cy.get('tr cui-dropdown').eq(0).click();
			cy.get('cui-dropdown').eq(0).click(); // bulk actions menu
			cy.get('tr div.dropdown__menu').eq(0).should('not.be.visible');
			cy.get('tr cui-dropdown').eq(0).click();
			cy.get('[data-auto-id*="InventoryItemCheckbox"]').eq(0).click(); // select checkbox
			cy.get('tr div.dropdown__menu').eq(0).should('not.be.visible');
			cy.get('tr cui-dropdown').eq(0).click();
			cy.getByAutoId('VisualFilter-total').click(); // outside of table
			cy.get('tr div.dropdown__menu').eq(0).should('not.be.visible');
			cy.get('tr cui-dropdown').eq(0).click();
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click(); // 360 view
			cy.getByAutoId('CloseDetails').click();
			cy.get('tr div.dropdown__menu').eq(0).should('not.be.visible');
		});

		it('Unchecks all select boxes after clearing filters', () => { // PBC-273
			cy.getByAutoId('CoveredPoint').click({ force: true });
			cy.getByAutoId('AllAssetSelectCheckbox').click({ force: true });
			cy.getByAutoId('AllAssetSelect').should('be.checked');
			cy.get('[data-auto-id*="InventoryItemSelect-"]').eq(0).should('be.checked');
			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.getByAutoId('AllAssetSelect').should('not.be.checked');
			cy.get('[data-auto-id*="InventoryItemSelect-"]').eq(0).should('not.be.checked');
		});

		// TODO: Disabled until PBC-593 is fixed
		it.skip('Only shows asset results from the most recent query', () => { // PBC-274
			assetMock.disable(['Assets Page 1', 'Covered Assets']);
			const filteredXHR = new RouteWatch('**/inventory/v1/assets?*coverage=covered');
			cy.route('**/inventory/v1/assets?customerId=2431199&rows=10&page=1').as('unfiltered');

			// Quickly set and clear filters
			cy.getByAutoId('CoveredPoint').click({ force: true });
			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.wait('@unfiltered').then(xhr => {
				expect(filteredXHR.cancelled).to.eq(true);
				cy.getByAutoId('ShowingAssetsCount').should(
					'have.text', `Showing 1-10 of ${xhr.response.body.Pagination.total} assets`
				);
			});

			assetMock.enable(['Assets Page 1', 'Covered Assets']);
		});

		it('Uses comma separator in visual filter tooltips', () => { // PBC-275
			vulnMock.enable('Advisory Counts - Large');
			cy.reload();
			cy.waitForAppLoading();

			cy.getByAutoId('VisualFilter-advisories').within(() => {
				cy.getByAutoId('Security AdvisoriesPoint').hover();
				cy.getByAutoId('Security AdvisoriesTooltip')
					.should('contain', advisoryCounts['security-advisories'].toLocaleString());
			});
			vulnMock.enable('Advisory Counts');
		});
	});

	context('PBC-37: Asset List - Card View', () => {
		before(() => cy.getByAutoId('grid-view-btn').click());

		after(() => cy.getByAutoId('list-view-btn').click());

		it('Displays assets correctly in card view', () => {
			cy.get('div[data-auto-id*="InventoryItem"]').should('have.length', assetCards.length);
			Cypress._.each(assetCards, asset => {
				const serial = asset.serialNumber;
				let software = '';
				if (asset.osType) {
					software = `${asset.osType} `;
				}
				if (asset.osVersion) {
					const version = asset.osVersion.length > 8
						? `${Cypress._.truncate(asset.osVersion, { length: 8, omission: '' })}...`
						: asset.osVersion;
					software += version;
				}
				cy.getByAutoId(`InventoryItem-${serial}`).within(() => {
					// PBC-304
					let name = Cypress._.truncate(asset.deviceName, {
						length: 18, separator: ' ', omission: '',
					});
					name = name === asset.deviceName ? name : `${name}...`;
					cy.getByAutoId(`Device-${serial}`).should('have.text', name);
					// Device image is a static placeholder for now (CSCvq93486)
					cy.getByAutoId(`DeviceImg-${serial}`).should('have.text', 'No Photo Available');
					cy.getByAutoId(`IPAddress-${serial}`).should('have.text', asset.ipAddress);
					if (asset.lastScan) { // PBC-355
						cy.getByAutoId(`LastScan-${serial}`)
							.should('have.text', Cypress.moment(asset.lastScan).fromNow());
					}
					cy.getByAutoId(`SerialNumber-${serial}`)
						.should('have.text', asset.serialNumber);
					cy.getByAutoId(`Software-${serial}`).should('have.text', software);
					const role = asset.role ? startCase(toLower(asset.role)) : 'N/A'; // PBC-281
					cy.getByAutoId(`Role-${serial}`).should('have.text', role);
					if (asset.criticalAdvisories) {
						cy.getByAutoId(`AdvisoryCount-${serial}`)
							.should('have.text', asset.criticalAdvisories.toString());
						cy.getByAutoId(`AdvisoryIcon-${serial}`)
							.should('have.attr', 'data-balloon', 'Critical Advisories');
					} else {
						cy.getByAutoId(`AdvisoryCount-${serial}`).should('not.be.visible');
					}
					if (asset.supportCovered) {
						cy.getByAutoId(`CoveredIcon-${serial}`)
							.should('have.attr', 'data-balloon', 'Support Coverage');
					} else {
						cy.getByAutoId(`CoveredIcon-${serial}`).should('not.be.visible');
					}
				});
			});
		});

		it('Supports multiple selections of cards', () => {
			cy.get('div[data-auto-id*="InventoryItem"]').eq(0).click()
				.should('have.class', 'card__selected');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '1 Selected');
			cy.get('div[data-auto-id*="InventoryItem"]').eq(1).click()
				.should('have.class', 'card__selected');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '2 Selected');
			cy.get('div[data-auto-id*="InventoryItem"]').eq(1).click()
				.should('not.have.class', 'card__selected');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '1 Selected');
			cy.get('[data-auto-id*="Device-"]').eq(0).click();
			cy.get('details-panel').should('be.visible'); // PBC-286
			cy.get('[data-auto-id*="Device-"]').eq(0).click();
			cy.get('cui-dropdown[data-auto-id*="InventoryItem-FOC1544Y16T-dropdown"]')
				.eq(0).click();
			cy.get('div.card div.dropdown__menu').eq(0).should('be.visible');
			cy.get('cui-dropdown[data-auto-id*="InventoryItem-FOC1544Y16T-dropdown"]')
				.eq(0).click();
			cy.get('div[data-auto-id*="InventoryItem"]').eq(0).click()
				.should('not.have.class', 'card__selected');
			cy.getByAutoId('TotalSelectedCount').should('not.be.visible');
		});

		it('Uses proper pagination for asset cards', () => {
			const response = MockAssets(12, 2);
			const pagination = response.Pagination;

			cy.getByAutoId('CUIPager-Page2').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.url().should('include', 'page=2');
			cy.wrap(pagination.rows).should('eq', 12);
			cy.get('[data-auto-id*="CUIPager-Page"]') // PBC-288
				.should('have.length', Cypress._.ceil(pagination.total / pagination.rows));

			cy.getByAutoId('CUIPager-NextPage').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.url().should('include', 'page=3');

			cy.getByAutoId('CUIPager-PrevPage').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
			cy.url().should('include', 'page=2');

			cy.getByAutoId('CUIPager-Page1').click({ force: true });
			cy.waitForAppLoading('inventoryLoading');
		});

		it('Gracefully handles lack of response from API', () => {
			assetMock.enable('(Assets) Unreachable API - Grid View');

			cy.getByAutoId('Facet-Lifecycle').click(); // refresh grid
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading('inventoryLoading');
			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			assetMock.enable('(Assets) Missing data - Grid View');
			const serial = assetCards[0].serialNumber;

			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading('inventoryLoading');
			cy.getByAutoId('grid-view-btn').click();
			cy.getByAutoId(`LastScan-${serial}`).should('have.text', 'Never');
			cy.getByAutoId(`Software-${serial}`).should('have.text', 'N/A');
			cy.getByAutoId(`Role-${serial}`).should('have.text', 'N/A');
			cy.getByAutoId(`AdvisoryCount-${serial}`).should('not.be.visible');
			cy.getByAutoId(`CoveredIcon-${serial}`).should('not.be.visible');

			assetMock.enable('Assets Page 1 - Grid View');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading('inventoryLoading');
		});

		it('Provides an actions menu for each card', () => { // PBC-280
			const coveredAsset = assets[0].serialNumber;
			const uncoveredAsset = assets[7].serialNumber;
			cy.getByAutoId(`InventoryItem-${coveredAsset}`).within(() => {
				cy.get('cui-dropdown').within($dropdown => {
					cy.wrap($dropdown).click();
					cy.get('a').should('have.length', 2);
					cy.get('a').eq(0).should('have.text', 'Open Support Case');
					cy.get('a').eq(1).should('have.text', 'Scan');
					cy.wrap($dropdown).click();
				});
			});

			cy.getByAutoId(`InventoryItem-${uncoveredAsset}`).within(() => {
				cy.get('cui-dropdown').within($dropdown => {
					cy.wrap($dropdown).click();
					cy.get('a').should('have.length', 1);
					cy.get('a').eq(0).should('have.text', 'Scan');
					cy.wrap($dropdown).click();
				});
			});
		});

		it('Remembers the user\'s view preference', () => { // PBC-289
			cy.reload();
			cy.waitForAppLoading();
			cy.get('div.card').should('be.visible');
			cy.getByAutoId('list-view-btn').click();
			cy.reload();
			cy.waitForAppLoading();
			cy.get('table').should('be.visible');
		});
	});

	context('PBC-344: Asset Cases - Asset Based Case Open', () => {
		it('Provides an Asset 360 view modal', () => {
			const validate360OpenCase = asset => {
				const haveVisibility = asset.supportCovered ? 'be.visible' : 'not.be.visible';
				cy.getByAutoId('Asset360ScanBtn').should('be.visible');
				cy.getByAutoId('Asset360OpenCaseBtn').should(haveVisibility).click(); // PBC-344
				cy.getByAutoId('CaseOpenCancelButton').click(); // Cancel modal
				cy.getByAutoId('CaseOpenCancel').click(); // Confirm cancel
			};
			cy.get('[data-auto-id="AssetsTableBody"] tr').eq(0).click();
			validate360OpenCase(assets[0]); // Currently only first asset has the CaseOpen Button

			cy.getByAutoId('CloseDetails').click();
		});
	});

	context('PBC-90: Asset List -> Case List View', () => {
		// Verify the Case List 360 view
		it('Opens Case List 360 view when clicking asset cards', () => { // PBC-90
			cy.getByAutoId('grid-view-btn').click();
			const serial = assetCards[0].serialNumber;
			cy.getByAutoId(`Device-${serial}`).click();
			cy.getByAutoId('Asset360OpenCaseBtn')
				.should('be.visible');
			cy.getByAutoId('ToggleActiveCases').click();
			// Verify the data in Case List
			const caseDetailNumber = caseResponse.caseNumber;
			cy.getByAutoId(`caseId-${caseDetailNumber}`).eq(0)
				.should('have.text', caseResponse.caseNumber);
			cy.getByAutoId('Summary-Cell').eq(0)
				.should('have.text', caseResponse.summary);
			cy.get('div.grayBox.text-center.flex-center').eq(0)
				.should('have.text', caseResponse.status);
			// Verify the Table headers
			cy.getByAutoId('Severity-Header')
				.should('have.text', 'Severity');
			cy.getByAutoId('Case ID-Header')
				.should('have.text', 'Case ID');
			cy.getByAutoId('Summary-Header')
				.should('have.text', 'Summary');
			cy.getByAutoId('Status-Header')
				.should('have.text', 'Status');
			cy.getByAutoId('Updated-Header')
				.should('have.text', 'Updated');
			expect(cy.getByAutoId('Summary-Cell')
				.its('length')
				.should('be.gt', 0));
			cy.getByAutoId('close').click();
			cy.getByAutoId(`Device-${serial}`).click();
		});
	});

	context('PBC-91: Asset List -> Case Detail View', () => {
		// Verify the Case Detail 360 view
		it('Opens Case Detail 360 view ', () => { // PBC-91
			// TODO: Add auto-ids
			const serial = assetCards[0].serialNumber;
			cy.getByAutoId(`Device-${serial}`).click();
			cy.getByAutoId('ToggleActiveCases').click();
			const caseDetailNumber = caseResponse.caseNumber;
			cy.getByAutoId(`caseId-${caseDetailNumber}`).eq(0).click();
			cy.waitForAppLoading();
			// Verify the Case Details Data
			cy.getByAutoId('asset-details-toggle-fullscreen-icon')
				.should('be.visible').click();
			cy.get('ng-component details-panel').should('have.class', 'fullscreen');
			cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
			cy.get('ng-component details-panel').should('not.have.class', 'fullscreen');
			cy.getByAutoId('CloseDetails').should('be.visible');
			cy.get('[data-auto-id="relatedRMA"]', { timeout: 20000 }).should('be.visible');
			cy.getByAutoId('CaseAttachFile').should('be.visible');
			cy.getByAutoId('CaseAddNote').should('be.visible');
			cy.getByAutoId('summaryTab').should('be.visible');
			cy.getByAutoId('notesTab').should('be.visible');
			cy.getByAutoId('filesTab').should('be.visible');
			cy.getByAutoId('caseTechnology')
				.should('have.text', i18n._RMACaseTechnology_.toUpperCase());

			// Related RMAs dropdown
			cy.getByAutoId('relatedRMA').click();
			cy.waitForAppLoading();
			cy.getByAutoId('Name-Header').should('have.text', i18n._Name_);
			cy.getByAutoId('Status-Header').eq(0).should('have.text', i18n._Status_);
			cy.getByAutoId('Ship To-Header').should('have.text', i18n._ShipTo_);
			cy.getByAutoId('Contract Number-Header').should('have.text', i18n._ContractNumber_);
			cy.getByAutoId('Created-Header').should('have.text', i18n._Created_);
			// TODO: Verify the RMA dropdown data from Mock API
			cy.getByAutoId('close').click();
			cy.getByAutoId('caseProbType')
				.should('have.text', i18n._RMACaseProblemType_.toUpperCase());
			cy.getByAutoId('caseAsset')
				.should('have.text', i18n._RMACaseSystem_.toUpperCase());
			cy.getByAutoId('caseSW')
				.should('have.text', i18n._RMACaseSoftwareRelease_.toUpperCase());
			cy.getByAutoId('caseContract').should('have.text', i18n._Contract_.toUpperCase());
			cy.getByAutoId('caseTracking')
				.should('have.text', i18n._RMACaseTrackingNumber_.toUpperCase());
			cy.getByAutoId('caseOwnerEmail')
				.should('have.text', i18n._RMACaseOwnerEmail_.toUpperCase());
			cy.getByAutoId('caseTacEng')
				.should('have.text', i18n._TACEngineer_.toUpperCase());
			cy.getByAutoId('caseSummaryTitle')
				.should('have.text', i18n._RMACaseSummaryTitle_.toUpperCase());
			cy.getByAutoId('caseDescription')
				.should('have.text', i18n._RMACaseDescription_.toUpperCase());
			cy.get('[detailspaneltitle]')
				.should('have.text', `Case ${caseResponse.caseNumber}`);
			cy.get('[data-auto-id="caseContract"] + div')
				.should('have.text', caseResponse.contractId);
			cy.getByAutoId('mailTacEngineer').should('have.text', caseResponse.ownerEmail);
			cy.get('[data-auto-id="caseSummaryTitle"] + div')
				.should('have.text', caseResponse.summary);
			cy.get('div.col-md-3 > div:nth-child(2)')
				.should('have.text', caseResponse.status);
			cy.getByAutoId('CloseDetails').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
		});
	});
});
