import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CgtRequestFormComponent } from './cgt-request-form.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Module for CGTRequestForm
 */
@NgModule({
	declarations: [CgtRequestFormComponent],
	exports: [CgtRequestFormComponent],
	imports: [
		CommonModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class CgtRequestFormModule { }
