import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FpIntelligenceComponent } from './fp-intelligence.component';
import { FpIntelligenceModule } from './fp-intelligence.module';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user, ComparisonViewScenarios } from '@mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FpIntelligenceService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResolve } from '@utilities';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('FpIntelligenceComponent', () => {
	let userResolve: UserResolve;
	let component: FpIntelligenceComponent;
	let fixture: ComponentFixture<FpIntelligenceComponent>;
	let fpIntelligenceService: FpIntelligenceService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [FpIntelligenceModule,
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
		userResolve = TestBed.get(UserResolve);
		fpIntelligenceService = TestBed.get(FpIntelligenceService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FpIntelligenceComponent);
		component = fixture.componentInstance;
		component.softwareSeriesData = [];
		component.productFamilySeriesData = [];
		component.productSeriesData = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
	/**
	 * @TODO: modify test to use UI
	 */
	it('should throw error if API fail', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(fpIntelligenceService, 'getSimilarDevicesDistribution')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.softwareSeriesData.length)
					.toEqual(0);
				done();
			});
	});

	it('Should return the response', fakeAsync(() => {
		component.requestForm.setValue({
			deviceCount : 50,
			minMatch: 50 ,
			similarityCriteria: 'fingerprint'});
		spyOn(component, 'updateSeriesData');
		spyOn(fpIntelligenceService, 'getSimilarDevicesDistribution')
			.and
			.returnValue(of(ComparisonViewScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		tick(1000);
		fixture.detectChanges();
		expect(component.updateSeriesData)
			.toHaveBeenCalled();
	}));

	it('should resolve a customerId', done => {
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('12345'));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.customerId)
					.toBeDefined();
				done();
			});
	});

	it('should resolve software data from device distribution data', done => {
		const similarDeviceDistribution = {
			customerId: '7293498',
			softwares: [
				{
					softwareVersion: '16.8.1a',
					deviceCount: '316',
				},
				{
					softwareVersion: '16.9.1',
					deviceCount: '1',
				},
			],
			productFamilies: [
				{
					productFamily: 'Cisco Catalyst 9400 Series Switches',
					deviceCount: '317',
				},
			],
			products: [
				{
					productId: 'C9407R',
					deviceCount: '317',
				},
			],
		};
		component.updateSeriesData(similarDeviceDistribution);
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.softwareSeriesData.length)
				.toBeGreaterThan(0);
				done();
			});

	});

	it('should not load data if response contains empty values', fakeAsync(() => {
		component.requestForm.setValue({
			deviceCount : 50,
			minMatch: 50 ,
			similarityCriteria: 'fingerprint'});
		spyOn(fpIntelligenceService, 'getSimilarDevicesDistribution')
		.and
		.returnValue(of(ComparisonViewScenarios[6].scenarios.GET[0].response.body));
		component.ngOnInit();
		tick(1000);
		fixture.detectChanges();
		expect(component.noData)
			.toBeTruthy();
	}));

	it('should not load data if form is invalid', fakeAsync(() => {
		component.requestForm.setValue({
			deviceCount : 50,
			minMatch: -1 ,
			similarityCriteria: 'fingerprint'});
		spyOn(fpIntelligenceService, 'getSimilarDevices')
			.and
			.returnValue(of(ComparisonViewScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		tick(1000);
		fixture.detectChanges();
		expect(fpIntelligenceService.getSimilarDevices).not
			.toHaveBeenCalled();
	}));

	it('should getSimilarDevicesDistribution for asset change', () => {
		let fakeInput: SimpleChanges = {
			asset: new SimpleChange(null, { deviceId: 'TestID' }, false),
		};
		const spy = spyOn(fpIntelligenceService, 'getSimilarDevicesDistribution').and
			.callThrough();
		component.ngOnChanges(fakeInput);
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.deviceId)
				.toBeDefined();
			expect(component.deviceId)
				.toEqual('TestID');
			expect(spy)
				.toHaveBeenCalled();
		});
		fakeInput = {
			asset: new SimpleChange(null, { deviceId: 'TestID' }, false),
		};
		component.ngOnChanges(fakeInput);
		fixture.whenStable()
		.then(() => {
			expect(spy).not
				.toHaveBeenCalled();
		});
	});
});
