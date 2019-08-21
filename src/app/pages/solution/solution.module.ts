import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule, CuiSpinnerModule, CuiModalModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';
import {
	ContractsModule,
	RacetrackModule,
	RacetrackContentModule,
	InventoryModule,
} from '@sdp-api';
import { environment } from '@environment';
import { BarChartModule, CaseModule, QuickTourModule } from '@components';
import { NoDNACHeaderModule } from './no-dnac-header/no-dnac-header.module';

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
		CommonModule,
		CaseModule,
		ContractsModule.forRoot({ rootUrl }),
		CuiGaugeModule,
		CuiModalModule,
		I18nPipeModule,
		CuiSpinnerModule,
		InventoryModule.forRoot({ rootUrl }),
		NoDNACHeaderModule,
		QuickTourModule,
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		SolutionRoutingModule,
	],
})
export class SolutionModule { }
