import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerialSearchComponent } from './serial-search.component';

import {
	CuiButtonModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the Serial Number Search Component
 */
@NgModule({
	declarations: [SerialSearchComponent],
	exports: [SerialSearchComponent],
	imports: [
		CommonModule,
		CuiButtonModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class SerialSearchModule { }
