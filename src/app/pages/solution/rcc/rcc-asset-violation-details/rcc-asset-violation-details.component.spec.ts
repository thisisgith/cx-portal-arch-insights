import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RccAssetViolationDetailsComponent } from './rcc-asset-violation-details.component';
import { RccAssetViolationDetailsModule } from './rcc-asset-violation-details.module';
import { throwError, of } from 'rxjs';
import { RCCScenarios, user } from '@mock';
import { RccService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

describe('RccAssetViolationDetailsComponent', () => {
	let component: RccAssetViolationDetailsComponent;
	let fixture: ComponentFixture<RccAssetViolationDetailsComponent>;
	let rccAssetDetailsService: RccService;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [RccAssetViolationDetailsModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [{
				provide: 'ENVIRONMENT',
				useValue: environment,
			}, {
				provide: ActivatedRoute,
				useValue: {
					queryParams: of({ }),
					snapshot: {
						data: {
							user,
						},
					},
				},
			}],
		});
	});

	beforeEach(async(() => {
		rccAssetDetailsService = TestBed.get(RccService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RccAssetViolationDetailsComponent);
		component = fixture.componentInstance;
		component.customerId = '7293498';
		component.selectedAssetData = { };
		component.selectedAssetData.violationCount = 10;
		component.selectedAssetData.serialNumber = 'FCW2246E0PB';
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
	it('should load filter and table grid data and display', fakeAsync(() => {
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
		spyOn(rccAssetDetailsService, 'getRccAssetFilterData')
			.and
			.returnValue(of(RCCScenarios[0].scenarios.GET[0].response.body));
		fixture.detectChanges();
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		component.customerId = '7293498';
		component.selectedAssetData = { serialNumber: 'FCW2246E0PB' };
		component.loadData();
		tick();
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
		expect(component.totalItems)
			.toBeDefined();
	}));
	it('should select value from policygroup and load table data', fakeAsync(() => {
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
		component.onPolicyGroupSelection(component.assetRowParams);
		tick();
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
	}));
	it('should select value from policy severity and load table data', fakeAsync(() => {
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		tick();
		component.onPolicySeveritySelection(component.assetRowParams);
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
	}));
	it('to be called on table sorting changed', () => {
		component.onTableSortingChanged();
		expect(component.tableOffset)
			.toEqual(0);
	});
	it('to be called on getAssetPolicyGridData, to make error result as true and to make the loading false', fakeAsync(() => {
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		tick();
		component.getAssetPolicyGridData();
		expect(component.errorResult)
			.toBeTruthy();
		expect(component.isLoading)
			.toBeFalsy();
	}));

	it('should invoke onPageIndexChange method', () => {
		component.onPolicyAssetPagerUpdated({ page: 1, limit : 10 });
		expect(component.tableOffset)
			.toEqual(1);
	});
	it('Should invoke api with error, to make the table data empty on API error response', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(rccAssetDetailsService, 'getRccAssetFilterData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		component.loadData();
		tick();
		expect(component.rccAssetPolicyTableData)
			.toEqual([]);
	}));
	it('should be called on asset information get updated', fakeAsync(() => {
		component.selectedAssetData = { serialNumber: 'FCW2246E0PB' };
		const selectedPreviousAssetData = { serialNumber: 'FCW2246E0P9' };
		component.ngOnChanges({
			selectedAssetData: {
				currentValue: component.selectedAssetData,
				firstChange: false,
				isFirstChange: () => true,
				previousValue: selectedPreviousAssetData,
			},
		});
		spyOn(component, 'loadData');
		tick();
		expect(component.loadData)
			.toHaveBeenCalledTimes(0);
	}));
	it('Should get the api data ngonchanges empty info data', fakeAsync(() => {
		const changes = {
			selectedAssetData: {
				currentValue: undefined,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		};
		component.ngOnChanges(changes);
		tick();
		expect(component.assetRowParams)
			.toBeUndefined();
	}));
	it('Should get the empty data on api call and to make initial Loading false on API empty response', fakeAsync(() => {
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		const emptyViolationDataDetails: any = {
			data: { },
			error: null,
			message: 'SUCCESS',
			status: 200,
		};
		const emptyAssetDataDetails: any = {
			data: null,
			error: null,
			message: 'SUCCESS',
			status: 200,
		};
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(emptyAssetDataDetails));
		spyOn(rccAssetDetailsService, 'getRccAssetFilterData')
			.and
			.returnValue(of(emptyViolationDataDetails));
		component.loadData();
		tick();
		expect(component.initialLoading)
			.toBeFalsy();
	}));
	it('Should reset table offset to 0 when asset policy grid data API returns empty response', fakeAsync(() => {
		expect(component.getAssetPolicyGridData());
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: '',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		const emptyViolationDataDetails: any = {
			data: {
				policygroupname : null,
				policyname : undefined,
				rulehighseverity : null,
			},
			error: null,
			message: 'SUCCESS',
			status: 200,
		};
		const emptyAssetDataDetails: any = {
			data: {
				violation: [],
			},
			error: null,
			message: 'SUCCESS',
			status: 200,
		};
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(emptyAssetDataDetails));
		spyOn(rccAssetDetailsService, 'getRccAssetFilterData')
			.and
			.returnValue(of(emptyViolationDataDetails));
		component.loadData();
		tick();
		expect(component.tableOffset)
			.toEqual(0);
	}));
	it('Should reset table offset to 0 when asset summary API returns empty response', fakeAsync(() =>  {
		component.assetRowParams = {
			customerId: '7293498',
			pageIndex: 0,
			pageSize: 10,
			policyGroupName: '',
			policyName: 'HIPPA',
			serialNumber: 'FCW2246E0PB',
			severity: '',
			sortBy: '',
			sortOrder: '',
		};
		const assetViolations = undefined;
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(assetViolations));
		tick();
		component.getAssetPolicyGridData();
		expect(component.tableOffset)
			.toEqual(0);
	}));
});
