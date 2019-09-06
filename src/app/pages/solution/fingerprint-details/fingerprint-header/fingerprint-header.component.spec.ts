import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FingerprintHeaderComponent } from './fingerprint-header.component';
import { FingerprintHeaderModule } from './fingerprint-header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user, ComparisonViewScenarios } from '@mock';
import { CrashPreventionService } from '@sdp-api';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('FingerprintHeaderComponent', () => {
	let component: FingerprintHeaderComponent;
	let fixture: ComponentFixture<FingerprintHeaderComponent>;
	let crashPreventionService: CrashPreventionService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FingerprintHeaderModule,
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

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FingerprintHeaderModule,
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
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(FingerprintHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

	}));
	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
	/**
	 * @TODO: modify test to use UI
	 */
	it('should set empty select', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(crashPreventionService, 'getDeviceInfo')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.deviceData.length)
					.toEqual(0);
				done();
			});
	});
	/**
	 * device Information response
	 */
	it('Should return the searched response', () => {
		spyOn(crashPreventionService, 'getDeviceInfo')
			.and
			.returnValue(of(ComparisonViewScenarios[3].scenarios.GET[0].response.body));
		fixture.detectChanges();
		expect(component.deviceData)
			.toBeDefined();
	});

	it('should getDeviceInfo if assets change', () => {
		const fakeInput: SimpleChanges = {
			asset: new SimpleChange(null, { customerId: 'Hello', deviceId: 'Hello' }, true),
		};
		const spy = spyOn(crashPreventionService, 'getDeviceInfo').and
			.callThrough();
		component.ngOnChanges(fakeInput);
		expect(component.deviceDetails.deviceId)
			.toBeDefined();
		expect(component.deviceDetails.deviceId)
			.toEqual('Hello');
		expect(spy)
			.toHaveBeenCalled();
	});

	it('should not getDevice info if assets is null', () => {
		const fakeInput: SimpleChanges = {
			asset: null,
		};
		const spy = spyOn(crashPreventionService, 'getDeviceInfo').and
			.callThrough();
		component.ngOnChanges(fakeInput);
		expect(spy)
			.toHaveBeenCalledTimes(0);
	});

});
