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
import { SettingsComponent, SettingsModule } from './settings';
import { PoliciesComponent, PoliciesModule } from './policies';

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
		path: '',
		pathMatch: 'full',
		redirectTo: 'settings',
	},
];

/**
 * Main Settings module
 */
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		CuiSidebarModule,
		CuiSpinnerModule,
		CuiGaugeModule,
		CuiLabelsModule,
		SettingsModule,
		PoliciesModule,
	],
})
export class AdminModule { }
