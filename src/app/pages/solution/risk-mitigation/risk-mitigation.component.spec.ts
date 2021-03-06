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
describe('RiskMitigationComponent', () => {
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
		jest.spyOn(riskMitigationService, 'getAllCrashesData')
			.mockReturnValue(of(RiskScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(riskMitigationService, 'getHighCrashRiskDeviceCountData')
			.mockReturnValue(of(<HighCrashRiskDeviceCount>
				RiskScenarios[1].scenarios.GET[0].response.body));
		jest.spyOn(riskMitigationService, 'getFingerPrintDeviceDetailsData')
			.mockReturnValue(of(<any> { devices: [], count: 100 }));
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
		jest.spyOn(riskMitigationService, 'getAllCrashesData')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(riskMitigationService, 'getDeviceDetails')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(riskMitigationService, 'getHighCrashRiskDeviceCountData')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(riskMitigationService, 'getSearchedData')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(riskMitigationService, 'getCrashHistoryForDevice')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(riskMitigationService, 'getFingerPrintDeviceDetailsData')
		.mockReturnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		component.clearFilters();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.selectedCrashedSystemsFilter)
					.toBe('1');
				done();
			});
	});

	/**
	 * @TODO: modify test to Check Updated CrashedAssest Count
	 */
	it('Should get the last few days crash data', done => {
		jest.spyOn(riskMitigationService, 'getAllCrashesData')
			.mockReturnValue(of(RiskScenarios[0].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.crashedAssetsCount)
					.toBe(0);
				done();
			});
	});

	it('Should get all the high risks devices count', done => {
		jest.spyOn(riskMitigationService, 'getHighCrashRiskDeviceCountData')
			.mockReturnValue(of(<HighCrashRiskDeviceCount>
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

	it('show only crashes toggle', () => {
		expect(component.onlyCrashes)
			.toBeTruthy();
		component.getAllCrashesData();
		expect(component.onlyCrashes)
			.toBeFalsy();
	});

	it('should get filtered results on subfilter select', () => {
		jest.spyOn(component, 'resetFilters');
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
	it('should set the Time range ', () => {
		const timeRangeParam =  {
			filter: 'Time: Last 24h',
			label: '24h',
			selected: false,
			value: 20,
		};
		component.getTimeRange(timeRangeParam);
		expect(component.selectedFilters)
		.toBeDefined();
	});

	it('update pager details on page update', () => {
		const pageinfo = {
			itemRange: '1-10',
			totalItems: '108',
		};
		component.paginationValueDetails(pageinfo);
		expect(component.itemRange)
			.toBe('1-10');
		expect(component.totalItems)
			.toBe('108');
	});

	it('Get the Total assest count ', () => {
		jest.spyOn(riskMitigationService, 'getTotalAssestCount')
			.mockReturnValue(of(RiskScenarios[7].scenarios.GET[0].response.body));
		expect(component.totalAssetCount)
			.toBeDefined();
	});

	it('clear all filter values', () => {
		component.clearAllFilters();
		expect(component.selectedCrashRiskFilter)
			.toBeFalsy();
	});

	it('should return the list of Selected filter', () => {
		const key = 'timeRange';
		component.filters = [
			{
				key: 'timeRange',
				loading: true,
				seriesData: [
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
				],
				template: this.timeRangeFilterTemplate,
				title: 'TIME_Period',
			},
			{
				key: 'riskScore',
				loading: true,
				seriesData: [],
				template: this.riskScoreFilterTemplate,
				title: 'Risk',
			},
		];
		const selectedFilter = component.getSelectedSubFilters(key);
		expect(selectedFilter[0].selected)
		.toBeTruthy();
	});

	it('Load data for score cards', () => {
		const assetsCountSpy = jest.spyOn(component, 'getTotalAssetCount');
		jest.spyOn(riskMitigationService, 'getTotalAssestCount')
			.mockReturnValue(of(RiskScenarios[7].scenarios.GET[0].response.body));
		component.loadData();
		expect(assetsCountSpy)
			.toHaveBeenCalled();
	});

});
