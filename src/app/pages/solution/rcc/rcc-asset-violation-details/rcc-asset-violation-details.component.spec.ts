import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
	it('should load filter and table grid data and display', () => {
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
		fixture.detectChanges();
		component.loadData();
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
		expect(component.totalItems)
			.toBeDefined();

	});
	it('should select value from policygroup and load table data', () => {
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
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.rccAssetPolicyTableData)
					.toBeDefined();
			});
	});
	it('should select value from policyname and load table data', () => {

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
		component.onPolicyNameSelection(component.assetRowParams);
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
	});

	it('should select value from policy severity and load table data', () => {
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
		component.onPolicySeveritySelection(component.assetRowParams);
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
	});
	it('should be used to check on ng on changes', () => {
		expect(component.selectedAssetData)
			.toBeDefined();
		component.selectedAssetData = { serialNumber: 'FCW2246E0PB' };
	});
	it('should be called on asset information get updated', () => {
		component.selectedAssetData = { serialNumber: 'FCW2246E0PB' };
		const selectedPreviousAssetData = { serialNumber: 'FCW2246E0P9' };
		component.ngOnChanges({
			selectedAssetData: {
				currentValue: component.selectedAssetData,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: selectedPreviousAssetData,
			},
		});
		expect(component.loadData());
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
		fixture.whenStable()
			.then(() => {
				expect(component.rccAssetPolicyTableData)
					.toBeDefined();
			});

	});
	it('to be called on table sorting changed', () => {
		component.onTableSortingChanged();
		expect(component.tableOffset)
			.toEqual(0);
	});

	it('to be called on getAssetPolicyGridData', () => {
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
		component.getAssetPolicyGridData();
		expect(component.errorResult)
			.toBeTruthy();
		expect(component.isLoading)
			.toBeFalsy();
	});

	it('should invoke onPageIndexChange method', () => {
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
		component.onPolicyAssetPagerUpdated({ page: 1, limit : 10 });
		expect(component.tableOffset)
			.toEqual(1);
	});

	it('Should invoke api with error', () => {
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
		expect(component.rccAssetPolicyTableData)
			.toEqual([]);
	});
	it('should be called on asset information get updated', () => {
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
		expect(component.loadData)
		.not
		.toHaveBeenCalled();
	});
});
