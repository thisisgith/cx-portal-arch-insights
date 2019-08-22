import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RccAssetViolationDetailsComponent } from './rcc-asset-violation-details.component';
import { RccAssetViolationDetailsModule } from './rcc-asset-violation-details.module';
import { of } from 'rxjs';
import { RCCScenarios, user } from '@mock';
import { RccAssetDetailsService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';

describe('RccAssetViolationDetailsComponent', () => {
	let component: RccAssetViolationDetailsComponent;
	let fixture: ComponentFixture<RccAssetViolationDetailsComponent>;
	let rccAssetDetailsService: RccAssetDetailsService;
	beforeEach(async(() => {
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
		})
		.compileComponents();
		   rccAssetDetailsService = TestBed.get(RccAssetDetailsService);
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
	it('should read the violation data and display', () => {
		component.selectedAssetData.violationCount = 10;
		fixture.detectChanges();
		expect(component.selectedAssetData.violationCount)
		.toBeDefined();
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
	it('should select value from policygroup and load table data', done => {

		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
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
		component.onPolicyGroupSelection(component.assetRowParams);
		fixture.detectChanges();
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
		done();
	});
	it('should select value from policyname and load table data', done => {
		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
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
		component.onPolicyNameSelection(component.assetRowParams);
		fixture.detectChanges();
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
		done();
	});
	it('should select value from policyname and load table data', done => {

		spyOn(rccAssetDetailsService, 'getAssetSummaryData')
			.and
			.returnValue(of(RCCScenarios[1].scenarios.GET[0].response.body));
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
		component.onPolicySeveritySelection(component.assetRowParams);
		fixture.detectChanges();
		expect(component.rccAssetPolicyTableData)
			.toBeDefined();
		done();
	});
	it('should be called on policy pager filter updated', () => {
		component.onPolicyAssetPagerUpdated({ });
		fixture.detectChanges();
	});
});
