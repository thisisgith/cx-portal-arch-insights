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
		expect(component.listdeviceData.length)
			.toEqual(0);
	}));

	it('should test data supplied to render chart', fakeAsync(() => {
		const deviceDetails = {
			customerId: '7293498',
			productId: 'AIR-CT5760',
			crashPredicted: true,
			deviceDetail: [
				{
					deviceId: 'NA,FOC1727V051,AIR-CT5760,NA',
					deviceName: 'Controller',
					serialNumber: 'FOC1727V051',
				},
			],
		};
		component.assetASelection(deviceDetails);
		tick();
		expect(component.deviceId1)
			.toBeDefined();
	}));

	it('should test data supplied to a render chart', fakeAsync(() => {
		const deviceDetails = {
			customerId: '7293498',
			productId: 'AIR-CT5760',
			crashPredicted: true,
			deviceDetail: [
				{
					deviceId: 'NA,FOC1727V051,AIR-CT5760,NA',
					deviceName: 'Controller',
					serialNumber: 'FOC1727V051',
				},
			],
		};
		component.assetBSelection(deviceDetails);
		tick();
		expect(component.deviceId2)
			.toBeDefined();
	}));
	it('should call pidsSelection and return error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(crashPreventionService, 'getListdevice')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		component.pidsSelection('ErrorData');
		fixture.detectChanges();
		expect(component.deviceId1)
		.toBeNull();
	});
	it('should check onselection productFamilyA', fakeAsync(() => {
		spyOn(crashPreventionService, 'getListdevice')
			.and
			.returnValue(of(ComparisonViewScenarios[1].scenarios.GET[0].response.body));
		component.pidsSelection('AIR-CT5760');
		tick();
		fixture.detectChanges();
		expect(crashPreventionService.getListdevice)
			.toHaveBeenCalled();
	}));
	it('should check onselection productFamilyA null', fakeAsync(() => {
		const selection = null;
		tick();
		expect(selection)
			.toBeNull();
		fixture.detectChanges();
		expect(component.selectedProductFamily)
			.toBeUndefined();
	}));
	it('should check if compare details exist', () => {
		expect(component.compareDetailsExist)
		.toBeFalsy();
		component.selectedproductId = 'TestProduct';
		component.deviceId1 = 'TestDeviceA';
		component.deviceId2 = 'TestDeviceB';
		fixture.detectChanges();
		expect(component.compareDetailsExist)
		.toBeTruthy();
	});
	it('should check reError emit', () => {
		spyOn(component.reqError, 'emit');
		const errorMsg = 'error';
		component.showError(errorMsg);
		fixture.detectChanges();
		expect(component.reqError.emit)
		.toHaveBeenCalled();
	});
	it('should check if assetBSelection exist or Not', () => {
		component.deviceId2 = 'NA,60110,C9407R,NA';
		fixture.detectChanges();
		expect(component.assetBError)
			.toBeFalsy();
	});
	it('should check if assetBSelection exist or Not', () => {
		component.deviceId2 = null;
		component.assetBSelection(component.deviceId2);
		fixture.detectChanges();
		expect(component.assetBError)
		 .toBeTruthy();
	});
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
		component.productFamilySelection(productFamilyDetails);
		expect(component.listOfProductIds)
			.toBeDefined();
	}));

	it('should check compare view value', fakeAsync(() => {
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="softwarebtn"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.compareView)
			.toEqual('software');
	}));

	it('Should return the searched getListdevice response', fakeAsync(() => {
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
