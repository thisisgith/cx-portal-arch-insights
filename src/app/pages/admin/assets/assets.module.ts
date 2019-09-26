import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminAssetsComponent } from './assets.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { environment } from '@environment';
import { CuiLoaderModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { AssetTotalModule } from './asset-total/asset-total.module';
import { ReachabilityChartModule } from './reachability-chart/reachability-chart.module';
import { AssetToolbarModule } from './asset-toolbar/asset-toolbar.module';
import { AssetTableModule } from './asset-table/asset-table.module';
import { AssetGridModule } from './asset-grid/asset-grid.module';
import { ControlPointsModule } from '@sdp-api';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		AdminAssetsComponent,
	],
	imports: [
		AdminWrapperModule,
		AssetGridModule,
		AssetTableModule,
		AssetToolbarModule,
		AssetTotalModule,
		CommonModule,
		ControlPointsModule.forRoot({ rootUrl }),
		CuiLoaderModule,
		CuiPagerModule,
		I18nPipeModule,
		ReachabilityChartModule,
		RouterModule,
	],
})
export class AdminAssetsModule { }
