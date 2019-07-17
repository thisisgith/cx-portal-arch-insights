import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureComponent } from './architecture.component';

/**
 * Child routes for ArchitectureModule for lazy loading
 */
const childRoutes: Routes = [
	{
		component: ArchitectureComponent,
		path: '',
	},
];

/**
 * Module representing the Architecture component of the BestPractices Page
 */
@NgModule({
	declarations: [ArchitectureComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class ArchitectureModule { }
