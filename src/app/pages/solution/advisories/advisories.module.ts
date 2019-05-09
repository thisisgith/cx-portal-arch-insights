import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdvisoriesComponent } from './advisories.component';

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: AdvisoriesComponent,
		path: '',
	},
];

/**
 * Module representing the Advisories component of the Solution Page
 */
@NgModule({
	declarations: [AdvisoriesComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class AdvisoriesModule { }
