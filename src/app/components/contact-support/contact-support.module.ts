import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSupportComponent } from './contact-support.component';
import { CuiSelectModule, CuiModalModule,
	CuiInputModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { EmailModule } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;
/**
 * Module for portal support
 */
@NgModule({
	declarations: [ContactSupportComponent],
	exports: [ContactSupportComponent],
	imports: [
		CommonModule,
		CuiSelectModule,
		FormsModule,
		ReactiveFormsModule,
		CuiModalModule,
		CuiInputModule,
		I18nPipeModule,
		CuiSpinnerModule,
		EmailModule.forRoot({ rootUrl }),
	],
	entryComponents: [ContactSupportComponent],
})
export class ContactSupportModule { }
