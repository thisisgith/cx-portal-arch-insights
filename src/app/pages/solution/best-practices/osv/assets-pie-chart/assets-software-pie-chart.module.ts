import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsSoftwarePieChartComponent } from './assets-software-pie-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Pie chart component for the Assets Page
 */
@NgModule({
	declarations: [AssetsSoftwarePieChartComponent],
	exports: [AssetsSoftwarePieChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class AssetsSoftwarePieChartModule { }
