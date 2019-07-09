import { RouteWatch, Util } from '@apollo/cypress-util';
import { capitalize } from 'lodash-es';
import MockService from '../support/mockService';

const util = new Util();
const assetMock = new MockService('AssetScenarios');
const coverageMock = new MockService('CoverageScenarios');
const networkScenario = assetMock.getScenario('GET', 'Assets Page 1');
const cardScenario = assetMock.getScenario('GET', 'Assets Page 1 - Grid View');
const assets = networkScenario.response.body.data;
const assetCards = cardScenario.response.body.data;
const totalCountScenario = coverageMock.getScenario('GET', 'Coverage');
const coverageElements = totalCountScenario.response.body;
const vulnMock = new MockService('VulnerabilityScenarios');
const advisoryScenario = vulnMock.getScenario('GET', 'Advisory Counts');
const advisoryCounts = advisoryScenario.response.body;

describe('Assets', () => { // PBC-41
	before(() => {
		cy.login();
		cy.loadApp('/solution/assets');
		cy.waitForAppLoading();
	});

	context('PBC-151: Asset 360 view', () => {
		// TODO: rewrite these tests around the 360 view
		it.skip('Provides an Asset 360 view modal', () => {
			const { halfWidthInPx, widthInPx } = util.getViewportSize();
			cy.get('tr').eq(1).click();
			cy.get('asset-details')
				.should('be.visible')
				.and('have.css', 'width', halfWidthInPx); // default to half width
			cy.getByAutoId('Asset360SerialNumber').should('have.text', `Serial Number${assets[0].serialNumber}`);
			cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
			cy.get('asset-details').should('have.css', 'width', widthInPx); // expand to full width
			cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
			cy.get('asset-details').should('have.css', 'width', halfWidthInPx); // shrink to half width
			cy.get('tr').eq(3).click(); // switch to new asset without closing modal
			cy.getByAutoId('Asset360SerialNumber').should('have.text', `Serial Number${assets[2].serialNumber}`);
			cy.getByAutoId('ClearAsset').click();
		});

		// TODO: rewrite these tests around the 360 view
		it.skip('Provides an Activity timeline in the 360 view modal', () => { // PBC-158
			cy.get('tr').eq(1).click();
			cy.getByAutoId('ActivityTab').click();

			// TODO: This is all placeholder data to be replaced when the API is ready
			cy.get('div.timeline__time').eq(0).should('have.text', 'a few seconds ago');
			cy.get('div.timeline__content').eq(0)
				.should('contain', 'Title')
				.and('contain', 'Lorem ipsum');
			cy.getByAutoId('ClearAsset').click();
		});

		// TODO: rewrite these tests around the 360 view
		it.skip('Opens Asset 360 view when clicking asset cards', () => {
			cy.getByAutoId('grid-view-btn').click();

			const serial = assetCards[0].serialNumber;
			cy.getByAutoId(`Device-${serial}`).click();
			cy.get('asset-details').should('be.visible');
			cy.getByAutoId('Asset360SerialNumber')
				.should('have.text', `Serial Number${serial}`);
			cy.getByAutoId('ClearAsset').click();

			cy.getByAutoId('list-view-btn').click();
		});
	});

	context('PBC-178: Assets & Coverage Gauge', () => {
		it('Displays a gauge that shows coverage percentage', () => {
			const total = Cypress._.reduce(coverageElements, (memo, value) => memo + value);
			const coverage = Math.floor((coverageElements.covered / total) * 100);
			cy.getByAutoId('Facet-Assets & Coverage').should('contain', `${coverage}%`)
				.and('contain', 'ASSETS & COVERAGE')
				.and('contain', 'Support Coverage');
		});

		it('Gracefully handles invalid responses from the API', () => {
			coverageMock.disable('Coverage');
			coverageMock.enable('Coverage - Empty Body');
			cy.loadApp('/solution/assets');

			cy.getByAutoId('Facet-Assets & Coverage').should('contain', '0%');
			coverageMock.disable('Coverage - Empty Body');
			coverageMock.enable('Coverage - Invalid Body');
			cy.loadApp('/solution/assets');
			cy.getByAutoId('Facet-Assets & Coverage').should('contain', '0%');
			// TODO: Test for API not responding - waiting on PBC-227

			coverageMock.disable('Coverage - Invalid Body');
			coverageMock.enable('Coverage');
			cy.loadApp('/solution/assets');
			cy.waitForAppLoading();
		});
	});

	context('PBC-36: Asset List - Table View', () => {
		it('Displays assets correctly in list view', () => {
			cy.get('tbody > tr').should('have.length', assets.length);
			Cypress._.each(assets, asset => {
				const serial = asset.serialNumber;
				cy.getByAutoId(`InventoryItem-${serial}`).within(() => { // PBC-257
					// Icon is a static placeholder for now
					cy.getByAutoId(`DeviceIcon-${serial}`).should('have.class', 'icon-4-way-nav');
					cy.getByAutoId(`Device-${serial}`).should('have.text', asset.deviceName);
					cy.getByAutoId(`IP Address-${serial}`).should('have.text', asset.ipAddress);
					// TODO: "Last Scan" is not implemented yet
					cy.getByAutoId(`Last Scan-${serial}`).should('have.text', 'Never');
					// TODO: "Critical Advisories" is not implemented yet
					// cy.getByAutoId(`Critical Advisories-${serial}`).should('have.text', '');
					if (asset.supportCovered) {
						cy.getByAutoId('SupportCoveredIcon').should('be.visible');
					} else {
						cy.getByAutoId('SupportCoveredIcon').should('not.be.visible');
					}
					cy.getByAutoId(`Serial Number-${serial}`)
						.should('have.text', asset.serialNumber);
					cy.getByAutoId(`Software Type-${serial}`).should('have.text', asset.osType);
					cy.getByAutoId(`Software Version-${serial}`)
						.should('have.text', asset.osVersion);
					if (asset.role) {
						cy.getByAutoId(`Role-${serial}`).should('have.text', capitalize(asset.role));
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
			cy.getByAutoId(`${singleDeviceContract}Point`).click();
			cy.get('tbody tr').should('have.length', 1);
			cy.get('td[data-auto-id*="InventoryItemSelect"]').click();
			cy.getByAutoId('TotalSelectedCount').should('have.text', '1 Selected');
			cy.getByAutoId('FilterBarClearAllFilters').click();
		});

		it('Renders table gracefully when APIs are unavailable', () => {
			assetMock.disable('Assets Page 1');
			assetMock.enable('(Assets) Unreachable API');

			cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			assetMock.disable('(Assets) Unreachable API');
			assetMock.enable('Assets Page 1');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading();
		});

		it('Uses proper pagination for asset list', () => {
			// TODO: When AP-5378 is implemented, this test can be done with mocked data
			assetMock.disable(['Assets Page 1', 'Assets Page 2', 'Assets Page 3', 'Assets Page 4']);
			cy.server();
			cy.route('**/inventory/v1/assets?*').as('assets');

			cy.getByAutoId('CUIPager-Page2').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('10');
			});
			cy.getByAutoId('CUIPager-NextPage').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('3');
				expect(params.get('rows')).to.eq('10');
			});
			cy.getByAutoId('CUIPager-PrevPage').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('10');
			});

			cy.getByAutoId('CUIPager-Page1').click();
			assetMock.enable(['Assets Page 1', 'Assets Page 2', 'Assets Page 3', 'Assets Page 4']);
		});

		it('Filters asset list with all visual filters', () => { // PBC-228, PBC-253
			const { contractNumber, role } = assets[0];
			cy.getByAutoId('CoveredPoint').click();
			cy.getByAutoId('FilterTag-covered').should('be.visible');
			cy.getByAutoId(`${contractNumber}Point`).click();
			cy.getByAutoId(`FilterTag-${contractNumber}`).should('be.visible');
			cy.getByAutoId(`${Cypress._.capitalize(role.toLowerCase())}Point`)
				.click({ force: true });
			cy.getByAutoId(`FilterTag-${role}`).should('be.visible');
			// TODO: Field notice/security advisory filter (CSCvq32046)
			cy.url().should('contain', 'coverage=covered')
				.and('contain', `contractNumber=${contractNumber}`)
				.and('contain', `role=${role}`);
			cy.getByAutoId(`FilterTag-${contractNumber}`).click().should('not.exist');
			cy.url().should('not.contain', 'contractNumber');
			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.getByAutoId('FilterTag-covered').should('not.exist');
			cy.url().should('not.contain', 'coverage').and('not.contain', 'role');
		});

		it('Hides visual filters when count APIs are unavailable', () => { // PBC-254
			coverageMock.disable('Contract Counts Data');
			coverageMock.enable('Contract Counts Data Unavailable');
			cy.getByAutoId('Facet-Lifecycle').click(); // refresh table
			cy.getByAutoId('Facet-Assets & Coverage').click();

			cy.getByAutoId('AssetsSelectVisualFilter-contractNumber').should('not.be.visible');
			cy.getByAutoId('AssetsSelectVisualFilter-coverage').should('be.visible');

			coverageMock.disable('Contract Counts Data Unavailable');
			coverageMock.enable('Contract Counts Data');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.waitForAppLoading();
		});

		it('Combines visual filters appropriately', () => {
			// TODO: When AP-5378 is implemented, this test can be done with mocked data
			assetMock.disable('Assets Page 1');
			assetMock.disable('Covered Assets');
			cy.server();
			cy.route('**/inventory/v1/assets?*').as('assets');

			cy.getByAutoId('CoveredPoint').click().wait('@assets');
			cy.getByAutoId('UncoveredPoint').click({ force: true }).wait('@assets');
			cy.getByAutoId(`${assets[0].contractNumber}Point`).click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.getAll('coverage')).to.have.length(2)
					.and.include.members(['covered', 'uncovered']);
				expect(params.getAll('contractNumber')).to.have.length(1)
					.and.include.members([assets[0].contractNumber]);
			});

			cy.getByAutoId('FilterBarClearAllFilters').click();
			assetMock.enable('Assets Page 1');
			assetMock.enable('Covered Assets');
			cy.waitForAppLoading();
		});

		it('Visual filters can be collapsed/expanded', () => {
			cy.getByAutoId('CoveredPoint').click();
			cy.getByAutoId('VisualFilterCollapse').click();
			cy.getByAutoId('FilterTag-covered').should('be.visible');
			cy.getByAutoId('AssetsSelectVisualFilter-total').should('not.be.visible');
			cy.getByAutoId('VisualFilterCollapse').click();
			cy.getByAutoId('AssetsSelectVisualFilter-total').should('be.visible');

			cy.getByAutoId('FilterBarClearAllFilters').click();
		});

		it('Provides an actions menu for each asset', () => { // PBC-255
			const coveredAsset = assets[0].serialNumber;
			const uncoveredAsset = assets[1].serialNumber;
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

		it('Unchecks all select boxes after clearing filters', () => { // PBC-273
			cy.getByAutoId('CoveredPoint').click();
			cy.getByAutoId('AllAssetSelectCheckbox').click();
			cy.getByAutoId('AllAssetSelect').should('be.checked');
			cy.get('[data-auto-id*="InventoryItemSelect-"]').eq(0).should('be.checked');
			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.getByAutoId('AllAssetSelect').should('not.be.checked');
			cy.get('[data-auto-id*="InventoryItemSelect-"]').eq(0).should('not.be.checked');
		});

		it('Only shows asset results from the most recent query', () => { // PBC-274
			assetMock.disable(['Assets Page 1', 'Covered Assets']);
			const filteredXHR = new RouteWatch('**/inventory/v1/assets?*coverage=covered');
			cy.route('**/inventory/v1/assets?customerId=2431199&rows=10&page=1').as('unfiltered');

			// Quickly set and clear filters
			cy.getByAutoId('CoveredPoint').click();
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
			cy.getByAutoId('Security AdvisoriesPoint').hover();
			cy.getByAutoId('Security AdvisoriesTooltip')
				.should('contain', advisoryCounts['security-advisories'].toLocaleString());
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
					software += asset.osVersion;
				}
				cy.getByAutoId(`InventoryItem-${serial}`).within(() => {
					cy.getByAutoId(`Device-${serial}`).should('have.text', asset.deviceName);
					// Device image is a static placeholder for now
					cy.getByAutoId(`DeviceImg-${serial}`).should('have.text', 'No Photo Available');
					cy.getByAutoId(`IPAddress-${serial}`).should('have.text', asset.ipAddress);
					// TODO: "Last Scan" is not implemented yet
					cy.getByAutoId(`LastScan-${serial}`).should('have.text', 'Never');
					cy.getByAutoId(`SerialNumber-${serial}`)
						.should('have.text', asset.serialNumber);
					cy.getByAutoId(`Software-${serial}`).should('have.text', software);
					const role = asset.role ? asset.role : 'N/A';
					cy.getByAutoId(`Role-${serial}`).should('have.text', role);
					if (asset.criticalAdvisories) {
						cy.getByAutoId(`AdvisoryCount-${serial}`)
							.should('have.text', asset.criticalAdvisories.toString());
						cy.getByAutoId(`AdvisoryIcon-${serial}`)
							.should('have.attr', 'data-balloon', 'Critical Advisories');
					} else {
						cy.getByAutoId(`AdvisoryCount-${serial}`).should('not.be.visible');
					}
					if (assert.supportCovered) {
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
				.should('have.class', 'selected');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '1 Selected');
			cy.get('div[data-auto-id*="InventoryItem"]').eq(1).click()
				.should('have.class', 'selected');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '2 Selected');
			cy.get('div[data-auto-id*="InventoryItem"]').eq(1).click()
				.should('not.have.class', 'selected');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '1 Selected');
			cy.get('div[data-auto-id*="InventoryItem"]').eq(0).click()
				.should('not.have.class', 'selected');
			cy.getByAutoId('TotalSelectedCount').should('not.be.visible');
		});

		it('Uses proper pagination for asset cards', () => {
			// TODO: When AP-5378 is implemented, this test can be done with mocked data
			assetMock.disable([
				'Assets Page 1 - Grid View',
				'Assets Page 2 - Grid View',
				'Assets Page 3 - Grid View',
				'Assets Page 4 - Grid View',
			]);
			cy.server();
			cy.route('**/inventory/v1/assets?*').as('assets');

			cy.getByAutoId('CUIPager-Page2').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('12');
			});
			cy.getByAutoId('CUIPager-NextPage').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('3');
				expect(params.get('rows')).to.eq('12');
			});
			cy.getByAutoId('CUIPager-PrevPage').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
				expect(params.get('rows')).to.eq('12');
			});

			cy.getByAutoId('CUIPager-Page1').click();
			assetMock.enable([
				'Assets Page 1 - Grid View',
				'Assets Page 2 - Grid View',
				'Assets Page 3 - Grid View',
				'Assets Page 4 - Grid View',
			]);
		});

		it('Gracefully handles lack of response from API', () => {
			assetMock.disable('Assets Page 1 - Grid View');
			assetMock.enable('(Assets) Unreachable API - Grid View');

			cy.getByAutoId('Facet-Lifecycle').click(); // refresh grid
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('grid-view-btn').click();
			cy.getByAutoId('NoResultsFoundTxt').should('have.text', 'No Results Found');

			assetMock.disable('(Assets) Unreachable API - Grid View');
			assetMock.enable('(Assets) Missing data - Grid View');
			const serial = assetCards[0].serialNumber;

			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('grid-view-btn').click();
			cy.getByAutoId(`LastScan-${serial}`).should('have.text', 'Never');
			cy.getByAutoId(`Software-${serial}`).should('have.text', 'N/A');
			cy.getByAutoId(`Role-${serial}`).should('have.text', 'N/A');
			cy.getByAutoId(`AdvisoryCount-${serial}`).should('not.be.visible');
			cy.getByAutoId(`CoveredIcon-${serial}`).should('not.be.visible');

			assetMock.disable('(Assets) Missing data - Grid View');
			assetMock.enable('Assets Page 1 - Grid View');
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('grid-view-btn').click();
			cy.waitForAppLoading();
		});

		it('Provides an actions menu for each card', () => {
			const coveredAsset = assets[0].serialNumber;
			const uncoveredAsset = assets[1].serialNumber;
			cy.getByAutoId(`InventoryItem-${coveredAsset}`).within(() => {
				cy.get('cui-dropdown').within($dropdown => {
					cy.wrap($dropdown).click();
					/* TODO: Disabled for PBC-280
					cy.get('a').should('have.length', 2);
					cy.get('a').eq(0).should('have.text', 'Open Support Case');
					cy.get('a').eq(1).should('have.text', 'Scan');
					*/
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

		it.skip('Remembers the user\'s view preference', () => {
			// TODO: Waiting on PBC-289
		});
	});
});
