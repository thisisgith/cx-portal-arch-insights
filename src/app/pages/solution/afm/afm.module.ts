import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTableModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSpinnerModule,
	CuiDropdownModule,
} from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfmComponent } from './afm.component';
import { AfmModule } from '@sdp-api';
import { environment } from '@environment';
import { DetailsPanelModule } from 'src/app/components/details/panel/details-panel.module';
import { AssetDetailsModule } from '../../../components/details/asset/asset-details.module';
import { AssetDetailsHeaderModule } from '../../../components/details/asset/header/header.module';
import { ColumnChartModule, VisualFilterBarModule } from '@components';
import { AfmDetailsModule } from './afm-details/afm-details.module';

/** rootUrl for rest call */
const rootUrl = environment.sdpServiceOrigin;
/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AfmComponent,
		path: '',
	},
];

/**
 * Module representing the Assets component of the Solution Page
 */
@NgModule({
	declarations: [AfmComponent],
	imports: [
		CommonModule,
		CuiDropdownModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiTabsModule,
		FormsModule,
		FromNowPipeModule,
		I18nPipeModule,
		ReactiveFormsModule,
		RouterModule.forChild(childRoutes),
		AfmModule.forRoot({ rootUrl }),
		DetailsPanelModule,
		AssetDetailsModule,
		AssetDetailsHeaderModule,
		ColumnChartModule,
		AfmDetailsModule,
		VisualFilterBarModule,
	],
})

export class FaultManagementModule { }
