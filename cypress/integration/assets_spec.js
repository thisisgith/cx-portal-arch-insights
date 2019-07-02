import { Util } from '@apollo/cypress-util';
import MockService from '../support/mockService';

const util = new Util();
const assetMock = new MockService('AssetScenarios');
const coverageMock = new MockService('CoverageScenarios');
const networkScenario = assetMock.getScenario('GET', 'Assets Page 1');
const assets = networkScenario.response.body.data;
const totalCountScenario = coverageMock.getScenario('GET', 'Coverage');
const coverageElements = totalCountScenario.response.body;

describe('Assets', () => { // PBC-41
	before(() => {
		cy.login();
		cy.loadApp('/solution/assets');
		cy.waitForAppLoading();
	});

	// Skipping until asset360 is re-enabled
	it.skip('Provides an Asset 360 view modal', () => { // PBC-151
		const { halfWidthInPx, widthInPx } = util.getViewportSize();
		cy.get('tr').eq(1).click();
		cy.get('asset-details')
			.should('be.visible')
			.and('have.css', 'width', halfWidthInPx); // default to half width
		cy.getByAutoId('Asset360SerialNumber').should('have.text', `Serial Number${assets[0].serialNumber}`);
		cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
		cy.get('asset-details').should('have.css', 'width', widthInPx); // expand to full width
		cy.getByAutoId('ClearAsset').click();
		cy.get('tr').eq(2).click();
		cy.get('asset-details').should('have.css', 'width', widthInPx); // remember last width
		cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
		cy.get('asset-details').should('have.css', 'width', halfWidthInPx); // shrink to half width
		cy.get('tr').eq(3).click(); // switch to new asset without closing modal
		cy.getByAutoId('Asset360SerialNumber').should('have.text', `Serial Number${assets[2].serialNumber}`);
		cy.getByAutoId('ClearAsset').click();
	});

	// Skipping until asset360 is re-enabled
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

	context('PBC-36: Asset List', () => {
		it('Displays assets correctly in list view', () => {
			cy.get('tbody > tr').should('have.length', assets.length);
			Cypress._.each(assets, asset => {
				const serial = asset.serialNumber;
				cy.getByAutoId(`InventoryItem-${serial}`).within(() => {
					// TODO: Asset device icon exists after PBC-257
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
					cy.getByAutoId(`Serial Number-${serial}`).should('have.text', asset.serialNumber);
					cy.getByAutoId(`Software Type-${serial}`).should('have.text', asset.osType);
					cy.getByAutoId(`Software Version-${serial}`).should('have.text', asset.osVersion);
					if (asset.role) {
						cy.getByAutoId(`Role-${serial}`).should('have.text', asset.role);
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
			});
			cy.getByAutoId('CUIPager-NextPage').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('3');
			});
			cy.getByAutoId('CUIPager-PrevPage').click();
			cy.wait('@assets').then(xhr => {
				const params = new URLSearchParams(new URL(xhr.url).search);
				expect(params.get('page')).to.eq('2');
			});

			cy.getByAutoId('CUIPager-Page1').click();
			assetMock.enable(['Assets Page 1', 'Assets Page 2', 'Assets Page 3', 'Assets Page 4']);
		});

		it('Filters asset list with all visual filters', () => {
			const { contractNumber, role } = assets[0];
			cy.getByAutoId('CoveredPoint').click();
			cy.getByAutoId('FilterTag-covered').should('be.visible');
			cy.getByAutoId(`${contractNumber}Point`).click();
			cy.getByAutoId(`FilterTag-${contractNumber}`).should('be.visible');
			// cy.getByAutoId(`${Cypress._.capitalize(role)}Point`).click({ force: true });
			cy.getByAutoId(`${Cypress._.capitalize(role.toLowerCase())}Point`)
				.click({ force: true });
			cy.getByAutoId(`FilterTag-${role}`).should('be.visible');
			// TODO: Field notice/security advisory filter (CSCvq32046)
			cy.getByAutoId(`FilterTag-${contractNumber}`).click().should('not.exist');
			cy.getByAutoId('FilterBarClearAllFilters').click();
			cy.getByAutoId('FilterTag-covered').should('not.exist');
		});

		it.skip('Renders visual filters gracefully when APIs are unavailable', () => {
			// TODO: PBC-254
		});

		it('Combines visual filters appropriately', () => {
			// TODO: When AP-5378 is implemented, this test can be done with mocked data
			assetMock.disable('Assets Page 1');
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
		});

		it('Visual filters can be collapsed/expanded', () => {
			cy.getByAutoId('CoveredPoint').click();
			cy.getByAutoId('VisualFilterCollapse').click();
			cy.getByAutoId('FilterTag-covered').should('be.visible');
			cy.getByAutoId('AssetsSelectVisualFilter-total').should('not.be.visible');
			cy.getByAutoId('VisualFilterCollapse').click();
			cy.getByAutoId('AssetsSelectVisualFilter-total').should('be.visible');
		});
	});
});
