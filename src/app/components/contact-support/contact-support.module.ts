import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSupportComponent } from './contact-support.component';
import { CuiSelectModule, CuiModalModule } from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [ContactSupportComponent],
	exports: [ContactSupportComponent],
	imports: [
		CommonModule,
		CuiSelectModule,
		FormsModule,
		ReactiveFormsModule,
		CuiModalModule,
	],
	entryComponents:[ContactSupportComponent],
})
export class ContactSupportModule { }
