import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResolutionComponent } from './resolution.component';
import { CaseDetailsModule } from './case-details/case-details.module';
import { Panel360Module } from '@components';
import { CaseDetailsHeaderModule } from './case-details-header/case-details-header.module';

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
		CaseDetailsModule,
		CaseDetailsHeaderModule,
	],
})
export class ResolutionModule { }
