import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseOpenModule } from './case-open/case-open.module';
import { CaseOpenComponent } from './case-open/case-open.component';
import {
	CaseOpenAdvisoriesModule,
} from './case-open/case-open-advisories/case-open-advisories.module';
import {
	CaseOpenAdvisoriesComponent,
} from './case-open/case-open-advisories/case-open-advisories.component';

/**
 * Module for all case-related components which are not tied to 1 particular page
 */
@NgModule({
	declarations: [],
	entryComponents: [
		CaseOpenAdvisoriesComponent,
		CaseOpenComponent,
	],
	imports: [
		CommonModule,

		CaseOpenAdvisoriesModule,
		CaseOpenModule,
	],
})
export class CaseModule { }
