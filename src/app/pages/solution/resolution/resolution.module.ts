import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResolutionComponent } from './resolution.component';

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
		RouterModule.forChild(childRoutes),
	],
})
export class ResolutionModule { }
