import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleChartComponent } from './bubble-chart.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';

/**
 * Module representing the bubble chart component
 */
@NgModule({
	declarations: [BubbleChartComponent],
	exports: [BubbleChartComponent],
	imports: [
		CommonModule,
		ChartModule,
	],
	providers: [
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [more] },
	],
})
export class BubbleChartModule { }
