import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { K9DeclineComponent } from './k9-decline.component';
import { CuiFormFieldModule } from '@cisco-ngx/cui-components';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * DownloadImageModule imports
 */
const imports = [
	CommonModule,
	CuiFormFieldModule,
	FormsModule,
	I18nPipeModule,
	ReactiveFormsModule,
];

/**
 * Module for OVA download prompt page
 */
@NgModule({
	imports,
	declarations: [K9DeclineComponent],
	exports: [K9DeclineComponent],
})
export class K9DeclineModule { }
