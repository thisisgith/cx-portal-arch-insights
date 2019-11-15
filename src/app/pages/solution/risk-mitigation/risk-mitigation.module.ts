import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RiskMitigationComponent } from './risk-mitigation.component';
import {
	 AssetDetailsModule,
	 DetailsPanelModule,
	 VisualFilterBarModule,
	 TooltipModule,
	 PieChartModule,
	 AssetDetailsHeaderModule,
	 } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiSearchModule,
	CuiIconModule,
	CuiDropdownModule,
	CuiTableModule,
	CuiPagerModule,
	CuiProgressbarModule,
	CuiSpinnerModule,
	CuiLoaderModule,
} from '@cisco-ngx/cui-components';
import {
	RiskMitigationColumnChartModule,
} from './risk-mitigation-column-chart/risk-mitigation-column-chart.module';
import { RMModule } from '@sdp-api';
import { environment } from '@environment';
import {
	FingerprintHeaderModule,
} from '../fingerprint-details/fingerprint-header/fingerprint-header.module';
import {
	FingerprintBodyModule ,
} from '../fingerprint-details/fingerprint-body/fingerprint-body.module';
import { FingerprintDetailsModule } from '../fingerprint-details/fingerprint-details.module';
import { InsightTabsModule } from 'src/app/components/insight-tabs/insight-tabs.module';
import { CrashedSystemsGridModule } from './crashed-systems-grid/crashed-systems-grid.module';
import { CrashRiskGridModule } from './crash-risk-grid/crash-risk-grid.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: RiskMitigationComponent,
		path: '',
	},
];

/**
 * Module representing the Risk Mitigation component of the Solution Page
 */
@NgModule({
	declarations: [RiskMitigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		DetailsPanelModule,
		RouterModule.forChild(childRoutes),
		CuiTabsModule,
		RiskMitigationColumnChartModule,
		I18nPipeModule,
		RMModule.forRoot({ rootUrl }),
		CuiTableModule,
		CuiPagerModule,
		CuiSearchModule,
		CuiIconModule,
		CuiDropdownModule,
		CuiLoaderModule,
		CuiProgressbarModule,
		AssetDetailsModule,
		AssetDetailsHeaderModule,
		CuiSpinnerModule,
		FingerprintDetailsModule,
		FingerprintHeaderModule,
		FingerprintBodyModule,
		VisualFilterBarModule,
		InsightTabsModule,
		TooltipModule,
		PieChartModule,
		CrashRiskGridModule,
		CrashedSystemsGridModule,
	],
})
export class RiskMitigationModule { }
