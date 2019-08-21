import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

fdescribe('RccDeviceViolationDetailsComponent', () => {
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
			customerId: '90019449',
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
		fixture.detectChanges();
	});

	it('Should invoke ngOnInit method which initializes both table options', () => {
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.rccViolationInfoTableOptions)
			.toBeDefined();
		expect(component.impactedDeviceTableOptions)
			.toBeDefined();

	});

	it('Should invoke api and error response should keep impactedDeviceDetails empty array', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		component.selectionObj = { osName: 'IOSXE', productModel: 'C9300-24P' };
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.onSelection();
		fixture.detectChanges();
		expect(component.impactedDeviceDetails)
			.toEqual([]);
	});

	it('Should get the api data on ngonchanges method', done => {
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[6].scenarios.GET[0].response.body));
		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[7].scenarios.GET[0].response.body));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.impactedAssetsCount)
			.toBeDefined();
		expect(component.selectionObj)
			.toBeDefined();
		done();
	});
	it('Should not get the api data on ngonchanges when', done => {
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
		component.ngOnChanges();
		fixture.detectChanges();
		done();
	});

	it('Should get the api data ngonchanges empty info data', () => {
		component.policyViolationInfo = { };
		component.ngOnChanges();
		fixture.detectChanges();
	});
});
