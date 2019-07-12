import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RiskMigitaionComponent } from './risk-mitigation.component';

/**
 * Child routes for RiskMitigationModule for lazy loading
 */
const childRoutes: Routes = [
	{
		component: RiskMigitaionComponent,
		path: '',
	},
];

/**
 * Module representing the Risk Mitigation component of the BestPractices Page
 */
@NgModule({
	declarations: [RiskMigitaionComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
	],
})
export class RiskMitigationModule { }
