import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule, CuiSelectModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { CaseOpenComponent } from './case-open.component';
import { CaseSubmittedModule } from './case-submitted/case-submitted.module';
import { PanelSelectModule } from './panel-select/panel-select.module';
import { CloseConfirmModule } from './close-confirm/close-confirm.module';
import { CharCountModule } from '../../char-count/char-count.module';
import { HeightTransitionModule } from '../../height-transition/height-transition.module';

/**
 * Module for case open functionality
 */
@NgModule({
	declarations: [CaseOpenComponent],
	exports: [
		CaseOpenComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,

		CuiLoaderModule,
		CuiSelectModule,
		CuiSpinnerModule,
		I18nPipeModule,

		CaseSubmittedModule,
		CloseConfirmModule,
		PanelSelectModule,
		CharCountModule,
		HeightTransitionModule,
	],
})
export class CaseOpenModule { }
