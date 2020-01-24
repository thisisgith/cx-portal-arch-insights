import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RccComponent } from './rcc.component';
import {
	RccAssetViolationDetailsComponent,
} from './rcc-asset-violation-details/rcc-asset-violation-details.component';
import { RouterModule, Routes } from '@angular/router';
import { DateTimePipeModule } from '@pipes';
import { NoDNACHeaderModule } from '../no-dnac-header/no-dnac-header.module';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSearchModule,
	CuiTabsModule,
	CuiSelectModule,
	CuiDropdownModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { SharedModule } from 'src/app/shared/shared.module';
import {
	RccAssetViolationDetailsModule,
} from './rcc-asset-violation-details/rcc-asset-violation-details.module';
import {
	RccDeviceViolationDetailsModule,
} from './rcc-device-violation-details/rcc-device-violation-details.module';
import { PieChartModule,
		DetailsPanelModule,
		VisualFilterBarModule,
		AssetDetailsModule,
		TooltipModule,
	} from '@components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RccDataModule } from '@sdp-api';
import { environment } from '@environment';
import { InsightTabsModule } from 'src/app/components/insight-tabs/insight-tabs.module';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;
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
	declarations: [
		RccComponent,
	],
	entryComponents: [RccAssetViolationDetailsComponent],
	imports: [
		CommonModule,
		PieChartModule,
		RccAssetViolationDetailsModule,
		RccDeviceViolationDetailsModule,
		CuiAlertModule,
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
		VisualFilterBarModule,
		AssetDetailsModule,
		InsightTabsModule,
		TooltipModule,
		NoDNACHeaderModule,
		DateTimePipeModule,
		SharedModule,
	],
})
export class RccModule { }
