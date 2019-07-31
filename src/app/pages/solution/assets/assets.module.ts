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
import {
	AssetDetailsModule,
	DetailsPanelModule,
	BarChartModule,
	PieChartModule,
	BubbleChartModule,
} from '@components';

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
		AssetDetailsModule,
		BarChartModule,
		BubbleChartModule,
		CommonModule,
		ContractsModule.forRoot({ rootUrl }),
		CuiDropdownModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		DetailsPanelModule,
		FormsModule,
		FromNowPipeModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		PieChartModule,
		ProductAlertsModule.forRoot({ rootUrl }),
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
		TruncatePipeModule,
	],
})
export class AssetsModule { }
