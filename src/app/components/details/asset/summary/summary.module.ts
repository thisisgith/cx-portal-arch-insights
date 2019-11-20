import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsSummaryComponent } from './summary.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiLoaderModule, CuiAlertModule } from '@cisco-ngx/cui-components';
import { AssetTaggingModules, NetworkDataGatewayModule } from '@sdp-api';
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
		AssetTaggingModules.forRoot({ rootUrl }),
		CommonModule,
		CuiAlertModule,
		CuiLoaderModule,
		CuiTabsModule,
		FromNowPipeModule,
		I18nPipeModule,
		NetworkDataGatewayModule.forRoot({ rootUrl }),
	],
})
export class AssetDetailsSummaryModule { }
