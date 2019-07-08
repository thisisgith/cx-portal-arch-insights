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
	CuiDropdownModule,
} from '@cisco-ngx/cui-components';
import { InventoryModule, ContractsModule, ProductAlertsModule } from '@sdp-api';
import { environment } from '@environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetsPieChartModule } from './assets-pie-chart/assets-pie-chart.module';
import { AssetsBarChartModule } from './assets-bar-chart/assets-bar-chart.module';
import { AssetsBubbleChartModule } from './assets-bubble-chart/assets-bubble-chart.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

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
		AssetsBubbleChartModule,
		AssetsPieChartModule,
		CommonModule,
		ContractsModule.forRoot({ rootUrl }),
		CuiDropdownModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		FormsModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
	],
})
export class AssetsModule { }
