import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetTableComponent } from './asset-table.component';
import { ReachabilityStatusColorPipe } from './reachability-status-color.pipe';

import { FromNowPipeModule, I18nPipeModule, TruncatePipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * SDP Root url for the apis
 */
// const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		AssetTableComponent,
		ReachabilityStatusColorPipe,
	],
	exports: [
		AssetTableComponent,
	],
	imports: [
		CommonModule,
		CuiLoaderModule,
		FromNowPipeModule,
		I18nPipeModule,
		RouterModule,
		TruncatePipeModule,
	],
})
export class AssetTableModule { }
