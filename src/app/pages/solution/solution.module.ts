import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SolutionComponent } from './solution.component';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { SolutionRoutingModule } from './solution-routing.module';

/**
 * Module representing the Solution Pages
 */
@NgModule({
	declarations: [SolutionComponent],
	imports: [
		CommonModule,
		CuiGaugeModule,
		I18nPipeModule,
		SolutionRoutingModule,
	],
})
export class SolutionModule { }
