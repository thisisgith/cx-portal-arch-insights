import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BulletChartComponent } from './bullet-chart.component';
import { BulletChartModule } from './bullet-chart.module';

/**
 * Wrapper component for testing chart
 */
@Component({
	template: `
		<bullet-chart [loading]="loading" [seriesData]="seriesData"></bullet-chart>
	`,
})
class WrapperComponent {
	@ViewChild(BulletChartComponent, { static: true }) public bulletChart: BulletChartComponent;
	public seriesData = {
		target: 'target',
		xlabel: 'a',
		y: 1,
	};
	public loading = true;
}

describe('BulletChartComponent', () => {
	let fixture: ComponentFixture<WrapperComponent>;
	let wrapperComponent: WrapperComponent;
	let component: BulletChartComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [BulletChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = wrapperComponent.bulletChart;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build the chart on init if the component has seriesData', () => {
		expect(component.chart.ref.series[0].data[0].y)
			.toBe(1);
	});

	it('should build the chart when series data is set if it does not exist', () => {
		component.chart = null;
		fixture.detectChanges();
		wrapperComponent.seriesData = {
			target: 'target',
			xlabel: 'a',
			y: 1,
		};
		fixture.detectChanges();
		expect(component.chart)
			.not
			.toBeNull();
	});

	it('should update the chart on changes', () => {
		expect(component.chart.ref.series[0].data[0].y)
			.toBe(1);
		expect(component.loading)
			.toBeTruthy();
		wrapperComponent.seriesData = {
			target: 'target2',
			xlabel: 'b',
			y: 2,
		};
		wrapperComponent.loading = false;
		fixture.detectChanges();
		expect(component.chart.ref.series[0].data[0].y)
			.toBe(2);
		expect(component.loading)
			.toBeFalsy();
	});
});
