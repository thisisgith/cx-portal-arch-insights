import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertInfoComponent } from './alert-info.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuiGaugeModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';

/**
 * Module used for importing our AlertInfoComponent
 */
@NgModule({
	declarations: [AlertInfoComponent],
	exports: [AlertInfoComponent],
	imports: [
		CommonModule,
		CuiGaugeModule,
		CuiSpinnerModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class AlertInfoModule { }
