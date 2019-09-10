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
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as boost from 'highcharts/modules/boost-canvas';
import * as drag from 'highcharts/modules/draggable-points';
import * as highcharts3d from 'highcharts/highcharts-3d.src';
import { By } from '@angular/platform-browser';
import { scatterPlotDevices } from 'src/environments/mock/crash-prevention/comparisonview';

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
				{ provide: HIGHCHARTS_MODULES, useFactory: () => [boost, drag, highcharts3d] },
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ScatterPlotComponent);
		component = fixture.componentInstance;
		component.dataPoints = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		component.ngOnChanges({
			dataPoints: {
				currentValue: scatterPlotDevices,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		expect(component)
		.toBeTruthy();
	});

	it('should rebuild graph on ngOnChanges', () => {
		spyOn(component, 'updateChart');
		component.ngOnChanges({
			dataPoints: {
				currentValue: scatterPlotDevices,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.updateChart)
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

	it('should updateDevice in the scatter plot', () => {
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
		component.dataPoints = scatterPlotDevices;
		component.buildGraph();
		spyOn(component, 'changeChartNavigation');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="ChartZoom"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.changeChartNavigation)
		.toHaveBeenCalledTimes(1);
	}));

	it('should select the deviceId in the scatter plot', () => {
		spyOn(component, 'updateSelectedDeviceBySearch');
		component.buildGraph();
		component.ngOnInit();
		fixture.whenStable();
		component.ngOnChanges({
			dataPoints: null,
			selectedDevice: {
				currentValue: 'NA,FOX1306GFKH,WS-C4506-E,NA',
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		component.dataPoints = scatterPlotDevices;
		fixture.detectChanges();
		expect(component.updateSelectedDeviceBySearch)
		.toHaveBeenCalled();
	});

	it('should register mouse events after view init', () => {
		component.buildGraph();
		component.ngOnChanges({
			dataPoints: null,
			selectedDevice: {
				currentValue: 'NA,FOX1306GFKH,WS-C4506-E,NA',
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		spyOn(component, 'register');
		component.ngAfterViewInit();
		fixture.detectChanges();
		expect(component.register)
		.toHaveBeenCalled();
	});

	it('should select rotate mode in Scatter Plot', fakeAsync(() => {
		component.dataPoints = scatterPlotDevices;
		spyOn(component, 'changeChartNavigation');
		fixture.detectChanges();
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="RotateChart"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.chart.ref.options.chart.zoomType)
		.toBeUndefined();
	}));

});
