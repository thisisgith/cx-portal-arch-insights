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
import { SettingsComponent, SettingsModule } from './settings';
import { PoliciesComponent, PoliciesModule } from './policies';

import { environment } from '@environment';

/**
 * Child routes for Settings Module for lazy loading
 */
const childRoutes: Routes = [
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
const rootUrl = environment.sdpServiceOrigin;

/**
 * Main Settings module
 */
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		ControlPointsModule,
		CuiSidebarModule,
		CuiSpinnerModule,
		CuiGaugeModule,
		CuiLabelsModule,
		SettingsModule,
		PoliciesModule,
		ControlPointsModule.forRoot({ rootUrl }),
	],
})
export class AdminModule { }
