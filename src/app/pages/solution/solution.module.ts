import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';
import { RouterModule } from '@angular/router';

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	imports: [
		CommonModule,
		CuiGaugeModule,
		I18nPipeModule,
		RouterModule,
		SolutionRoutingModule,
	],
})
export class SolutionModule { }
