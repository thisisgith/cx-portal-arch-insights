import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RccComponent } from './rcc.component';
import {
	RccAssetViolationDetailsComponent,
} from './rcc-asset-violation-details/rcc-asset-violation-details.component';
import { RouterModule, Routes } from '@angular/router';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSearchModule,
	CuiTabsModule,
	CuiSelectModule,
	CuiDropdownModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import {
	RccAssetViolationDetailsModule,
} from './rcc-asset-violation-details/rcc-asset-violation-details.module';
import {
	RccDeviceViolationDetailsModule,
} from './rcc-device-violation-details/rcc-device-violation-details.module';
import { PieChartModule, DetailsPanelModule } from '@components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RccDataModule } from '@sdp-api';
import { environment } from '@environment';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;
/**
 * Child routes for RCC Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: RccComponent,
		path: '',
	},
];

/**
 * Module representing Rcc track
 */
@NgModule({
	declarations: [RccComponent],
	entryComponents: [RccAssetViolationDetailsComponent],
	imports: [
		CommonModule,
		PieChartModule,
		RccAssetViolationDetailsModule,
		RccDeviceViolationDetailsModule,
		CuiTableModule,
		CuiPagerModule,
		RccDataModule.forRoot({ rootUrl }),
		RouterModule.forChild(childRoutes),
		CuiSearchModule,
		I18nPipeModule,
		FromNowPipeModule,
		CuiTabsModule,
		DetailsPanelModule,
		CuiSelectModule,
		FormsModule,
		ReactiveFormsModule,
		CuiDropdownModule,
		CuiSpinnerModule,
	],
})
export class RccModule { }
