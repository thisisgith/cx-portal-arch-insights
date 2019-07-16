import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';

/**
 * Child routes for Security Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: SecurityComponent,
		path: '',
	},
];

/**
 * Module representing the Security component of the Solution Page
 */
@NgModule({
	declarations: [SecurityComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class SecurityModule { }
