import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiLoaderModule, CuiAlertModule } from '@cisco-ngx/cui-components';
import { AssetDetailsHeaderModule } from './header/header.module';
import { AssetDetailsAdvisoriesModule } from './advisories/advisories.module';
import { AssetDetailsHardwareModule } from './hardware/hardware.module';
import { AssetDetailsSoftwareModule } from './software/software.module';
import { AssetDetailsSummaryModule } from './summary/summary.module';
import { DetailsPanelModule } from '../panel/details-panel.module';
import { environment } from '@environment';
import { InventoryModule } from '@sdp-api';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Asset Details Component */
@NgModule({
	declarations: [
		AssetDetailsComponent,
	],
	exports: [
		AssetDetailsComponent,
	],
	imports: [
		AssetDetailsAdvisoriesModule,
		AssetDetailsHardwareModule,
		AssetDetailsHeaderModule,
		AssetDetailsSoftwareModule,
		AssetDetailsSummaryModule,
		CommonModule,
		CuiAlertModule,
		CuiLoaderModule,
		CuiTabsModule,
		DetailsPanelModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
	],
})
export class AssetDetailsModule { }
