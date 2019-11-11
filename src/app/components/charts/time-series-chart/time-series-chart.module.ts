import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSeriesChartComponent } from './time-series-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Bar Chart component
 */
@NgModule({
	declarations: [TimeSeriesChartComponent],
	exports: [TimeSeriesChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class TimeSeriesChartModule { }
