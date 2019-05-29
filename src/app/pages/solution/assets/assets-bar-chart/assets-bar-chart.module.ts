import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsBarChartComponent } from './assets-bar-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Bar Chart component for the Assets page
 */
@NgModule({
	declarations: [AssetsBarChartComponent],
	exports: [AssetsBarChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class AssetsBarChartModule { }
