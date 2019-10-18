import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule, CuiSpinnerModule, CuiModalModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';
import {
	ContractsModule,
	RacetrackModule,
	RacetrackContentModule,
	InventoryModule,
	InsightsCrashesModule,
	ProductAlertsModule,
	DiagnosticsModule,
} from '@sdp-api';
import { environment } from '@environment';
import {
	BarChartModule,
	CaseModule,
	QuickTourModule,
	GaugeModule,
	MultiGaugeModule,
} from '@components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	exports: [SolutionComponent],
	imports: [
		BarChartModule,
		CaseModule,
		CommonModule,
		ContractsModule.forRoot({ rootUrl }),
		CuiGaugeModule,
		CuiModalModule,
		CuiSpinnerModule,
		CuiSpinnerModule,
		DiagnosticsModule.forRoot({ rootUrl }),
		GaugeModule,
		I18nPipeModule,
		I18nPipeModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
		InventoryModule.forRoot({ rootUrl }),
		MultiGaugeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
		QuickTourModule,
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		InsightsCrashesModule.forRoot({ rootUrl }),
		SolutionRoutingModule,
	],
})
export class SolutionModule { }
