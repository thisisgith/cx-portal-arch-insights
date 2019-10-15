import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule, CuiSelectModule, CuiSpinnerModule, CuiTableModule } from '@cisco-ngx/cui-components';

import { CaseOpenAdvisoriesComponent } from './case-open-advisories.component';
import { CollapsibleModule } from '../../../collapsible/collapsible.module';
import { CaseSubmittedModule } from '../case-submitted/case-submitted.module';
import { CloseConfirmModule } from '../close-confirm/close-confirm.module';
import { CharCountModule } from '../../../char-count/char-count.module';
import { TechFormModule } from '../tech-form/tech-form.module';

/**
 * Module for opening a case against a Cisco Security Advisory/Field Notice/Bug
 */
@NgModule({
	declarations: [CaseOpenAdvisoriesComponent],
	exports: [CaseOpenAdvisoriesComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,

		CuiLoaderModule,
		CuiSelectModule,
		CuiSpinnerModule,
		CuiTableModule,
		I18nPipeModule,

		CaseSubmittedModule,
		CloseConfirmModule,
		CollapsibleModule,
		CharCountModule,
		TechFormModule,
	],
})
export class CaseOpenAdvisoriesModule { }
