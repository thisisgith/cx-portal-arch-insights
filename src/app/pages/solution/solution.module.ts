import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';
import { AssetDetailsModule } from './assets/details/details.module';
import {
	ContractsModule,
	RacetrackModule,
	RacetrackContentModule,
	InventoryModule,
} from '@cui-x/sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.services.sdp.origin;

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	exports: [SolutionComponent],
	imports: [
		AssetDetailsModule,
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
