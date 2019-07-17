import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsPieChartComponent } from './assets-pie-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Pie chart component for the Assets Page
 */
@NgModule({
	declarations: [AssetsPieChartComponent],
	exports: [AssetsPieChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class AssetsPieChartModule { }
