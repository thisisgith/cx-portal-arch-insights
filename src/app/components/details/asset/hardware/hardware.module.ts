import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsHardwareComponent } from './hardware.component';
import {
	CuiLoaderModule,
	CuiDrawersModule,
	CuiDrawerModule,
	CuiTableModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { TimelineModule } from '../../../timeline/timeline.module';
import { ProductAlertsModule, InventoryModule } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Hardware Details Component */
@NgModule({
	declarations: [AssetDetailsHardwareComponent],
	exports: [AssetDetailsHardwareComponent],
	imports: [
		CommonModule,
		CuiDrawerModule,
		CuiDrawersModule,
		CuiLoaderModule,
		CuiTableModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
		TimelineModule,
	],
})
export class AssetDetailsHardwareModule { }
