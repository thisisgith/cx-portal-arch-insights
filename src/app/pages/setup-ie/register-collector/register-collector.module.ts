import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterCollectorComponent } from './register-collector.component';
import { AlertModule, HeightTransitionModule } from '@components';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule, CuiSelectModule } from '@cisco-ngx/cui-components';

/**
 * Module for creating IE account
 */
@NgModule({
	declarations: [RegisterCollectorComponent],
	imports: [
		AlertModule,
		CommonModule,
		CuiLoaderModule,
		CuiSelectModule,
		HeightTransitionModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class RegisterCollectorModule { }
