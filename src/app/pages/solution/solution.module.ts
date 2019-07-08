import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';
import {
	ContractsModule,
	RacetrackModule,
	RacetrackContentModule,
	InventoryModule,
} from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	exports: [SolutionComponent],
	imports: [
		CommonModule,
		ContractsModule.forRoot({ rootUrl }),
		CuiGaugeModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		SolutionRoutingModule,
	],
})
export class SolutionModule { }
