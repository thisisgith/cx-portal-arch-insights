import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSupportComponent } from './contact-support.component';
import { CuiSelectModule, CuiModalModule,
	CuiInputModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { CharCountModule } from '../char-count/char-count.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { EmailModule } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;
/**
 * Module for portal support
 */
@NgModule({
	declarations: [ContactSupportComponent],
	entryComponents: [ContactSupportComponent],
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
		CharCountModule,
		EmailModule.forRoot({ rootUrl }),
	],
})
export class ContactSupportModule { }
