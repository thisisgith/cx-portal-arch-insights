import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiLoaderModule } from '@cisco-ngx/cui-components';
import { CaseService } from '@cui-x/services';
import { AssetDetailsHeaderModule } from './header/header.module';
import { TimelineModule } from '../../timeline/timeline.module';
import { AssetDetailsAdvisoriesModule } from './advisories/advisories.module';
import { AssetDetailsHardwareModule } from './hardware/hardware.module';
import { InventoryModule } from '@sdp-api';
import { environment } from '@environment';
import { AssetDetailsSoftwareModule } from './software/software.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/** Module representing the Asset Details Component */
@NgModule({
	declarations: [
		AssetDetailsComponent,
	],
	exports: [
		AssetDetailsComponent,
		AssetDetailsHeaderModule,
	],
	imports: [
		AssetDetailsAdvisoriesModule,
		AssetDetailsHardwareModule,
		AssetDetailsHeaderModule,
		AssetDetailsSoftwareModule,
		CommonModule,
		CuiLoaderModule,
		CuiTabsModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		TimelineModule,
	],
	providers: [
		CaseService,
	],
})
export class AssetDetailsModule { }
