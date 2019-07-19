import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BestPracticesComponent } from './best-practices.component';
import { ArchitectureModule } from './architecture/architecture.module';

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: BestPracticesComponent,
		path: '',
	},
];

/**
 * Module representing the Advisories component of the Solution Page
 */
@NgModule({
	declarations: [BestPracticesComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		ArchitectureModule,
	],
})
export class BestPracticesModule { }
