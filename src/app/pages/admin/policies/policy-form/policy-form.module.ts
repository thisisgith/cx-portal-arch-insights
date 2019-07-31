import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyFormComponent } from './policy-form.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
		ReactiveFormsModule,
	],
})
export class PolicyFormModule { }
