import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectComponent } from './connect.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * ConnectModule imports
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
	declarations: [ConnectComponent],
	exports: [ConnectComponent],
})
export class ConnectModule { }
