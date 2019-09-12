import {
	async,
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick,
} from '@angular/core/testing';
import { MlVisualizationComponent } from './ml-visualization.component';
import { MlVisualizationModule } from './ml-visualization.module';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user, ComparisonViewScenarios } from '@mock';
import { MlVisualizationService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MlvisualizationInfo } from 'src/environments/mock/crash-prevention/comparisonview';

describe('MlVisualizationComponent', () => {
	let component: MlVisualizationComponent;
	let fixture: ComponentFixture<MlVisualizationComponent>;
	let mlVisualizationService: MlVisualizationService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MlVisualizationModule,
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
		mlVisualizationService = TestBed.get(MlVisualizationService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MlVisualizationComponent);
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
	it('should set empty select', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(
			mlVisualizationService,
			'getMlVisualizationDevices',
		).and
		.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnChanges({
			asset: {
				currentValue: {
					deviceId: null,
					productFamily: 'TestProductFamily',
				},
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.selectedDevice1)
			.toBeFalsy();
			expect(component.mlVisualizationDevices)
			.toBeUndefined();
			expect(component.seriesDataLoading)
				.toBeFalsy();
			expect(component.noData)
				.toBeTruthy();
			done();
		});
	});

	it('should resolve a customerId', done => {
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.customerId)
			.toBeDefined();
			done();
		});
	});

	it('should test data supplied to a render chart for all modes', () => {
		component.mlVisualizationDevices = MlvisualizationInfo;
		component.requestForm.controls.selectedGroup.setValue('group1');
		component.selectedDevice = 'TestDevice';
		component.selectedMode = 1;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints.length)
		.toBeGreaterThan(0);
		component.selectedMode = 2;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints.length)
		.toBeGreaterThan(0);
		component.selectedMode = 3;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints.length)
		.toBeGreaterThan(0);
		expect(component.selectedDevice1.deviceId)
		.toEqual('TestDevice');
		component.requestForm.controls.selectedGroup.setValue('group2');
		component.updateScatterPlotDataPoints();
		expect(component.selectedDevice2.deviceId)
		.toEqual('TestDevice');
	});

	it('should not load data when device list is not available', () => {
		component.mlVisualizationDevices = null;
		component.selectedMode = 1;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints)
		.toBeUndefined();
	});

	it('should set list of devices for Group1 and Group2', () => {
		const scatterPlotDevices = [];
		scatterPlotDevices.push({
			deviceId: 'NA',
			deviceName: 'Device_6_0_2_222',
		});
		component.updateDeviceList(scatterPlotDevices);
		expect(component.listOfDevices1)
		.toBe(scatterPlotDevices);
		component.requestForm.controls.selectedGroup.setValue('group2');
		component.updateDeviceList(scatterPlotDevices);
		expect(component.listOfDevices2)
		.toBe(scatterPlotDevices);
	});

	it('should check ml show Device Comparison', fakeAsync(() => {
		spyOn(component, 'showDeviceComparison');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="CompareButton"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.showDeviceComparison)
		.toHaveBeenCalledTimes(1);
	}));

	it('should reset all filter values', () => {
		component.resetFilterForm();
		expect(component.searchedDevice)
		.toBeFalsy();
		expect(component.selectedDevice1)
		.toBeFalsy();
		expect(component.selectedDevice2)
		.toBeFalsy();
		expect(component.listOfDevices1.length)
		.toEqual(0);
		expect(component.listOfDevices2.length)
		.toEqual(0);
	});

	it('Should set device list and data state on response', done => {
		spyOn(
			mlVisualizationService,
			'getMlVisualizationDevices',
		).and
		.returnValue(
			of(ComparisonViewScenarios[5].scenarios.GET[0].response.body),
		);
		component.ngOnChanges({
			asset: {
				currentValue: {
					deviceId: 'TestDevice',
					productFamily: 'TestProductFamily',
				},
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.mlVisualizationDevices)
			.toBeDefined();
			expect(component.deviceSearchList)
			.toBeDefined();
			expect(component.noData)
			.toBeFalsy();
			done();
		});
	});

	it('Should not load data when productFamily is null', done => {
		spyOn(
			mlVisualizationService,
			'getMlVisualizationDevices',
		).and
		.returnValue(
			of(ComparisonViewScenarios[5].scenarios.GET[0].response.body),
		);
		component.ngOnChanges({
			asset: {
				currentValue: {
					deviceId: 'TestDevice',
					productFamily: null,
				},
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.mlVisualizationDevices)
			.toBeUndefined();
			expect(component.deviceSearchList)
			.toBeUndefined();
			done();
		});
	});

	it('should not load data if response contains empty values', done => {
		spyOn(mlVisualizationService, 'getMlVisualizationDevices')
		.and
		.returnValue(of(ComparisonViewScenarios[9].scenarios.GET[0].response.body));
		component.ngOnChanges({
			asset: {
				currentValue: {
					deviceId: null,
					productFamily: 'TestProductFamily',
				},
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.scatterPlotDataPoints.length)
					.toEqual(0);
				expect(component.coalescePoints(component.scatterPlotDataPoints).length)
					.toEqual(0);
				done();
			});
	});

});
