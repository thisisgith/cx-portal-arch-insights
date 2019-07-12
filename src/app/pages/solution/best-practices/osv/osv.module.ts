import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptimalSoftwareVersionComponent } from './osv.component';

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
	],
})
export class OptimalSoftwareVersionModule { }
