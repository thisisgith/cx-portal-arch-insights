import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BarChartComponent } from './bar-chart.component';
import { BarChartModule } from './bar-chart.module';

/**
 * Wrapper component for testing chart
 */
@Component({
	template: `
		<bar-chart [loading]="loading" [seriesData]="seriesData"></bar-chart>
	`,
})
class WrapperComponent {
	@ViewChild(BarChartComponent, { static: true }) public barChart: BarChartComponent;
	public seriesData = [{
		label: 'a',
		value: 1,
	}];
	public loading = true;
}

describe('BarChartComponent', () => {
	let fixture: ComponentFixture<WrapperComponent>;
	let wrapperComponent: WrapperComponent;
	let component: BarChartComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [BarChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = wrapperComponent.barChart;
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
		wrapperComponent.seriesData = [{
			label: 'a',
			value: 1,
		}];
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
		wrapperComponent.seriesData = [{
			label: 'b',
			value: 2,
		}];
		wrapperComponent.loading = false;
		fixture.detectChanges();
		expect(component.chart.ref.series[0].data[0].y)
			.toBe(2);
		expect(component.loading)
			.toBeFalsy();
	});

	it('should emit the selected subfilter', () => {
		const spy = spyOn(component.subfilter, 'emit');
		component.selectSubfilter({
			point: {
				name: 'a',
			},
			stopPropagation: () => true,
		});
		(<any> expect(spy))
			.toHaveBeenCalledWith(wrapperComponent.seriesData[0]);
	});
});
