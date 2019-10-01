import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResolutionComponent } from './resolution.component';
import { CaseDetailsModule } from './case-details/case-details.module';
import { CaseDetailsHeaderModule } from './case-details-header/case-details-header.module';
import {
	PieChartModule,
	ColumnChartModule,
	BarChartModule,
	VisualFilterBarModule,
} from '@components';

import {
	CuiTableModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { DetailsPanelModule } from 'src/app/components/details/panel/details-panel.module';

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
		PieChartModule,
		ColumnChartModule,
		BarChartModule,
		CommonModule,
		FormsModule,
		RouterModule.forChild(childRoutes),
		ReactiveFormsModule,
		CaseDetailsModule,
		CaseDetailsHeaderModule,
		CaseDetailsModule,
		CommonModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		DetailsPanelModule,
		FormsModule,
		I18nPipeModule,
		FromNowPipeModule,
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
		VisualFilterBarModule,
	],
})
export class ResolutionModule { }
