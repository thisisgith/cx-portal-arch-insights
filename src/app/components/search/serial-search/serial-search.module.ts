import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerialSearchComponent } from './serial-search.component';

import {
	CuiLoaderModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the Serial Number Search Component
 */
@NgModule({
	declarations: [SerialSearchComponent],
	exports: [SerialSearchComponent],
	imports: [
		CommonModule,
		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
		FromNowPipeModule,
	],
})
export class SerialSearchModule { }
