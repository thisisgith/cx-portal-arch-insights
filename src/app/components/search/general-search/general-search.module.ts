import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuiSelectModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import {
	I18nPipeModule,
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
		CuiSelectModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class GeneralSearchModule { }
