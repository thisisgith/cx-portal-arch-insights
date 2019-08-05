import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSupportComponent } from './contact-support.component';
import { CuiSelectModule, CuiModalModule, CuiInputModule } from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

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
	],
	entryComponents: [ContactSupportComponent],
})
export class ContactSupportModule { }
