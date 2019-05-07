import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolutionComponent } from './solution.component';
import { RouterModule, Routes } from '@angular/router';
import { RacetrackModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule, CuiGaugeModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { GaugePanelModule } from './gauge-panel/gauge-panel.module';

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
		CuiSpinnerModule,
		CuiGaugeModule,
		FormsModule,
		GaugePanelModule,
		RacetrackModule,
	],
})
export class SolutionModule { }
