import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import {
	ContractDeviceCountsResponse,
	CoverageCountsResponse,
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
	RacetrackScenarios,
	HardwareAssetScenarios,
	SystemAssetScenarios,
	ContractScenarios,
	CoverageScenarios,
	HardwareEOLCountScenarios,
	RoleScenarios,
	VulnerabilityScenarios,
} from '@mock';
import { RacetrackInfoService } from '@services';

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
	let racetrackInfoService: RacetrackInfoService;

	/**
	 * Sends our racetrack info
	 */
	const sendRacetrack = () => {
		racetrackInfoService.sendRacetrack(getActiveBody(RacetrackScenarios[0]));
		racetrackInfoService.sendCurrentSolution(
			getActiveBody(RacetrackScenarios[0]).solutions[0],
		);
		racetrackInfoService.sendCurrentTechnology(
			getActiveBody(RacetrackScenarios[0]).solutions[0].technologies[0],
		);
	};

	const buildSpies = () => {
		const countHeaders = new HttpHeaders().set('X-API-RESULT-COUNT', '4');
		const hardwareAssets = getActiveBody(HardwareAssetScenarios[0]);
		const systemAssets = getActiveBody(SystemAssetScenarios[0]);
		spyOn(inventoryService, 'getHardwareAssets')
			.and
			.returnValue(of(hardwareAssets));
		spyOn(inventoryService, 'getSystemAssets')
			.and
			.returnValue(of(systemAssets));
		spyOn(inventoryService, 'headHardwareAssetsResponse')
			.and
			.returnValue(of(new HttpResponse({
				headers: countHeaders,
				status: 200,
			})));
		spyOn(inventoryService, 'headSystemAssetsResponse')
			.and
			.returnValue(of(new HttpResponse({
				headers: countHeaders,
				status: 200,
			})));
		spyOn(inventoryService, 'getRoleCount')
			.and
			.returnValue(of(RoleScenarios[0].scenarios.GET[0].response.body));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(of(VulnerabilityScenarios[0].scenarios.GET[0].response.body));
		spyOn(contractsService, 'getContractCounts')
			.and
			.returnValue(
				of(
					<ContractDeviceCountsResponse> ContractScenarios[3]
					.scenarios.GET[0].response.body,
				),
			);
		spyOn(contractsService, 'getCoverageCounts')
			.and
			.returnValue(
				of(<CoverageCountsResponse> (CoverageScenarios[2].scenarios.GET[0].response.body)),
			);
		spyOn(productAlertsService, 'getHardwareEolTopCount')
			.and
			.returnValue(of(HardwareEOLCountScenarios[0].scenarios.GET[0].response.body));

		sendRacetrack();
	};

	describe('Without Query Params', () => {
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					AssetsModule,
					HttpClientTestingModule,
					MicroMockModule,
					RouterTestingModule.withRoutes([
						{
							component: AssetsComponent,
							path: 'solution/assets/system',
						},
						{
							component: AssetsComponent,
							path: 'solution/assets/hardware',
						},
					]),
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
								params: { view: 'system' },
							},
						},
					},
				],
			});
		});

		beforeEach(() => {
			window.sessionStorage.clear();
			inventoryService = TestBed.get(InventoryService);
			productAlertsService = TestBed.get(ProductAlertsService);
			contractsService = TestBed.get(ContractsService);
			racetrackInfoService = TestBed.get(RacetrackInfoService);
			fixture = TestBed.createComponent(AssetsComponent);
			component = fixture.componentInstance;
		});

		it('should create', () => {
			expect(component)
				.toBeTruthy();
		});

		it('should set null values on request errors', fakeAsync(() => {
			const error = {
				status: 404,
				statusText: 'Resource not found',
			};
			spyOn(inventoryService, 'getHardwareAssets')
				.and
				.returnValue(throwError(new HttpErrorResponse(error)));
			spyOn(inventoryService, 'getSystemAssets')
				.and
				.returnValue(throwError(new HttpErrorResponse(error)));
			spyOn(inventoryService, 'headHardwareAssetsResponse')
				.and
				.returnValue(throwError(new HttpErrorResponse(error)));
			spyOn(inventoryService, 'headSystemAssetsResponse')
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

			fixture.detectChanges();
			tick(1000);
			fixture.detectChanges();

			const selectedView = component.selectedView;
			expect(_.get(selectedView, 'data', []).length)
				.toBe(0);
			expect(_.find(selectedView.filters, { key: 'role' }).seriesData.length)
				.toBe(0);
			expect(_.find(selectedView.filters, { key: 'advisories' }).seriesData.length)
				.toBe(0);
			expect(_.find(selectedView.filters, { key: 'coverage' }).seriesData.length)
				.toBe(0);

			fixture.destroy();
			tick();
		}));

		it('should switch active filters', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			fixture.detectChanges();

			const coverageFilter = _.find(component.selectedView.filters, { key: 'coverage' });

			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.selectedView.filters, 'selected'))
				.toContain(coverageFilter);

			fixture.destroy();
			tick();
		}));

		it('should set query params for LDOS filter', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			component.selectView(component.getView('hardware'));
			fixture.detectChanges();

			const eoxFilter = _.find(component.selectedView.filters, { key: 'eox' });

			component.onSubfilterSelect('gt-0-lt-12-months', eoxFilter);
			tick(1000);

			fixture.detectChanges();

			expect(_.get(component.selectedView, ['params', 'lastDateOfSupportRange'])[0])
				.toEqual('gt-0-lt-12-months');

			component.onSubfilterSelect('gt-12-lt-24-months', eoxFilter);
			tick(1000);

			fixture.detectChanges();

			expect(_.get(component.selectedView, ['params', 'lastDateOfSupportRange'])[0])
				.toEqual('gt-12-lt-24-months');

			component.onSubfilterSelect('gt-24-lt-36-months', eoxFilter);
			tick(1000);

			fixture.detectChanges();
			expect(_.get(component.selectedView, ['params', 'lastDateOfSupportRange'])[0])
				.toEqual('gt-24-lt-36-months');

			component.onSubfilterSelect('gt-36-months', eoxFilter);
			tick(1000);

			fixture.detectChanges();
			expect(_.get(component.selectedView, ['params', 'lastDateOfSupportRange'])[0])
				.toEqual('gt-36-months');

			fixture.destroy();
			tick();
		}));

		it('should set query params for Advisories filter', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			fixture.detectChanges();
			const selectedView = component.selectedView;
			const advisoriesFilter = _.find(selectedView.filters, { key: 'advisories' });

			component.onSubfilterSelect('hasBugs', advisoriesFilter);
			tick();
			expect(_.get(selectedView, ['params', 'hasBugs']))
				.toBeTruthy();
			expect(_.get(selectedView, ['params', 'hasFieldNotices']))
				.toBeFalsy();
			expect(_.get(selectedView, ['params', 'hasSecurityAdvisories']))
				.toBeFalsy();

			component.onSubfilterSelect('hasFieldNotices', advisoriesFilter);
			tick();
			expect(_.get(selectedView, ['params', 'hasBugs']))
				.toBeFalsy();
			expect(_.get(selectedView, ['params', 'hasFieldNotices']))
				.toBeTruthy();
			expect(_.get(selectedView, ['params', 'hasSecurityAdvisories']))
				.toBeFalsy();

			component.onSubfilterSelect('hasSecurityAdvisories', advisoriesFilter);
			tick();
			expect(_.get(selectedView, ['params', 'hasBugs']))
				.toBeFalsy();
			expect(_.get(selectedView, ['params', 'hasFieldNotices']))
				.toBeFalsy();
			expect(_.get(selectedView, ['params', 'hasSecurityAdvisories']))
				.toBeTruthy();

			fixture.destroy();
			tick();
		}));

		it('should select a coverage subfilter', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			fixture.detectChanges();
			const coverageFilter = _.find(component.selectedView.filters, { key: 'coverage' });
			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.selectedView.filters, 'selected'))
				.toContain(coverageFilter);

			const subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeTruthy();

			fixture.destroy();
			tick();
		}));

		it('should clear the filter when selecting the same subfilter twice', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			const coverageFilter = _.find(component.selectedView.filters, { key: 'coverage' });
			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.selectedView.filters, 'selected'))
				.toContain(coverageFilter);

			let subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeTruthy();

			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeFalsy();

			fixture.destroy();
			tick();
		}));

		it('should select view', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			expect(component.viewType)
				.toBe('list');

			component.selectViewType('grid');

			fixture.detectChanges();

			expect(component.viewType)
				.toBe('grid');

			fixture.destroy(); // Remove leftover "fromNow" timers
			tick();
		}));

		it('should detect selection changes', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			component.onSelectionChanged([]);

			fixture.detectChanges();

			expect(component.selectedAssets.length)
				.toBe(0);

			fixture.destroy();
			tick();
		}));

		it('should clear selected filters', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			component.clearSelectedFilters();
			tick(1000);

			expect(_.some(component.selectedView.filters, 'selected'))
				.toBeFalsy();

			fixture.destroy();
			tick();
		}));

		it('should clear filters', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			const coverageFilter = _.find(component.selectedView.filters, { key: 'coverage' });
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
			tick(1000);

			_.each(component.selectedView.filters, filter => {
				expect(filter.selected)
					.toBeFalsy();
				expect(_.some(filter.seriesData, 'selected'))
					.toBeFalsy();
			});

			fixture.destroy();
			tick();
		}));

		it('should close panel', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			component.onPanelClose();

			expect(component.selectedAsset)
				.toBeFalsy();

			fixture.destroy();
			tick();
		}));

		it('should search', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			expect(component.selectedView.params.search)
				.toBeFalsy();
			component.selectedView.searchForm.controls.search.setValue('query');
			component.doSearch(component.selectedView);
			tick(1000);
			fixture.detectChanges();

			expect(component.selectedView.params.search)
				.toBeTruthy();

			fixture.destroy();
			tick();
		}));

		it('should not search', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			expect(component.selectedView.params.search)
				.toBeFalsy();
			component.selectedView.searchForm.controls.search.setValue('');
			component.doSearch(component.selectedView);
			tick(1000);
			fixture.detectChanges();

			expect(component.selectedView.params.search)
				.toBeFalsy();

			fixture.destroy();
			tick();
		}));

		it('should unset search param if search input is empty for refresh', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			_.set(component.selectedView, ['params', 'search'], 'search');
			component.selectedView.filtered = true;
			component.selectedView.searchForm.controls.search.setValue('');

			component.doSearch(component.selectedView);
			tick(1000);
			fixture.detectChanges();

			expect(_.get(component.selectedView.params, 'search'))
				.toBeFalsy();

			fixture.destroy();
			tick();
		}));

		it('should handle unsortable column', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			component.selectedView.filtered = false;
			expect(component.selectedView.table)
				.toBeTruthy();
			const deviceNameCol =
				_.find(component.selectedView.table.columns, { key: 'deviceName' });
			deviceNameCol.sortable = false;
			deviceNameCol.sorting = false;
			deviceNameCol.sortDirection = 'asc';
			const ipAddressCol = _.find(
				component.selectedView.table.columns, { key: 'ipAddress' },
			);
			ipAddressCol.sorting = true;
			ipAddressCol.sortDirection = 'desc';

			component.onColumnSort(deviceNameCol);
			tick(1000);
			expect(component.selectedView.filtered)
				.toBeFalsy();
			expect(deviceNameCol.sorting)
				.toBeFalsy();
			expect(deviceNameCol.sortDirection)
				.toBe('asc');
			expect(ipAddressCol.sorting)
				.toBeTruthy();
			expect(ipAddressCol.sortDirection)
				.toBe('desc');
			expect(_.get(component, ['params', 'sort']))
				.toBeFalsy();

			fixture.destroy();
			tick();
		}));

		it('should not refresh when valid search query', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			_.set(component.selectedView, ['params', 'search'], 'search');
			component.selectedView.searchForm.setValue({ search: 'search' });

			expect(_.get(component.selectedView.params, 'search'))
				.toBe('search');

			fixture.destroy();
			tick();
		}));

		it('should handle sortable column', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			component.selectedView.filtered = false;
			const deviceNameCol =
				_.find(component.selectedView.table.columns, { key: 'deviceName' });
			deviceNameCol.sorting = true;
			const ipAddressCol = _.find(
				component.selectedView.table.columns, { key: 'ipAddress' },
			);
			ipAddressCol.sorting = false;
			ipAddressCol.sortDirection = 'desc';

			component.onColumnSort(ipAddressCol);
			tick(1000);

			expect(deviceNameCol.sorting)
				.toBeFalsy();
			expect(deviceNameCol.sortDirection)
				.toBe('desc');
			expect(ipAddressCol.sorting)
				.toBeTruthy();
			expect(ipAddressCol.sortDirection)
				.toBe('asc');
			expect(_.get(component.selectedView, ['params', 'sort']))
				.toEqual(['ipAddress:ASC']);

			fixture.destroy();
			tick();
		}));

		it('should create our pagination after results load', fakeAsync(() => {
			buildSpies();

			const assets = getActiveBody(SystemAssetScenarios[0]);

			fixture.detectChanges();
			tick(1000);
			fixture.detectChanges();
			const pagination = assets.Pagination;
			const first = (pagination.rows * (pagination.page - 1)) + 1;
			const last = (pagination.rows * pagination.page);

			expect(component.selectedView.paginationCount)
				.toEqual(`${first}-${last}`);

			fixture.destroy();
			tick();
		}));

		it('should set the appropriate device icon based on type', fakeAsync(() => {
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
			buildSpies();
			fixture.detectChanges();
			tick(1000);
			expect(component.getProductIcon(WLC))
				.toEqual('wlc-outline');

			expect(component.getProductIcon(AP))
				.toEqual('accesspoint-outline');

			expect(component.getProductIcon(Switch))
				.toEqual('switch-outline');

			expect(component.getProductIcon(Router))
				.toEqual('router-outline');

			fixture.destroy();
			tick();
		}));
	});

	describe('With Query Params', () => {
		const queryParams = {
			contractNumber: '1234',
			coverage: 'covered',
			hasBugs: true,
			lastDateOfSupportRange: 'gt-12-lt-24-months',
			role: 'ACCESS',
		};

		configureTestSuite(() => {
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
			});
		});

		beforeEach(() => {
			window.sessionStorage.clear();
			inventoryService = TestBed.get(InventoryService);
			productAlertsService = TestBed.get(ProductAlertsService);
			contractsService = TestBed.get(ContractsService);
			racetrackInfoService = TestBed.get(RacetrackInfoService);
			fixture = TestBed.createComponent(AssetsComponent);
			component = fixture.componentInstance;
		});

		it('should set query params on page load', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			expect(_.get(component.selectedView.params, 'coverage'))
				.toEqual(['covered']);
			expect(_.get(component.selectedView.params, 'role'))
				.toEqual(['ACCESS']);
			expect(_.get(component.selectedView.params, 'hasBugs'))
				.toBe(true);

			fixture.destroy();
			tick();
		}));

		it('should set the coverage filter if param selected', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			_.set(component.selectedView.params, 'coverage', ['covered']);
			tick(1000);
			const coverageFilter = _.find(component.selectedView.filters, { key: 'coverage' });

			expect(_.filter(component.selectedView.filters, 'selected'))
				.toContain(coverageFilter);

			fixture.destroy();
			tick();
		}));

		it('should set the role filter if param selected', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			_.set(component.selectedView.params, 'role', ['ACCESS']);
			tick(1000);
			const roleFilter = _.find(component.selectedView.filters, { key: 'role' });

			expect(_.filter(component.selectedView.filters, 'selected'))
				.toContain(roleFilter);

			fixture.destroy();
			tick();
		}));
	});
});
