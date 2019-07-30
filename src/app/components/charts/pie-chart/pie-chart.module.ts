import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Pie chart component
 */
@NgModule({
	declarations: [PieChartComponent],
	exports: [PieChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class PieChartModule { }
