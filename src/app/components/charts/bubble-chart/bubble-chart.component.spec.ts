import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BubbleChartComponent } from './bubble-chart.component';
import { BubbleChartModule } from './bubble-chart.module';

/**
 * Wrapper component for testing chart
 */
@Component({
	template: `
		<bubble-chart [loading]="loading" [seriesData]="seriesData"></bubble-chart>
	`,
})
class WrapperComponent {
	@ViewChild(BubbleChartComponent, { static: true }) public bubbleChart: BubbleChartComponent;
	public seriesData = [{
		label: 'a',
		value: 1,
	}];
	public loading = true;
}

describe('BubbleChartComponent', () => {
	let fixture: ComponentFixture<WrapperComponent>;
	let wrapperComponent: WrapperComponent;
	let component: BubbleChartComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [BubbleChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = wrapperComponent.bubbleChart;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build the chart on init if the component has seriesData', () => {
		expect(component.chart.ref.series[0].data[0].value)
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
		expect(component.chart.ref.series[0].data[0].value)
			.toBe(1);
		expect(component.loading)
			.toBeTruthy();
		wrapperComponent.seriesData = [{
			label: 'b',
			value: 2,
		}];
		wrapperComponent.loading = false;
		fixture.detectChanges();
		expect(component.chart.ref.series[0].data[0].value)
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
		expect(spy)
			.toHaveBeenCalledWith(wrapperComponent.seriesData[0]);
	});
});
