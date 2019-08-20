import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import {
	InventoryService,
	ProductAlertsService,
	ContractsService,
	NetworkElement,
} from '@sdp-api';
import { throwError, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
	user,
	Mock,
	AssetScenarios,
} from '@mock';

/**
 * Will fetch the currently active response body from the mock object
 * @param mock the mock object
 * @param type the scenario type
 * @returns the body response
 */
function getActiveBody (mock: Mock, type: string = 'GET') {
	const active = _.find(mock.scenarios[type], 'selected') || _.head(mock.scenarios[type]);

	return active.response.body;
}

describe('AssetsComponent', () => {
	let component: AssetsComponent;
	let fixture: ComponentFixture<AssetsComponent>;

	let inventoryService: InventoryService;
	let productAlertsService: ProductAlertsService;
	let contractsService: ContractsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		})
		.compileComponents();

		inventoryService = TestBed.get(InventoryService);
		productAlertsService = TestBed.get(ProductAlertsService);
		contractsService = TestBed.get(ContractsService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(AssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getNetworkElements')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getRoleCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(contractsService, 'getContractCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(contractsService, 'getCoverageCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getHardwareEolTopCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.inventory.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'role' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'advisories' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'contractNumber' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'coverage' }).seriesData.length)
				.toBe(0);

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should switch active filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const totalFilter = _.find(component.filters, { key: 'total' });
			const coverageFilter = _.find(component.filters, { key: 'coverage' });

			expect(_.find(component.filters, 'selected'))
				.toEqual(totalFilter);

			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set query params for Hardware EOX filter', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			spyOn(Date.prototype, 'getUTCFullYear').and
				.callFake(() => 2013);
			spyOn(Date.prototype, 'getUTCMonth').and
				.callFake(() => 9);
			spyOn(Date.prototype, 'getUTCDay').and
				.callFake(() => 23);
			const currentTime = new Date(2013, 9, 23).getTime();
			const eoxFilter = _.find(component.filters, { key: 'eox' });
			const dayInMillis = 24 * 60 * 60 * 1000;

			component.onSubfilterSelect('gt-0-lt-30-days', eoxFilter);

			fixture.detectChanges();
			const lastDateOfSupport30 = _.map(
				_.get(component, ['assetParams', 'lastDateOfSupportRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastDateOfSupport30.length)
				.toBe(2);
			expect(currentTime - lastDateOfSupport30[0])
				.toBe(dayInMillis * 30);
			expect(currentTime - lastDateOfSupport30[1])
				.toBe(0);

			component.onSubfilterSelect('gt-30-lt-60-days', eoxFilter);

			fixture.detectChanges();
			const lastDateOfSupport3060 = _.map(
				_.get(component, ['assetParams', 'lastDateOfSupportRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastDateOfSupport3060.length)
				.toBe(2);
			expect(currentTime - lastDateOfSupport3060[0])
				.toBe(dayInMillis * 60);
			expect(currentTime - lastDateOfSupport3060[1])
				.toBe(dayInMillis * 30);

			component.onSubfilterSelect('gt-60-lt-90-days', eoxFilter);

			fixture.detectChanges();
			const lastDateOfSupport6090 = _.map(
				_.get(component, ['assetParams', 'lastDateOfSupportRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastDateOfSupport6090.length)
				.toBe(2);
			expect(currentTime - lastDateOfSupport6090[0])
				.toBe(dayInMillis * 90);
			expect(currentTime - lastDateOfSupport6090[1])
				.toBe(dayInMillis * 60);

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set query params for Advisories filter', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const advisoriesFilter = _.find(component.filters, { key: 'advisories' });

			component.onSubfilterSelect('bugs', advisoriesFilter);
			expect(_.get(component, ['assetParams', 'hasBugs']))
				.toBeTruthy();
			expect(_.get(component, ['assetParams', 'hasFieldNotices']))
				.toBeFalsy();
			expect(_.get(component, ['assetParams', 'hasSecurityAdvisories']))
				.toBeFalsy();

			component.onSubfilterSelect('field-notices', advisoriesFilter);
			expect(_.get(component, ['assetParams', 'hasBugs']))
				.toBeFalsy();
			expect(_.get(component, ['assetParams', 'hasFieldNotices']))
				.toBeTruthy();
			expect(_.get(component, ['assetParams', 'hasSecurityAdvisories']))
				.toBeFalsy();

			component.onSubfilterSelect('security-advisories', advisoriesFilter);
			expect(_.get(component, ['assetParams', 'hasBugs']))
				.toBeFalsy();
			expect(_.get(component, ['assetParams', 'hasFieldNotices']))
				.toBeFalsy();
			expect(_.get(component, ['assetParams', 'hasSecurityAdvisories']))
				.toBeTruthy();
			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select a coverage subfilter', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const coverageFilter = _.find(component.filters, { key: 'coverage' });
			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			const subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeTruthy();

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should clear the filter when selecting the same subfilter twice', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const coverageFilter = _.find(component.filters, { key: 'coverage' });
			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			let subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeTruthy();

			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeFalsy();

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select view', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.view)
				.toBe('list');

			component.selectView('grid');

			fixture.detectChanges();

			expect(component.view)
				.toBe('grid');

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should detect selection changes', done => {
		fixture.whenStable()
		.then(() => {
			component.onSelectionChanged([]);

			fixture.detectChanges();

			expect(component.selectedAssets.length)
				.toBe(0);

			done();
		});
	});

	it('should clear selected filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			component.clearSelectedFilters();

			expect(_.some(component.filters, 'selected'))
				.toBeFalsy();

			done();
		});
	});

	it('should clear filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const totalFilter = _.find(component.filters, { key: 'total' });
			totalFilter.selected = false;
			const coverageFilter = _.find(component.filters, { key: 'coverage' });
			coverageFilter.selected = true;
			coverageFilter.seriesData = [
				{
					filter: 'covered',
					label: 'Covered',
					selected: false,
					value: 1,
				},
			];
			component.clearFilters();

			_.each(_.omitBy(component.filters, { key: 'total' }), filter => {
				expect(filter.selected)
					.toBeFalsy();
				expect(_.some(filter.seriesData, 'selected'))
					.toBeFalsy();
			});

			expect(totalFilter.selected)
				.toBeTruthy();
			done();
		});
	});

	it('should close panel', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			component.onPanelClose();

			expect(component.selectedAsset)
				.toBeFalsy();

			done();
		});
	});

	it('should search', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.assetParams.search)
				.toBeFalsy();
			component.searchForm.controls.search.setValue('query');
			component.doSearch();
			fixture.detectChanges();

			expect(component.assetParams.search)
				.toBeTruthy();

			done();
		});
	});

	it('should not search', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.assetParams.search)
				.toBeFalsy();
			component.searchForm.controls.search.setValue('');
			component.doSearch();
			fixture.detectChanges();

			expect(component.assetParams.search)
				.toBeFalsy();

			done();
		});
	});

	it('should unset search param if search input is empty for refresh', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			_.set(component, ['assetParams', 'search'], 'search');
			component.filtered = true;
			component.searchForm.controls.search.setValue('');

			component.doSearch();
			fixture.detectChanges();

			expect(_.get(component.assetParams, 'search'))
				.toBeFalsy();
			done();
		});
	});

	it('should handle unsortable column', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			component.filtered = false;
			expect(component.assetsTable)
				.toBeTruthy();
			const deviceNameCol = _.find(component.assetsTable.columns, { key: 'deviceName' });
			deviceNameCol.sortable = false;
			deviceNameCol.sorting = false;
			deviceNameCol.sortDirection = 'asc';
			const serialNumberCol = _.find(component.assetsTable.columns, { key: 'serialNumber' });
			serialNumberCol.sorting = true;
			serialNumberCol.sortDirection = 'desc';

			fixture.detectChanges();

			component.onColumnSort(deviceNameCol);
			expect(component.filtered)
				.toBeFalsy();
			expect(deviceNameCol.sorting)
				.toBeFalsy();
			expect(deviceNameCol.sortDirection)
				.toBe('asc');
			expect(serialNumberCol.sorting)
				.toBeTruthy();
			expect(serialNumberCol.sortDirection)
				.toBe('desc');
			expect(_.get(component, ['params', 'sort']))
				.toBeFalsy();
			done();
		});
	});

	it('should not refresh when valid search query', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			_.set(component, ['assetParams', 'search'], 'search');
			component.searchForm.setValue({ search: 'search' });

			fixture.detectChanges();

			expect(_.get(component.assetParams, 'search'))
				.toBe('search');
			done();
		});
	});

	it('should handle sortable column', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			component.filtered = false;
			const deviceNameCol = _.find(component.assetsTable.columns, { key: 'deviceName' });
			deviceNameCol.sorting = true;
			const serialNumberCol = _.find(component.assetsTable.columns, { key: 'serialNumber' });
			serialNumberCol.sorting = false;
			serialNumberCol.sortDirection = 'desc';

			fixture.detectChanges();

			component.onColumnSort(serialNumberCol);

			expect(component.filtered)
				.toBeTruthy();
			expect(deviceNameCol.sorting)
				.toBeFalsy();
			expect(deviceNameCol.sortDirection)
				.toBe('asc');
			expect(serialNumberCol.sorting)
				.toBeTruthy();
			expect(serialNumberCol.sortDirection)
				.toBe('asc');
			expect(_.get(component, ['assetParams', 'sort']))
				.toEqual(['serialNumber:ASC']);
			done();
		});
	});

	it('should set a loading boolean for Cypress runs', () => {
		expect(window.loading)
			.toBeUndefined();
		window.Cypress = true;

		component.ngOnInit();

		fixture.detectChanges();
		expect(window.loading)
			.toBe(true);

		// cleanup
		window.Cypress = undefined;
		window.loading = undefined;
	});

	it('should set query params on page load', done => {
		const queryParams = {
			contractNumber: '1234',
			coverage: 'covered',
			hasBugs: true,
			hasFieldNotices: true,
			hasSecurityAdvisories: true,
			lastDateOfSupportRange: '1565624197000,1597246597000',
			role: 'access',
		};
		TestBed.resetTestingModule();
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of(queryParams),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		})
		.compileComponents();
		fixture = TestBed.createComponent(AssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(_.get(component.assetParams, 'contractNumber'))
				.toEqual(['1234']);
			expect(_.get(component.assetParams, 'coverage'))
				.toEqual(['covered']);
			expect(_.get(component.assetParams, 'role'))
				.toEqual(['access']);
			expect(_.get(component.assetParams, 'hasBugs'))
				.toBe(true);
			expect(_.get(component.assetParams, 'hasFieldNotices'))
				.toBe(true);
			expect(_.get(component.assetParams, 'hasSecurityAdvisories'))
				.toBe(true);
			expect(_.get(component.assetParams, 'lastDateOfSupportRange'))
				.toEqual(['1565624197000,1597246597000']);
			done();
		});
	});

	it('should create our pagination after results load', done => {
		const assets = getActiveBody(AssetScenarios[5]);

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};

		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(of(assets));

		spyOn(inventoryService, 'getNetworkElements')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		fixture.whenStable()
		.then(() => {
			const pagination = assets.Pagination;
			const first = (pagination.rows * (pagination.page - 1)) + 1;
			const last = (pagination.rows * pagination.page);

			expect(component.paginationCount)
				.toEqual(`${first}-${last}`);
			done();
		});
	});

	it('should set the coverage filter if param selected', done => {
		_.set(component.assetParams, 'coverage', ['covered']);

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const coverageFilter = _.find(component.filters, { key: 'coverage' });

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			done();
		});
	});

	it('should set the role filter if param selected', done => {
		_.set(component.assetParams, 'role', ['ACCESS']);

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const roleFilter = _.find(component.filters, { key: 'role' });

			expect(_.filter(component.filters, 'selected'))
				.toContain(roleFilter);

			done();
		});
	});

	it('should set the contract filter if param selected', done => {
		_.set(component.assetParams, 'contractNumber', ['UNKNOWN']);

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const contractFilter = _.find(component.filters, { key: 'contractNumber' });

			expect(_.filter(component.filters, 'selected'))
				.toContain(contractFilter);

			done();
		});
	});

	it('should set the appropriate device icon based on type', done => {
		const WLC: NetworkElement = {
			customerId: user.info.customerId,
			isManagedNE: true,
			managementAddress: 'address',
			neInstanceId: 'id',
			productFamily: 'Wireless Controller',
			productType: 'Wireless',
		};
		const AP = {
			customerId: user.info.customerId,
			isManagedNE: true,
			managementAddress: 'address',
			neInstanceId: 'id',
			productFamily: 'Access Point Controller',
			productType: 'Wireless',
		};
		const Switch = {
			customerId: user.info.customerId,
			isManagedNE: true,
			managementAddress: 'address',
			neInstanceId: 'id',
			productFamily: 'Some Switch Family',
			productType: 'Switches',
		};
		const Router = {
			customerId: user.info.customerId,
			isManagedNE: true,
			managementAddress: 'address',
			neInstanceId: 'id',
			productFamily: 'Some Router Family',
			productType: 'Routers',
		};
		fixture.whenStable()
		.then(() => {
			expect(component.getProductIcon(WLC))
				.toEqual('wlc-outline');

			expect(component.getProductIcon(AP))
				.toEqual('accesspoint-outline');

			expect(component.getProductIcon(Switch))
				.toEqual('switch-outline');

			expect(component.getProductIcon(Router))
				.toEqual('router-outline');

			done();
		});
	});
});
