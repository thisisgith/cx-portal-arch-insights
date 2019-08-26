import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('FpIntelligenceComponent', () => {
	let userResolve: UserResolve;
	let component: FpIntelligenceComponent;
	let fixture: ComponentFixture<FpIntelligenceComponent>;
	let fpIntelligenceService: FpIntelligenceService;

	beforeEach(async(() => {
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
		})

			.compileComponents();
		userResolve = TestBed.get(UserResolve);
		fpIntelligenceService = TestBed.get(FpIntelligenceService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FpIntelligenceComponent);
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
				expect(component.softwareSeriesData)
					.toBeUndefined();
				done();
			});
	});

	it('Should return the response', done => {
		spyOn(fpIntelligenceService, 'getSimilarDevicesDistribution')
			.and
			.returnValue(of(ComparisonViewScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.updateSeriesData)
					.toBeDefined();
				done();
			});
	});

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
});
