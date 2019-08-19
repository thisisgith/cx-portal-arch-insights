import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyFormComponent } from './policy-form.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * Module representing form for Policies page
 */
@NgModule({
	declarations: [PolicyFormComponent],
	exports: [PolicyFormComponent],
	imports: [
		CommonModule,
		FormsModule,
		I18nPipeModule,
		FromNowPipeModule,
		ReactiveFormsModule,
		CuiLoaderModule,
	],
})
export class PolicyFormModule { }
