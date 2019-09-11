import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonviewComponent } from './comparisonview.component';
import { ComparisonviewModule } from './comparisonview.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user, ComparisonViewScenarios } from '@mock';
import { CrashPreventionService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';

describe('ComparisonviewComponent', () => {
	let component: ComparisonviewComponent;
	let fixture: ComponentFixture<ComparisonviewComponent>;
	let crashPreventionService: CrashPreventionService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [ComparisonviewModule,
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
		fixture = TestBed.createComponent(ComparisonviewComponent);
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
	it('should set onSelection of hardware features and software ', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		component.deviceId1 = 'NA,FOC1135Z4X9,WS-C3560G-24TS-E,NA';
		component.deviceId2 = 'NA,FOC1448Z4U9,WS-C2960S-48TS-S,NA';
		spyOn(crashPreventionService, 'getComparison')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.featuresData)
					.not
					.toBeTruthy();
				done();
			});
	});
	it('Should return the searched features response', done => {
		spyOn(crashPreventionService, 'getComparison')
			.and
			.returnValue(of(ComparisonViewScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.featuresData)
					.toBeDefined();
				expect(component.hardwareData)
					.toBeDefined();
				expect(component.softwareData)
					.toBeDefined();
				done();
			});
	});

	it('should check for ngOnchanges in comparison view component', () => {
		spyOn(crashPreventionService, 'getComparison')
			.and
			.returnValue(of(<any> []));
		component.ngOnChanges({
			deviceId1: {
				currentValue: 'Device_123',
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(crashPreventionService.getComparison)
			.toHaveBeenCalledTimes(1);
	});

	it('should not load data if device IDs are not available', () => {
		spyOn(crashPreventionService, 'getComparison')
			.and
			.returnValue(of(<any> []));
		component.ngOnChanges({
			deviceId1: {
				currentValue: null,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
			deviceId2: {
				currentValue: null,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(crashPreventionService.getComparison).not
			.toHaveBeenCalled();
	});
});
