import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Bar Chart component
 */
@NgModule({
	declarations: [BarChartComponent],
	exports: [BarChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class BarChartModule { }
