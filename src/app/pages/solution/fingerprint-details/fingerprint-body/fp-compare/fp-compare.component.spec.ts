import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FpCompareComponent } from '../fp-compare/fp-compare.component';
import { FpCompareModule } from '../fp-compare/fp-compare.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import { CrashPreventionService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { user, ComparisonViewScenarios } from '@mock';
import { By } from '@angular/platform-browser';

describe('FpCompareComponent', () => {
	let component: FpCompareComponent;
	let fixture: ComponentFixture<FpCompareComponent>;
	let crashPreventionService: CrashPreventionService;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FpCompareModule,
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

		crashPreventionService = TestBed.get(CrashPreventionService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(FpCompareComponent);
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
	it('should set empty select', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		tick();
		fixture.detectChanges();
		expect(component.listdeviceDataA.length)
			.toEqual(0);
	}));

	it('should test data supplied to render chart', fakeAsync(() => {
		const deviceDetails = {
			customerId: '7293498',
			deviceDetail: [
				{
					deviceId: 'NA,6011,C9407R,NA',
					deviceName: 'Device_6_0_1_1',
				},
				{
					deviceId: 'NA,60110,C9407R,NA',
					deviceName: 'Device_6_0_1_10',
				},
				{
					deviceId: 'NA,601101,C9407R,NA',
					deviceName: 'Device_6_0_1_101',
				},
				{
					deviceId: 'NA,601103,C9407R,NA',
					deviceName: 'Device_6_0_1_103',
				},
			],
		};
		component.onSelection1(deviceDetails);
		tick();
		expect(component.deviceId1)
			.toBeDefined();
	}));

	it('should test data supplied to a render chart', fakeAsync(() => {
		const deviceDetails = {
			customerId: '7293498',
			deviceDetail: [
				{
					deviceId: 'NA,6011,C9407R,NA',
					deviceName: 'Device_6_0_1_1',
				},
				{
					deviceId: 'NA,60110,C9407R,NA',
					deviceName: 'Device_6_0_1_10',
				},
				{
					deviceId: 'NA,601101,C9407R,NA',
					deviceName: 'Device_6_0_1_101',
				},
				{
					deviceId: 'NA,601103,C9407R,NA',
					deviceName: 'Device_6_0_1_103',
				},
			],
		};
		component.onSelection2(deviceDetails);
		tick();
		expect(component.deviceId2)
			.toBeDefined();
	}));
	/**
	 * ProductFamily response
	 */
	it('Should return the searched response', fakeAsync(() => {
		spyOn(crashPreventionService, 'getProductFamily')
			.and
			.returnValue(of(ComparisonViewScenarios[0].scenarios.GET[0].response.body));
		tick();
		fixture.detectChanges();
		expect(component.productData)
			.toBeDefined();
	}));

	it('should test data supplied to comparisonview', fakeAsync(() => {
		const productFamilyDetails = {
			customerId: '7293498',
			productFamily: [
				{
					productFamily: 'Cisco 4400 Series Integrated Services Routers',
					productId: '',
				},
			],
		};
		component.onSelection3(productFamilyDetails);
		tick();
		expect(component.productFamilyB)
			.toBeDefined();
	}));

	it('should test data supplied to comparisonviewA ', fakeAsync(() => {
		const productFamilyDetails = {
			customerId: '7293498',
			productFamily: [
				{
					productFamily: 'Cisco 4400 Series Integrated Services Routers',
					productId: '',
				},
			],
		};
		component.onSelection(productFamilyDetails);
		expect(component.productFamilyA)
			.toBeDefined();
	}));

	it('should check compare view value', fakeAsync(() => {
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="hardwarebtn"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.compareView)
			.toEqual('hardware');
	}));

	it('should check onselection productFamilyA', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.onSelection('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(crashPreventionService.getListdevice)
			.toHaveBeenCalled();
	}));

	it('should set deviceId1 as selected if it exists in the deviceList', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.deviceId1 = 'NA,60110,C9407R,NA';
		component.onSelection('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(component.deviceId1)
			.toEqual('NA,60110,C9407R,NA');
	}));

	it('should enable device selection when product family is selected', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.deviceId1 = 'NA,60110,C9407R,NA';
		component.onSelection('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(component.assetsAactive)
			.toBeFalsy();
	}));

	it('should check onselection productFamilyB', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.onSelection3('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(crashPreventionService.getListdevice)
			.toHaveBeenCalled();
	}));

	it('should set deviceId2 as selected if it exists in the deviceList', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.deviceId2 = 'NA,6011,C9407R,NA';
		component.onSelection3('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(component.deviceId2)
			.toEqual('NA,6011,C9407R,NA');
	}));

	it('should enable device selection when product family is selected', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.deviceId2 = 'NA,60110,C9407R,NA';
		component.onSelection3('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(component.assetsBactive)
			.toBeFalsy();
	}));

	it('Should return the searched getListdevice response', fakeAsync(() => {
		spyOn(crashPreventionService, 'getProductFamily')
			.and
			.returnValue(of(<any> []));
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.ngOnChanges({
			devices: {
				currentValue: { deviceId1: '' },
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(crashPreventionService.getProductFamily)
			.toHaveBeenCalled();
		expect(crashPreventionService.getListdevice)
			.toHaveBeenCalled();
	}));

	it('should check for ngOnchanges in ProductFamily and getListdevice', () => {
		spyOn(crashPreventionService, 'getProductFamily')
			.and
			.returnValue(of(<any> []));
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(<any> []));
		component.ngOnChanges({
			devices: {
				currentValue: null,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(crashPreventionService.getProductFamily)
			.toHaveBeenCalledTimes(0);
		expect(crashPreventionService.getListdevice)
			.toHaveBeenCalledTimes(0);
	});
});
