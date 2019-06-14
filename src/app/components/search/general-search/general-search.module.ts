import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CuiSelectModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import {
	I18nPipeModule,
	TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';
import { GeneralSearchComponent } from './general-search.component';

/**
 * Module for the "general search results" area of the search modal
 */
@NgModule({
	declarations: [GeneralSearchComponent],
	exports: [
		GeneralSearchComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		CuiSelectModule,
		CuiSpinnerModule,
		I18nPipeModule,
		TruncatePipeModule,
	],
})
export class GeneralSearchModule { }
