import {
	async,
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick,
} from '@angular/core/testing';
import { ScatterPlotComponent } from './scatter-plot.component';
import { ScatterPlotModule } from './scatter-plot.module';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartModule, Chart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as Highcharts from 'highcharts/highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as boost from 'highcharts/modules/boost-canvas';
import * as drag from 'highcharts/modules/draggable-points';
import { By } from '@angular/platform-browser';

describe('ScatterPlotComponent', () => {
	let component: ScatterPlotComponent;
	let fixture: ComponentFixture<ScatterPlotComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ScatterPlotModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
				ChartModule,
			],
			providers: [
				{ provide: HIGHCHARTS_MODULES, useFactory: () => [boost, drag, more] },
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ScatterPlotComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		component.ngOnChanges({
			dataPoints: null,
			selectedDevice: null,
		});
		expect(component)
		.toBeTruthy();
	});

	it('should rebuild graph on ngOnChanges', () => {
		spyOn(component, 'buildGraph');
		const scatterPlotDevices = [
			{
				deviceId: 'NA',
				deviceName: 'Device_6_0_2_222',
				featureProfilePCA1: '0.27194448313748254',
				featureProfilePCA2: '-0.6677443614955769',
				featureProfilePCA3: '-0.26921527251480576',
				featureProfileKcluster: 0,
				fingerprintPCA1: '-0.6536891710909882',
				fingerprintPCA2: '0.4201990688658936',
				fingerprintPCA3: '-0.6212148577636525',
				lemmaFeaturePCA1: '0.12992399064088117',
				lemmaFeaturePCA2: '0.03928785789397787',
				lemmaFeaturePCA3: '-0.268887363699741',
				lemmaFeatureKcluster: 0,
				fingerprintKcluster: 0,
				featureProfileKclusterCrashrate: '11.58',
				lemmaFeatureKclusterCrashrate: '5.9',
				fingerprintKclusterCrashrate: '0.05',
				productFamily: 'Cisco_Catalyst_9',
				productId: 'C9407R',
			},
		];

		component.chart = new Chart();
		component.ngOnChanges({
			dataPoints: {
				currentValue: scatterPlotDevices,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.buildGraph)
		.toHaveBeenCalled();
	});

	it('should not build graph on ngOnChanges', () => {
		spyOn(component, 'buildGraph');
		component.ngOnChanges({
			dataPoints: null,
			selectedDevice: null,
		});

		fixture.detectChanges();
		expect(component.buildGraph)
		.toHaveBeenCalledTimes(0);
	});

	it('should select the deviceId in the scatter plot', () => {
		component.dataPoints = [
			{
				position: {
					x: 0.4990452157572191,
					y: -0.06881163915251692,
					z: -0.009611822430886645,
				},
				cluster: 5,
				devices: [
					{
						deviceInfo: {
							deviceId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
							productId: 'WS-C4506-E',
						},
						deviceName: 'C4506-E',
					},
				],
				id: 0,
				mass: 1,
				radius: 1,
				x: 0.4990452157572191,
				y: -0.06881163915251692,
				z: -0.009611822430886645,
			},
			{
				position: {
					x: -0.6855702541560552,
					y: 4.192143103082259,
					z: 1.778192935721556,
				},
				cluster: 5,
				devices: [
					{
						deviceInfo: {
							deviceId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
							productId: 'WS-C4506-E',
						},
						deviceName: 'c4500',
					},
				],
				id: 1,
				mass: 1,
				radius: 1,
				x: -0.6855702541560552,
				y: 4.192143103082259,
				z: 1.778192935721556,
			},
		];
		component.buildGraph();
		spyOn(component, 'updateSelectedDeviceBySearch');
		component.ngOnChanges({
			dataPoints: null,
			selectedDevice: {
				currentValue: 'NA,FOX1306GFKH,WS-C4506-E,NA',
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(component.updateSelectedDeviceBySearch)
		.toHaveBeenCalledTimes(1);
	});

	it('should select zoom mode in Scatter Plot', fakeAsync(() => {
		spyOn(component, 'changeChartNavigation');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="ChartZoom"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.changeChartNavigation)
		.toHaveBeenCalledTimes(1);
	}));

	it('should select Rotate mode in Scatter Plot', fakeAsync(() => {
		component.dataPoints = [
			{
				position: {
					x: 0.4990452157572191,
					y: -0.06881163915251692,
					z: -0.009611822430886645,
				},
				cluster: 5,
				devices: [
					{
						deviceInfo: {
							deviceId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
							productId: 'WS-C4506-E',
						},
						deviceName: 'C4506-E',
					},
				],
				id: 0,
				mass: 1,
				radius: 1,
				x: 0.4990452157572191,
				y: -0.06881163915251692,
				z: -0.009611822430886645,
			},
			{
				position: {
					x: -0.6855702541560552,
					y: 4.192143103082259,
					z: 1.778192935721556,
				},
				cluster: 5,
				devices: [
					{
						deviceInfo: {
							deviceId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
							productId: 'WS-C4506-E',
						},
						deviceName: 'c4500',
					},
				],
				id: 1,
				mass: 1,
				radius: 1,
				x: -0.6855702541560552,
				y: 4.192143103082259,
				z: 1.778192935721556,
			},
		];
		component.buildGraph();
		spyOn(component, 'changeChartNavigation');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="RotateChart"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.changeChartNavigation)
		.toHaveBeenCalledTimes(1);
	}));

});
