import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsSummaryComponent } from './summary.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiLoaderModule, CuiAlertModule } from '@cisco-ngx/cui-components';
import { InventoryModule, AssetTaggingModules } from '@sdp-api';
import { environment } from '@environment';
import { AssetMapModule } from '../map/asset-map.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Asset Details Component */
@NgModule({
	declarations: [
		AssetDetailsSummaryComponent,
	],
	exports: [
		AssetDetailsSummaryComponent,
	],
	imports: [
		AssetMapModule,
		CommonModule,
		CuiAlertModule,
		CuiLoaderModule,
		CuiTabsModule,
		I18nPipeModule,
		AssetTaggingModules.forRoot({ rootUrl }),
		InventoryModule.forRoot({ rootUrl }),
	],
})
export class AssetDetailsSummaryModule { }
