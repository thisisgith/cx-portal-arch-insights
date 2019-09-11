import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletChartComponent } from './bullet-chart.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as bullet from 'highcharts/modules/bullet.src';

/**
 * Module representing the Pie chart component
 */
@NgModule({
	declarations: [BulletChartComponent],
	exports: [BulletChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
	providers: [
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [bullet] },
	],
})
export class BulletChartModule { }
