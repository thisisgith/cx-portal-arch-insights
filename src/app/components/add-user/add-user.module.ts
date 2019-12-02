import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSelectModule, CuiModalModule, CuiInputModule, CuiSpinnerModule, CuiAlertModule } from '@cisco-ngx/cui-components';

/**
 * Add User Module
 */
@NgModule({
	declarations: [AddUserComponent],
	entryComponents: [AddUserComponent],
	exports: [AddUserComponent],
	imports: [
		CommonModule, CuiSelectModule,
		FormsModule, ReactiveFormsModule,
		CuiModalModule,
		CuiInputModule,
		I18nPipeModule,
		CuiSpinnerModule,
		CuiAlertModule,
	],
})
export class AddUserModule { }
