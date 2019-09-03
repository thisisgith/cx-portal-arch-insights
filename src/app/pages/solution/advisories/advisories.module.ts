import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisoriesComponent } from './advisories.component';
import {
	DetailsPanelModule,
	PieChartModule,
	ColumnChartModule,
	AdvisoryDetailsModule,
	VisualFilterBarModule,
} from '@components';
import { RouterModule, Routes } from '@angular/router';
import {
	CuiTableModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductAlertsModule, DiagnosticsModule } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Child routes for Advisories Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AdvisoriesComponent,
		path: '',
	},
];

/**
 * Module representing the Advisories component of the Solution Page
 */
@NgModule({
	declarations: [AdvisoriesComponent],
	imports: [
		AdvisoryDetailsModule,
		ColumnChartModule,
		CommonModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		DetailsPanelModule,
		DiagnosticsModule.forRoot({ rootUrl }),
		FormsModule,
		FromNowPipeModule,
		I18nPipeModule,
		PieChartModule,
		ProductAlertsModule.forRoot({ rootUrl }),
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
		VisualFilterBarModule,
	],
})
export class AdvisoriesModule { }
