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
import { ControlPointsModule, CanDeactivateGuard } from '@sdp-api';
import { AdminAssetsComponent, AdminAssetsModule } from './assets';
import { SettingsComponent, SettingsModule } from './settings';
import { PoliciesComponent, PoliciesModule } from './policies';
import { UsersComponent, UsersModule } from './users';
import { AdminComplienceComponent, AdminComplienceModule } from './complience';
import { ChangePasswordComponent, ChnagePasswordModule } from './change-password';
import { ChangeDNACCredentialsComponent, ChangeDNACCredentialsModule } from './change-dnac-credentials';
import { environment } from '@environment';
import { RouteGuard } from './route-guard';
/**
 * Child routes for Settings Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AdminAssetsComponent,
		path: 'assets',
	},
	{
		canActivate: [RouteGuard],
		component: AdminComplienceComponent,
		path: 'compliance',
		canDeactivate: [CanDeactivateGuard],
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
		component: ChangePasswordComponent,
		path: 'collectorchangepassword',
	},
	{
		component: ChangeDNACCredentialsComponent,
		path: 'dnacUpdateCred',
	},
	{
		component: UsersComponent,
		path: 'users',
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
		AdminComplienceModule,
		CommonModule,
		ControlPointsModule,
		ControlPointsModule.forRoot({ rootUrl }),
		ChangeDNACCredentialsModule,
		ChnagePasswordModule,
		CuiGaugeModule,
		CuiLabelsModule,
		CuiSidebarModule,
		CuiSpinnerModule,
		I18nPipeModule,
		PoliciesModule,
		RouterModule.forChild(childRoutes),
		SettingsModule,
		UsersModule,
	],
	providers: [CanDeactivateGuard],
})
export class AdminModule { }
