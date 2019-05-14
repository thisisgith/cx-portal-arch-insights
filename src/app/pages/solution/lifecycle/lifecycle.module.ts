import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RacetrackModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { LifecycleComponent } from './lifecycle.component';

/**
 * Child routes for Lifecycle Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: LifecycleComponent,
		path: '',
	},
];

/**
 * Module representing the Lifecycle Component of the Solution Page
 */
@NgModule({
	declarations: [LifecycleComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		CuiSpinnerModule,
		FormsModule,
		RacetrackModule,
	],
})
export class LifecycleModule { }
