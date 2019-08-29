import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { RccDeviceViolationDetailsComponent } from './rcc-device-violation-details.component';
import { RccDeviceViolationDetailsModule } from './rcc-device-violation-details.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import {
	RccService,
} from '@sdp-api';
import { throwError, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
	user,
	ComplianceScenarios,
} from '@mock';

describe('RccDeviceViolationDetailsComponent', () => {
	let component: RccDeviceViolationDetailsComponent;
	let fixture: ComponentFixture<RccDeviceViolationDetailsComponent>;
	let rccTrackService: RccService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RccDeviceViolationDetailsModule,
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
		rccTrackService = TestBed.get(RccService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(RccDeviceViolationDetailsComponent);
		component = fixture.componentInstance;
		component.policyViolationInfo = {
			active: true,
			impassets: 7,
			policycategory: 'Audit and Management',
			policygroupid: 'PCI_IOS_XE_GROUP',
			policyid: '_Terminal_Access__IOSXE_',
			policyname: 'Terminal Access [ IOS-XE ]',
			ruleid: '_Check_Login_Authentication_on_terminal_lines__IOSXE_',
			ruleseverity: 'P3',
			ruletitle: 'Check Login Authentication on terminal lines [ IOS-XE ]',
			violationcount: 7,
		};

		component.queryParamMapObj = {
			customerId: '7293498',
			policyCategory: 'Audit and Management',
			policyGroup: 'PCI_IOS_XE_GROUP',
			policyName: '_Terminal_Access__IOSXE_',
			ruleName: '_Check_Login_Authentication_on_terminal_lines__IOSXE_',
			severity: 'P3',
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should invoke onPageIndexChange method', () => {
		component.onPageIndexChange({ page: 1 });
		expect(component.tableConfig.tableOffset)
			.toEqual(1);
	});

	it('should invoke loadData and call both APIs', fakeAsync(() => {
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[6].scenarios.GET[0].response.body));
		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[7].scenarios.GET[0].response.body));
		component.loadData();
		tick();
		fixture.detectChanges();
		expect(component.impactedDeviceDetails)
			.toEqual(ComplianceScenarios[6].scenarios.GET[0].response.body.data.impactedAssets);
		expect(component.policyRuleData)
			.toEqual(ComplianceScenarios[7].scenarios.GET[0].response.body.data);

	}));

	it('should invoke loadData and call both APIs with empty response', fakeAsync(() => {
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[8].scenarios.GET[0].response.body));
		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[8].scenarios.GET[0].response.body));
		component.loadData();
		tick();
		fixture.detectChanges();
		expect(component.impactedDeviceDetails)
			.toEqual([]);
		expect(component.policyRuleData.policy)
			.toEqual({ });

	}));

	it('Should invoke ngOnInit method which initializes both table options', () => {
		component.ngOnInit();
		expect(component.rccViolationInfoTableOptions)
			.toBeDefined();
		expect(component.impactedDeviceTableOptions)
			.toBeDefined();

	});

	it('Should invoke onTableSortingChanged and assign tableOffset to 0', () => {
		component.onTableSortingChanged();
		expect(component.tableConfig.tableOffset)
			.toBe(0);
	});

	it('Should invoke api and error response should keep impactedDeviceDetails empty array',
	fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.onSelection();
		tick();
		expect(component.impactedDeviceDetails)
			.toEqual([]);
	}));

	it('Should invoke api and errorResult should be true', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.loadData();
		tick();
		expect(component.errorResult)
			.toBeTruthy();
	}));

	it('Should invoke getRccViolationDetailsData api ', fakeAsync(() => {
		component.selectionObj = {
			osName: 'IOS-XE',
			productFamily: 'C2300',
			productModel: 'WS-C2300',
		};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[6].scenarios.GET[0].response.body));
		component.onSelection();
		tick();
		expect(component.impactedDeviceDetails)
			.toEqual(ComplianceScenarios[6].scenarios.GET[0].response.body.data.impactedAssets);
	}));

	it('Should get the api data on ngonchanges method', fakeAsync(() => {
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[6].scenarios.GET[0].response.body));
		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[7].scenarios.GET[0].response.body));
		const changes = {
			policyViolationInfo: {
				currentValue: {
					policycategory: '',
					policygroupid: '',
					policyname: '',
					ruletitle: '',
				},
				firstChange: true,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		};
		component.ngOnChanges(changes);
		tick();
		fixture.detectChanges();
		expect(component.policyRuleData.policy)
			.toEqual({ });
	}));

	it('Should not get the api data on ngonchanges when', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		const changes = {
			policyViolationInfo: {
				currentValue: {
					policycategory: '',
					policygroupid: '',
					policyname: '',
					ruletitle: '',
				},
				firstChange: true,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		};
		component.ngOnChanges(changes);
		tick();
		fixture.detectChanges();
		expect(component.errorResult)
			.toBeFalsy();
	}));

	it('Should get the api data ngonchanges empty info data', fakeAsync(() => {
		const changes = {
			policyViolationInfo: {
				currentValue: {
					policycategory: '',
					policygroupid: '',
					policyname: '',
					ruletitle: '',
				},
				firstChange: false,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		};
		component.ngOnChanges(changes);
		tick();
		expect(component.queryParamMapObj)
			.toBeDefined();
		expect(component.loadData());
	}));

	it('Should invoke getRccViolationDetailsData api and return empty decive list ',
	fakeAsync(() => {
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[9].scenarios.GET[0].response.body));
		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[7].scenarios.GET[0].response.body));
		component.loadData();
		tick();
		fixture.detectChanges();
		expect(component.impactedDeviceDetails)
			.toEqual([]);
	}));

});
