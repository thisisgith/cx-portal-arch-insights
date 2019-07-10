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

/**
 * Child routes for Settings Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: SettingsComponent,
		path: 'settings',
	},
	{
		path: '',
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
	],
})
export class AdminModule { }
