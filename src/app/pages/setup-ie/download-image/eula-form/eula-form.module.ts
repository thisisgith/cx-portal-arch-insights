import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EULAFormComponent } from './eula-form.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * DownloadImageModule imports
 */
const imports = [
	CommonModule,
	FormsModule,
	I18nPipeModule,
	ReactiveFormsModule,
];

/**
 * Module for OVA download prompt page
 */
@NgModule({
	imports,
	declarations: [EULAFormComponent],
	exports: [EULAFormComponent],
})
export class EULAFormModule { }
