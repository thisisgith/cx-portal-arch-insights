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
		component.deviceA = 'NA,FOC1727V051,AIR-CT5760,NA';
		component.deviceB = 'NA,FOC1727V051,AIR-CT5760,NA';
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
			deviceA: {
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
			deviceA: {
				currentValue: null,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
			deviceB: {
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

	it('should unset the selected System', () => {
		const selectedAsset = {
			active: true,
			deviceId: 'NA,JAB05460BA7,ASR1002-HX,NA',
			deviceName: 'LA1-ASR1001X-2.corp.local',
			globalRiskRank: 'HIGH',
			productFamily: 'Cisco ASR 1000 Series Aggregation Services Routers',
			productId: 'ASR1002-HX',
			riskScore: 23.5,
			serialNumber: 'AGM2118404V',
			softwareType: 'IOS-XE',
			softwareVersion: '16.6.2',
		};
		component.showAssetDetails(selectedAsset);
		expect(component.selectedAsset)
			.toBeDefined();
		expect(component.showAssetDetailsView)
			.toBeTruthy();
	});
	it('should  update the comparisonview', () => {
		const event = {
			altKey: false,
			bubbles: true,
			button: 0,
			buttons: 0,
			cancelBubble: false,
			cancelable: true,
			clientX: 1318,
			clientY: 509,
			composed: true,
			ctrlKey: false,
		};
		const selectedTab = 'feature';
		component.updateCompareView(event, selectedTab);
		expect(component.compareView)
		.toEqual(selectedTab);
	});
	it('should  not update the comparisonview', () => {
		const event = {
			altKey: false,
			bubbles: true,
			button: 0,
			buttons: 0,
			cancelBubble: false,
			cancelable: true,
			clientX: 1318,
			clientY: 509,
			composed: true,
			ctrlKey: false,
		};
		const selectedTab = null;
		component.updateCompareView(event, selectedTab);
		expect(component.compareView)
		.toBeUndefined();
	});
	it('should call asset api and return error response', () => {
		component.comparisonInfo = null;
		component.compareviewLoading = true ;
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(crashPreventionService, 'getComparison')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.detectChanges();
		component.loadData();
		expect(component.compareviewLoading)
		.toBeFalsy();
		expect(component.softwareData)
		.toBeNull();
		expect(component.featuresData)
		.toBeNull();
	});
});
