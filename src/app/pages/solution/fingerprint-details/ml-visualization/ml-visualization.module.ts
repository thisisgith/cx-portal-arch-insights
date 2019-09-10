import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MlVisualizationComponent } from './ml-visualization.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as highcharts3d from 'highcharts/highcharts-3d.src';
import { CrashPreventionModule } from '@sdp-api';
import { environment } from '@environment';
import { CuiSelectModule, CuiLoaderModule } from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScatterPlotModule } from './scatter-plot/scatter-plot.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * mlvisualizationComponent
 */
@NgModule({
	declarations: [MlVisualizationComponent],
	imports: [
		CommonModule,
		ChartModule,
		ScatterPlotModule,
		CuiSelectModule,
		CrashPreventionModule.forRoot({ rootUrl }),
		CuiLoaderModule,
		FormsModule,
		ReactiveFormsModule,
		I18nPipeModule,
	],
	exports: [MlVisualizationComponent],
	providers: [
		{ provide: HIGHCHARTS_MODULES, useFactory: () =>
			[highcharts3d] }, // add as factory to your providers
	  ],
	  entryComponents: [MlVisualizationComponent],
})
export class MlVisualizationModule { }
