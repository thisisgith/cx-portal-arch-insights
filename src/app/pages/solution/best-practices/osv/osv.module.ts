import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptimalSoftwareVersionComponent } from './osv.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { Panel360Module } from '@components';
import { AssetSoftwareDetailsModule } from './details/details.module';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';

/**
 * Child routes for OptimalSoftwareModule for lazy loading
 */
const childRoutes: Routes = [
	{
		component: OptimalSoftwareVersionComponent,
		path: '',
	},
];

/**
 * Module representing the OptimalSoftwareComponent of the BestPractices Page
 */
@NgModule({
	declarations: [OptimalSoftwareVersionComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		Panel360Module,
		CuiTabsModule,
		AssetSoftwareDetailsModule,
		CuiSpinnerModule,
		FormsModule,
	],
})
export class OptimalSoftwareVersionModule { }
