import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsvComponent } from './osv.component';
import { RouterModule, Routes } from '@angular/router';

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: OsvComponent,
		path: '',
	},
];

/**
 * Optimal Software Module
 */
@NgModule({
	declarations: [OsvComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class OsvModule { }
