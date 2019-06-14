import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractSearchComponent } from './contract-search.component';

import { CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for specialized contract lookup results
 */
@NgModule({
	declarations: [ContractSearchComponent],
	exports: [
		ContractSearchComponent,
	],
	imports: [
		CommonModule,

		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class ContractSearchModule { }
