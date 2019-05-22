import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { InventoryModule } from '@cui-x/sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.services.sdp.origin;

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AssetsComponent,
		path: '',
	},
];

/**
 * Module representing the Assets component of the Solution Page
 */
@NgModule({
	declarations: [AssetsComponent],
	imports: [
		CommonModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiTableModule,
		I18nPipeModule,
		InventoryModule.forRoot({ rootUrl }),
		RouterModule.forChild(childRoutes),
	],
})
export class AssetsModule { }
