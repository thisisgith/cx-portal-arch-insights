import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactSupportComponent } from './contact-support.component';
import { CuiInputModule, CuiModalModule,
	 	 CuiSelectModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { OSVModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for contact support
 */
@NgModule({
	declarations: [ContactSupportComponent],
	exports: [ContactSupportComponent],
	imports: [
		CommonModule,
		CuiInputModule,
		CuiModalModule,
		FormsModule,
		ReactiveFormsModule,
		CuiSpinnerModule,
		CuiSelectModule,
		I18nPipeModule,
		OSVModule.forRoot({ rootUrl: '' }),
	],
})
export class ContactSupportModule { }
