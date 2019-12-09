import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetupIEService } from '../../setup-ie/setup-ie.service';

import {
	CuiLoaderModule,
	CuiSpinnerModule,
	CuiAlertModule,
	CuiModalModule,

} from '@cisco-ngx/cui-components';
import { HeightTransitionModule } from '@components';

/**
 * Main Settings module
 */
@NgModule({
	declarations: [
		ChangePasswordComponent,
	],
	providers: [SetupIEService],
	imports: [
		CommonModule,
		CuiLoaderModule,
		CuiModalModule,
		CuiSpinnerModule,
		CuiAlertModule,
		HeightTransitionModule,
		I18nPipeModule,
		RouterModule,
		FormsModule, ReactiveFormsModule,
	],
})
export class ChnagePasswordModule { }
