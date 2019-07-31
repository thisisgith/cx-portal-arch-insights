import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskMitigationComponent } from './risk-mitigation.component';
import { Routes, RouterModule } from '@angular/router';

/**
 * Child routes for Assets Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: RiskMitigationComponent,
		path: '',
	},
];

/**
 * RiskMitigation Module
 */
@NgModule({
	declarations: [RiskMitigationComponent],
	exports: [RiskMitigationComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class RiskMitigationModule { }
