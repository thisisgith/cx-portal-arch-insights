import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsSoftwareComponent } from './software.component';
import {
	CuiLoaderModule,
	CuiDrawersModule,
	CuiDrawerModule,
	CuiTableModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { TimelineModule } from '../../../timeline/timeline.module';
import { ProductAlertsModule, InventoryModule, ControlPointsModule } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/** Module representing the Software Details Component */
@NgModule({
	declarations: [AssetDetailsSoftwareComponent],
	exports: [AssetDetailsSoftwareComponent],
	imports: [
		CommonModule,
		CuiDrawerModule,
		CuiDrawersModule,
		CuiLoaderModule,
		CuiTableModule,
		I18nPipeModule,
		ControlPointsModule.forRoot({ rootUrl }),
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
		TimelineModule,
	],
})
export class AssetDetailsSoftwareModule { }
