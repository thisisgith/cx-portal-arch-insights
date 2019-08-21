import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactExpertComponent } from './contact-expert.component';
import {
	CuiInputModule, CuiModalModule,
	CuiSelectModule, CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { OSVModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for contact support
 */
@NgModule({
	declarations: [ContactExpertComponent],
	exports: [ContactExpertComponent],
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
	entryComponents: [ContactExpertComponent],
})
export class ContactExpertModule { }
