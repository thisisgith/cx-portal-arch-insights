import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolutionComponent } from './solution.component';
import { RouterModule, Routes } from '@angular/router';
import { GaugePanelModule } from '@components/gauge-panel/gauge-panel.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

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
		I18nPipeModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		GaugePanelModule,
	],
})
export class SolutionModule { }
