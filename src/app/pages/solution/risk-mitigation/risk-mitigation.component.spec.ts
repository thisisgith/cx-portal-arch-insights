import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMitigationComponent } from './risk-mitigation.component';
import { RiskMitigationModule } from './risk-mitigation.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { of, throwError } from 'rxjs';
import { user, RiskScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { RiskMitigationService, HighCrashRiskDeviceCount } from '@sdp-api';
import * as _ from 'lodash-es';

fdescribe('RiskMitigationComponent', () => {
	let component: RiskMitigationComponent;
	let fixture: ComponentFixture<RiskMitigationComponent>;
	let riskMitigationService: RiskMitigationService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				RiskMitigationModule,
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
		});
	});

	beforeEach(async(() => {
		riskMitigationService = TestBed.get(RiskMitigationService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(RiskMitigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RiskMitigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('customerId should be present', () => {
		expect(component.customerId)
			.toBeDefined();
		expect(component.filters)
			.toBeDefined();
		const advisoryFilter = _.find(component.filters, { key: 'timeRange' });
		expect(advisoryFilter)
			.toBeDefined();
	});

	it('should fetch all data', () => {
		spyOn(riskMitigationService, 'getAllCrashesData')
			.and
			.returnValue(of(RiskScenarios[0].scenarios.GET[0].response.body));
		spyOn(riskMitigationService, 'getHighCrashRiskDeviceCountData')
			.and
			.returnValue(of(<HighCrashRiskDeviceCount>
				RiskScenarios[1].scenarios.GET[0].response.body));
		spyOn(riskMitigationService, 'getFingerPrintDeviceDetailsData')
			.and
			.returnValue(of(<any> { devices: [], count: 100 }));
		component.ngOnInit();
		fixture.detectChanges();
		const advisoryFilter = _.find(component.filters, { key: 'timeRange' });
		expect(advisoryFilter.seriesData)
			.toBeDefined();
		expect(component.highCrashDeviceCount)
			.toBeDefined();

	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set undefined last 90 days data when error in response', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(riskMitigationService, 'getAllCrashesData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(riskMitigationService, 'getDeviceDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(riskMitigationService, 'getHighCrashRiskDeviceCountData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(riskMitigationService, 'getSearchedData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(riskMitigationService, 'getCrashHistoryForDevice')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(riskMitigationService, 'getFingerPrintDeviceDetailsData')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.selectedCrashedSystemsFilter)
					.toBe('90');
				done();
			});
	});

	it('Should get the last few days crash data', done => {
		spyOn(riskMitigationService, 'getAllCrashesData')
			.and
			.returnValue(of(RiskScenarios[0].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.selectedCrashedSystemsFilter)
					.toBe('90');
				done();
			});
	});

	it('Should get all the high risks devices count', done => {
		spyOn(riskMitigationService, 'getHighCrashRiskDeviceCountData')
			.and
			.returnValue(of(<HighCrashRiskDeviceCount>
				RiskScenarios[1].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.highCrashDeviceCount)
					.toBeDefined();
				done();
			});
	});

	// it('Should get the device details', done => {
	// 	spyOn(riskMitigationService, 'getDeviceDetails')
	// 		.and
	// 		.returnValue(of(RiskScenarios[2].scenarios.GET[0].response.body));
	// 	component.ngOnInit();
	// 	fixture.whenStable()
	// 		.then(() => {
	// 			fixture.detectChanges();
	// 			expect(component.crashedAssetsGridDetails.tableData)
	// 				.toBeDefined();
	// 			done();
	// 		});
	// });

	// it('Should get history of crashed device', done => {
	// 	spyOn(riskMitigationService, 'getCrashHistoryForDevice')
	// 		.and
	// 		.returnValue(of(RiskScenarios[3].scenarios.GET[0].response.body));
	// 	component.ngOnInit();
	// 	fixture.whenStable()
	// 		.then(() => {
	// 			fixture.detectChanges();
	// 			expect(component.crashedAssetsGridDetails.tableData)
	// 				.toBeDefined();
	// 			done();
	// 		});
	// });

	// it('Should return the searched response', done => {
	// 	spyOn(riskMitigationService, 'getSearchedData')
	// 		.and
	// 		.returnValue(of(RiskScenarios[2].scenarios.GET[0].response.body));
	// 	component.ngOnInit();
	// 	fixture.whenStable()
	// 		.then(() => {
	// 			fixture.detectChanges();
	// 			expect(component.crashedAssetsGridDetails.tableData)
	// 				.toBeDefined();
	// 			done();
	// 		});
	// });

	it('should test data supplied to render chart', () => {
		const seriesData = {
			customerId: '2431199',
			devicesCrashCount_1d: '0',
			devicesCrashCount_30d: '2',
			devicesCrashCount_7d: '0',
			devicesCrashCount_90d: '9',
		};
		const result = [
			{
				filter: 'Time: Last 24h',
				label: '24h',
				selected: false,
				value: 0,
			},
			{
				filter: 'Time: Last 7d',
				label: '7d',
				selected: false,
				value: 0,
			},
			{
				filter: 'Time: Last 30d',
				label: '30d',
				selected: false,
				value: 2,
			},
			{
				filter: 'Time: Last 90d',
				label: '90d',
				selected: false,
				value: 9,
			},
		];
		expect(component.marshallResultsObjectForGraph(seriesData))
			.toEqual(result);
	});

	// it('show Finger print details toggle', () => {
	// 	expect(component.showFpDetails)
	// 		.toBeFalsy();
	// 	component.onFPDPanelClose();
	// 	expect(component.showFpDetails)
	// 		.toBeFalsy();
	// });

	it('show only crashes toggle', () => {
		expect(component.onlyCrashes)
			.toBeTruthy();
		component.getAllCrashesData();
		expect(component.onlyCrashes)
			.toBeFalsy();
	});

	// it('update pager on page update', () => {
	// 	const pageinfo = {
	// 		page: 1,
	// 	};
	// 	component.onPagerUpdated(pageinfo);
	// 	expect(component.crashedAssetsGridDetails.tableOffset)
	// 		.toBe(1);
	// });

	// it('check on high crash grid loaded', () => {
	// 	component.ngOnInit();
	// 	const param = {
	// 		customerId: 324123,
	// 		limit: 10,
	// 		page: 2,
	// 		search: '',
	// 		size: 10,
	// 		sort: 'abc.desc',
	// 	};
	// 	component.onHcrPagerUpdated(param);
	// 	expect(component.highCrashRiskAssetsGridDetails.tableOffset)
	// 		.toBe(2);
	// 	expect(component.highCrashRiskAssetsGridDetails.tableLimit)
	// 		.toBe(10);
	// });

	// it('should return selected key of filter', () => {
	// 	component.ngOnInit();
	// 	const key = 'advisories';
	// 	let filter = component.getSelectedSubFilters(key);
	// 	expect(filter)
	// 	.toBeDefined();
	// 	fixture.detectChanges();
	// 	filter = component.getSelectedSubFilters('');
	// 	expect(filter)
	// 	.toBeUndefined();
	// });

	// it('should test high crash data params', () => {
	// 	component.loadData();
	// 	expect(component.highCrashRiskParams)
	// 		.toBeDefined();
	// });

	// it('should show asset details', () => {
	// 	expect(component.showAsset360)
	// 		.toBeFalsy();
	// 	component.redirectToAsset360();
	// 	expect(component.showAsset360)
	// 		.toBe(true);
	// });

	// it('on crashed table sorting change', () => {
	// 	component.filters[0].seriesData = [
	// 		{
	// 			filter: 'Time: Last 24h',
	// 			label: '24h',
	// 			selected: true,
	// 			value: 0,
	// 		},
	// 		{
	// 			filter: 'Time: Last 7d',
	// 			label: '7d',
	// 			selected: false,
	// 			value: 0,
	// 		},
	// 		{
	// 			filter: 'Time: Last 30d',
	// 			label: '30d',
	// 			selected: false,
	// 			value: 2,
	// 		},
	// 		{
	// 			filter: 'Time: Last 90d',
	// 			label: '90d',
	// 			selected: false,
	// 			value: 9,
	// 		},
	// 	];
	// 	component.customerId = 12345;
	// 	spyOn(riskMitigationService, 'getSearchedData')
	// 		.and
	// 		.returnValue(of(<any> { }));
	// 	fixture.detectChanges();
	// 	component.onTableSortingChanged({
	// 		key: 'Key1',
	// 		sortable: true,
	// 		sortDirection: 'asc',
	// 		value: 'Value1',
	// 	});
	// 	expect(riskMitigationService.getSearchedData)
	// 		.toHaveBeenCalled();
	// 	expect(riskMitigationService.getSearchedData)
	// 		.toHaveBeenCalled();
	// });

	// it('should unset the selectedAsset', () => {
	// 	component.onPanelClose();
	// 	expect(component.selectedAsset.active)
	// 		.toBeFalsy();
	// 	expect(component.showAsset360)
	// 		.toBeFalsy();
	// });

	// it('should set the selectedAsset', () => {
	// 	component.onRowClicked({ active: true });
	// 	expect(component.selectedAsset.active)
	// 		.toBeTruthy();
	// 	expect(component.showAsset360)
	// 		.toBeFalsy();
	// 	component.onRowClicked({ active: false });
	// 	expect(component.selectedAsset.active)
	// 		.toBeFalsy();
	// });

	// it('should unset the selectedAsset on panel close', () => {
	// 	component.onPanelClose();
	// 	expect(component.selectedAsset.active)
	// 		.toBeFalsy();
	// 	expect(component.showAsset360)
	// 		.toBeFalsy();
	// });

	// it('should set the selectedFingerPrint data', () => {
	// 	const asset = { test: 'test', active: true };
	// 	component.connectToFpDetails(asset);
	// 	expect(component.selectedFingerPrintdata)
	// 		.toBeDefined();
	// 	expect(component.showFpDetails)
	// 		.toBeTruthy();
	// });

	// it('on searching a string', () => {
	// 	component.onlyCrashes = false;
	// 	const result = {
	// 		customerId: 12323,
	// 		key: '',
	// 		search: '',
	// 		sortDirection: '',
	// 		solution: 'IBN',
	// 		useCase: '',
	// 		time: '90d',
	// 	};
	// 	spyOn(component, 'getFilterDetailsForSearchQuery')
	// 		.and
	// 		.returnValue(result);
	// 	spyOn(component, 'searchInCrashedAssetsGrid');
	// 	spyOn(component, 'getFingerPrintDeviceDetails');
	// 	fixture.detectChanges();
	// 	component.onSearchQuery('testString');
	// 	expect(component.searchQueryInCrashGrid)
	// 	.toEqual('testString');
	// 	expect(component.getFilterDetailsForSearchQuery)
	// 	.toHaveBeenCalled();
	// 	expect(component.searchInCrashedAssetsGrid)
	// 	.toHaveBeenCalled();
	// 	fixture.detectChanges();
	// 	component.onlyCrashes = true;
	// 	component.onSearchQuery('testString');
	// 	expect(component.searchQueryInHighCrashGrid)
	// 	.toEqual('testString');
	// 	expect(component.highCrashRiskParams.page)
	// 	.toEqual(0);
	// 	expect(component.highCrashRiskParams.search)
	// 	.toEqual('testString');
	// 	expect(component.highCrashRiskParams.size)
	// 	.toEqual(10);
	// 	expect(component.getFingerPrintDeviceDetails)
	// 	.toHaveBeenCalled();

	// });

	it('should get filtered results on subfilter select', () => {
		spyOn(component, 'resetFilters');
		const advisoryFilter = _.find(component.filters, { key: 'timeRange' });
		const riskScoreFilter = _.find(component.filters, { key: 'riskScore' });
		component.filters[0].seriesData = [
			{
				filter: 'Time: Last 24h',
				label: '24h',
				selected: false,
				value: 0,
			},
			{
				filter: 'Time: Last 7d',
				label: '7d',
				selected: true,
				value: 0,
			},
			{
				filter: 'Time: Last 30d',
				label: '30d',
				selected: false,
				value: 2,
			},
			{
				filter: 'Time: Last 90d',
				label: '90d',
				selected: false,
				value: 9,
			},
		];
		component.filters[1].seriesData = [
			{
				filter: 'HIGH',
				label: 'HIGH',
				selected: true,
				value: 6,
			},
			{
				filter: 'LOW',
				label: 'LOW',
				selected: false,
				value: 100,
			},
			{
				filter: 'MED',
				label: 'MEDIUM',
				selected: false,
				value: 8,
			},
			{
				filter: 'Not Evaluated',
				label: 'Not Evaluated',
				selected: false,
				value: 9,
			},
		];
		fixture.detectChanges();
		component.onSubfilterSelect('Time: Last 90d', advisoryFilter);
		expect(component.selectedCrashedSystemsFilter)
			.toBe('90');
		component.onSubfilterSelect('Time: Last 7d', advisoryFilter);
		expect(component.selectedCrashedSystemsFilter)
			.toBe('7');
		component.onSubfilterSelect('Time: Last 30d', advisoryFilter);
		expect(component.selectedCrashedSystemsFilter)
			.toBe('30');
		component.onSubfilterSelect('HIGH', riskScoreFilter);
		expect(component.selectedCrashRiskFilter)
			.toBe('HIGH');
	});

});
