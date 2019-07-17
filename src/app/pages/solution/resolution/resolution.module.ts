import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResolutionComponent } from './resolution.component';
import { CaseDetailsModule } from './case-details/case-details.module';
import { Panel360Module } from '@components';
import { CaseDetailsHeaderModule } from './case-details-header/case-details-header.module';

import {
	CuiTableModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Child routes for Resolution Module for lazy loading
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
		CaseDetailsModule,
		CaseDetailsHeaderModule,
		CuiPagerModule,
		CuiTableModule,
		CuiTabsModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class ResolutionModule { }
