import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolutionComponent } from './solution.component';
import { RouterModule, Routes } from '@angular/router';

/**
 * Child routes for Inventory Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: SolutionComponent,
		path: '',
	},
];

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class SolutionModule { }
