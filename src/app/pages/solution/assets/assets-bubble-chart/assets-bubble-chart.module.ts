import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsBubbleChartComponent } from './assets-bubble-chart.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';

/**
 * Module representing the bubble chart component for the Assets Page
 */
@NgModule({
	declarations: [AssetsBubbleChartComponent],
	exports: [AssetsBubbleChartComponent],
	imports: [
		CommonModule,
		ChartModule,
	],
	providers: [
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [more] },
	],
})
export class AssetsBubbleChartModule { }
