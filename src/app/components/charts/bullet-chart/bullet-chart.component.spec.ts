import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BulletChartComponent } from './bullet-chart.component';
import { Chart, ChartModule } from 'angular-highcharts';
import { BulletChartModule } from '@components';

describe('BulletChartComponent', () => {
	let component: BulletChartComponent;
	let fixture: ComponentFixture<BulletChartComponent>;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				BulletChartModule,
				ChartModule,
				CommonModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BulletChartComponent);
		component = fixture.componentInstance;
		component.seriesData = {
			target: 1000, xLabel: 'Network Devices', y: 850,
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call buildGraph on valid seriesData', () => {
		component.ngOnInit();
		expect(component.chart)
			.toBeDefined();
	});

	it('should not call buildGraph on null seriesData', () => {
		component.seriesData = undefined;
		component.ngOnInit();
		spyOn(component, 'buildGraph');
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(0);
	});

	it('should define chart on buildGraph call', () => {
		component.buildGraph();
		expect(component.chart)
			.toBeDefined();
		expect(component.chart instanceof Chart)
			.toBeTruthy();
	});
	it('Should call ngonchanges method for first time', () => {
		const changes = {
			seriesData: {
				currentValue: { },
				firstChange: true,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		};
		component.ngOnChanges(changes);
		fixture.detectChanges();
		expect(component.chart)
			.toBeDefined();
	});

	it('Should call ngonchanges method second time onwards', () => {
		const changes = {
			seriesData: {
				currentValue: {
					target: 10,
					xLabel: 'Fabrics',
					y: 0,
				},
				firstChange: false,
				isFirstChange: () => false,
				previousValue: { },
			},
		};
		component.ngOnChanges(changes);
		fixture.detectChanges();
		expect(component.chart)
			.toBeDefined();
	});
});
