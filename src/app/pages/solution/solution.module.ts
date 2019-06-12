import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';
import { AssetDetailsModule } from './assets/details/details.module';
import { RacetrackModule, RacetrackContentModule, SdpApiModule } from '@cui-x/sdp-api';
import { environment } from '@environment';
import { DetailsHeaderModule } from './assets/details-header/details-header.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpOrigin;

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	exports: [SolutionComponent],
	imports: [
		AssetDetailsModule,
		DetailsHeaderModule,
		CommonModule,
		CuiGaugeModule,
		I18nPipeModule,
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		SdpApiModule,
		SolutionRoutingModule,
	],
})
export class SolutionModule { }
