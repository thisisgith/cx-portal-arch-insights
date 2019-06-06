import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	RouterModule,
	Routes,
} from '@angular/router';
import { AssetsComponent } from './assets.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTableModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { InventoryModule } from '@cui-x/sdp-api';
import { environment } from '@environment';
import { AssetsPieChartModule } from './assets-pie-chart/assets-pie-chart.module';
import { AssetsBarChartModule } from './assets-bar-chart/assets-bar-chart.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpOrigin;

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AssetsComponent,
		path: '',
	},
];

/**
 * Module representing the Assets component of the Solution Page
 */
@NgModule({
	declarations: [AssetsComponent],
	imports: [
		AssetsBarChartModule,
		AssetsPieChartModule,
		CommonModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		RouterModule.forChild(childRoutes),
	],
})
export class AssetsModule { }
