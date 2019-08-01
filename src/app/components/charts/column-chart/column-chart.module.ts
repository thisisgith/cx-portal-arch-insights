import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartComponent } from './column-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Column chart component
 */
@NgModule({
	declarations: [ColumnChartComponent],
	exports: [ColumnChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class ColumnChartModule { }
