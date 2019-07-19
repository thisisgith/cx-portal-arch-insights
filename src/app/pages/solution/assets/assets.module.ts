import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { I18nPipeModule, FromNowPipeModule, TruncatePipeModule } from '@cisco-ngx/cui-pipes';
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
import { AssetDetailsModule } from './details/details.module';
import { DetailsHeaderModule } from './details/details-header/details-header.module';
import { Panel360Module } from '@components';
import { DetailsHardwareModule } from './details/details-hardware/details-hardware.module';

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
		AssetDetailsModule,
		AssetsPieChartModule,
		CommonModule,
		ContractsModule.forRoot({ rootUrl }),
		CuiDropdownModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		DetailsHeaderModule,
		DetailsHardwareModule,
		FormsModule,
		FromNowPipeModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		Panel360Module,
		ProductAlertsModule.forRoot({ rootUrl }),
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
		TruncatePipeModule,
	],
})
export class AssetsModule { }
