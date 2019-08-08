import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeployStepsComponent } from './deploy-steps.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for showing OVA deploy steps
 */
@NgModule({
	declarations: [DeployStepsComponent],
	exports: [
		DeployStepsComponent,
	],
	imports: [
		CommonModule,

		I18nPipeModule,
	],
})
export class DeployStepsModule { }
