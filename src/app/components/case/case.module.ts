import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseOpenModule } from './case-open/case-open.module';
import { CaseOpenComponent } from './case-open/case-open.component';

/**
 * Module for all case-related components which are not tied to 1 particular page
 */
@NgModule({
	declarations: [],
	entryComponents: [
		CaseOpenComponent,
	],
	imports: [
		CommonModule,

		CaseOpenModule,
	],
})
export class CaseModule { }
