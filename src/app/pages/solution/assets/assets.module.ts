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
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import {
	InventoryModule,
	ContractsModule,
	ProductAlertsModule,
	NetworkDataGatewayModule,
} from '@sdp-api';
import { environment } from '@environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	AssetDetailsModule,
	DetailsPanelModule,
	BarChartModule,
	PieChartModule,
	BubbleChartModule,
	VisualFilterBarModule,
} from '@components';
import { InlineSVGModule } from 'ng-inline-svg';
import { DateTimePipeModule } from '@pipes';
import { NoDNACHeaderModule } from '../no-dnac-header/no-dnac-header.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

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
		CuiAlertModule,
		CuiDropdownModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		DateTimePipeModule,
		DetailsPanelModule,
		FormsModule,
		FromNowPipeModule,
		I18nPipeModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
		InventoryModule.forRoot({ rootUrl }),
		NetworkDataGatewayModule.forRoot({ rootUrl }),
		NoDNACHeaderModule,
		PieChartModule,
		ProductAlertsModule.forRoot({ rootUrl }),
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
		TruncatePipeModule,
		VisualFilterBarModule,
	],
})
export class AssetsModule { }
