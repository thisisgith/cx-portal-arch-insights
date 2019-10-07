import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
	CuiSidebarModule,
	CuiSpinnerModule,
	CuiGaugeModule,
	CuiLabelsModule,
} from '@cisco-ngx/cui-components';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ControlPointsModule } from '@sdp-api';
import { AdminAssetsComponent, AdminAssetsModule } from './assets';
import { SettingsComponent, SettingsModule } from './settings';
import { PoliciesComponent, PoliciesModule } from './policies';

import { environment } from '@environment';

/**
 * Child routes for Settings Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AdminAssetsComponent,
		path: 'assets',
	},
	{
		component: SettingsComponent,
		path: 'settings',
	},
	{
		component: PoliciesComponent,
		path: 'policies',
	},
	{
		component: PoliciesComponent,
		path: 'policies',
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'settings',
	},
];

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Main Settings module
 */
@NgModule({
	imports: [
		AdminAssetsModule,
		CommonModule,
		ControlPointsModule,
		ControlPointsModule.forRoot({ rootUrl }),
		CuiGaugeModule,
		CuiLabelsModule,
		CuiSidebarModule,
		CuiSpinnerModule,
		I18nPipeModule,
		PoliciesModule,
		RouterModule.forChild(childRoutes),
		SettingsModule,
	],
})
export class AdminModule { }
