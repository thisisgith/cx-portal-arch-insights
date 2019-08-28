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

	beforeEach(async(() => {
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
		})
			.compileComponents();
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
	it('Should return the searched response', done => {
		spyOn(crashPreventionService, 'getComparison')
			.and
			.returnValue(of(ComparisonViewScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.featuresData)
					.toBeDefined();
				done();
			});
	});

});