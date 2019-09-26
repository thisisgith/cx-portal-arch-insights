import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReachabilityChartComponent } from './reachability-chart.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * SDP Root url for the apis
 */
// const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		ReachabilityChartComponent,
	],
	exports: [
		ReachabilityChartComponent,
	],
	imports: [
		CommonModule,
		CuiLoaderModule,
		I18nPipeModule,
		RouterModule,
	],
})
export class ReachabilityChartModule { }
