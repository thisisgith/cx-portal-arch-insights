import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { PieChartComponent } from './pie-chart.component';
import { PieChartModule } from './pie-chart.module';

/**
 * Wrapper component for testing chart
 */
@Component({
	template: `
		<pie-chart [loading]="loading" [seriesData]="seriesData"></pie-chart>
	`,
})
class WrapperComponent {
	@ViewChild(PieChartComponent, { static: true }) public pieChart: PieChartComponent;
	public seriesData = [{
		label: 'a',
		value: 1,
	}];
	public loading = true;
}

describe('PieChartComponent', () => {
	let fixture: ComponentFixture<WrapperComponent>;
	let wrapperComponent: WrapperComponent;
	let component: PieChartComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [PieChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = wrapperComponent.pieChart;
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
