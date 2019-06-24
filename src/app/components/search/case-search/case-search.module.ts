import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CaseSearchComponent } from './case-search.component';

import { CuiLoaderModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';

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
		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class CaseSearchModule { }
