import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import {
	CuiGaugeModule,
	CuiSpinnerModule,
	CuiModalModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
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
import { A11yTitleComponent } from '@components/common/a11y-title.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AtxWatchModalComponent } from './lifecycle/atx-watch-modal/atx-watch-modal.component';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent, AtxWatchModalComponent, A11yTitleComponent],
	entryComponents: [AtxWatchModalComponent],
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
		SharedModule,
		CuiAlertModule,
	],
})
export class SolutionModule { }
