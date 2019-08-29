import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CaseSubmittedComponent } from './case-submitted.component';
import { CollapsibleModule } from '../../../collapsible/collapsible.module';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module to export CaseSubmittedComponent
 */
@NgModule({
	declarations: [CaseSubmittedComponent],
	exports: [CaseSubmittedComponent],
	imports: [
		CommonModule,
		RouterModule,

		I18nPipeModule,

		CollapsibleModule,
	],
})
export class CaseSubmittedModule { }
