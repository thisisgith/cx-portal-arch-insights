import { NgModule } from '@angular/core';
<<<<<<< HEAD
import { FormsModule } from '@angular/forms';
=======
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
>>>>>>> PBC-231 case list view implementation
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResolutionComponent } from './resolution.component';
import { Panel360Module } from '@components';
<<<<<<< HEAD
=======

import { CuiTableModule, CuiPagerModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
>>>>>>> PBC-231 case list view implementation

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: ResolutionComponent,
		path: '',
	},
];

/**
 * Module representing the Resolution component of the Solution Page
 */
@NgModule({
	declarations: [ResolutionComponent],
	imports: [
		CommonModule,
		FormsModule,
		Panel360Module,
		RouterModule.forChild(childRoutes),
		ReactiveFormsModule,
		CuiPagerModule,
		CuiTableModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class ResolutionModule { }
