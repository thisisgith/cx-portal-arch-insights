import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { ColumnChartComponent } from './column-chart.component';
import { ColumnChartModule } from './column-chart.module';

/**
 * Wrapper component for testing chart
 */
@Component({
	template: `
		<column-chart [loading]="loading" [seriesData]="seriesData"></column-chart>
	`,
})
class WrapperComponent {
	@ViewChild(ColumnChartComponent, { static: true }) public columnChart: ColumnChartComponent;
	public seriesData = [{
		label: 'a',
		value: 1,
	}];
	public loading = true;
}

describe('ColumnChartComponent', () => {
	let fixture: ComponentFixture<WrapperComponent>;
	let wrapperComponent: WrapperComponent;
	let component: ColumnChartComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [ColumnChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = wrapperComponent.columnChart;
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
