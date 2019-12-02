import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsHardwareComponent } from './hardware.component';
import {
	CuiLoaderModule,
	CuiDrawersModule,
	CuiDrawerModule,
	CuiTableModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { TimelineModule } from '../../../timeline/timeline.module';
import { ProductAlertsModule } from '@sdp-api';
import { environment } from '@environment';
import { AssetsPipeModule } from '@pipes';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Hardware Details Component */
@NgModule({
	declarations: [AssetDetailsHardwareComponent],
	exports: [AssetDetailsHardwareComponent],
	imports: [
		AssetsPipeModule,
		CommonModule,
		CuiDrawerModule,
		CuiDrawersModule,
		CuiLoaderModule,
		CuiTableModule,
		FromNowPipeModule,
		I18nPipeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
		TimelineModule,
	],
})
export class AssetDetailsHardwareModule { }
