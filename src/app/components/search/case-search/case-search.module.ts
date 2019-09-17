import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nPipeModule, FromNowPipeModule, TruncatePipeModule } from '@cisco-ngx/cui-pipes';
import { CaseSearchComponent } from './case-search.component';
import { DateTimePipeModule } from '@pipes';

import {
	CuiLoaderModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

/**
 * Module for the case number results section of the search modal
 */
@NgModule({
	declarations: [CaseSearchComponent],
	exports: [
		CaseSearchComponent,
	],
	imports: [
		CommonModule,
		RouterModule,

		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
		FromNowPipeModule,
		TruncatePipeModule,

		DateTimePipeModule,
	],
})
export class CaseSearchModule { }
