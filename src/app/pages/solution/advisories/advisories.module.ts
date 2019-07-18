import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisoriesComponent } from './advisories.component';
import { Panel360Module } from '@components';
import { RouterModule, Routes } from '@angular/router';
import {
	CuiTableModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductAlertsModule } from '@sdp-api';
import { environment } from '@environment';
import { AssetsPieChartModule } from '../assets/assets-pie-chart/assets-pie-chart.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

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
		AssetsPieChartModule,
		CommonModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		FormsModule,
		FromNowPipeModule,
		I18nPipeModule,
		Panel360Module,
		ProductAlertsModule.forRoot({ rootUrl }),
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
	],
})
export class AdvisoriesModule { }
