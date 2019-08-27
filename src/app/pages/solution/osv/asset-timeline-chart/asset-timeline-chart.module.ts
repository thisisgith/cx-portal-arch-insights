import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTimelineChartComponent } from './asset-timeline-chart.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as timeline from 'highcharts/modules/timeline.src';

/**
 * AssetTimelineChart Module
 */
@NgModule({
	declarations: [AssetTimelineChartComponent],
	exports: [AssetTimelineChartComponent],
	imports: [
		CommonModule,
		ChartModule,
	],
	providers: [
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [more, timeline] },
	],
})
export class AssetTimelineChartModule { }
