import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { TimeSeriesChartComponent } from './time-series-chart.component';
import { TimeSeriesChartModule } from './time-series-chart.module';

/**
 * Wrapper component for testing chart
 */
@Component({
	template: `
		<time-series-chart [loading]="loading"></time-series-chart>
	`,
})
class WrapperComponent {
	@ViewChild(TimeSeriesChartComponent,
		 { static: true }) public timeSeriesChart: TimeSeriesChartComponent;
	public seriesData = [{
		label: 'a',
		value: 1,
	}];
	public loading = true;
}

describe('TimeSeriesChartComponent', () => {
	let fixture: ComponentFixture<WrapperComponent>;
	let wrapperComponent: WrapperComponent;
	let component: TimeSeriesChartComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [TimeSeriesChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = wrapperComponent.timeSeriesChart;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build the chart when series data is set if it does not exist', () => {
		component.chart = null;
		fixture.detectChanges();
		wrapperComponent.seriesData = [{
			label: 'a',
			value: 1,
		}];
		fixture.detectChanges();
		expect(component.chart)
			.toBeNull();
	});
});
