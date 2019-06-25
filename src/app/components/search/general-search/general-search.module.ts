import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CuiSelectModule, CuiLoaderModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import {
	I18nPipeModule,
	TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';
import { GeneralSearchComponent } from './general-search.component';
import { KeyHighlightPipeModule } from '../pipes/key-highlight.pipe.module';
import { NoResultsModule } from '../no-results/no-results.module';

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
		KeyHighlightPipeModule,
		NoResultsModule,
		FormsModule,
		CuiSelectModule,
		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
		TruncatePipeModule,
	],
})
export class GeneralSearchModule { }
