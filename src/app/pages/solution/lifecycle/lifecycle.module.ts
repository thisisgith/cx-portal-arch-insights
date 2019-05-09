import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LifecycleComponent } from './lifecycle.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { RacetrackModule } from '@components';
import { CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';

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
 * Module representing the Lifecycle component of the Solution Page
 */
@NgModule({
	declarations: [LifecycleComponent],
	imports: [
		CommonModule,
		CuiSpinnerModule,
		FormsModule,
		I18nPipeModule,
		RacetrackModule,
		RouterModule.forChild(childRoutes),
	],
})
export class LifecycleModule { }
