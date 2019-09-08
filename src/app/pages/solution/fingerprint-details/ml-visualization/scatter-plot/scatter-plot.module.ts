import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterPlotComponent } from './scatter-plot.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as boost from 'highcharts/modules/boost-canvas';
import * as drag from 'highcharts/modules/draggable-points';

/**
 * scatter-plot Module
 */
@NgModule({
	declarations: [ScatterPlotComponent],
	imports: [
		CommonModule,
		ChartModule,
		I18nPipeModule,
	],
	exports: [ScatterPlotComponent],
	entryComponents: [ScatterPlotComponent],
	providers: [
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [boost, drag] },
	],
})
export class ScatterPlotModule { }
