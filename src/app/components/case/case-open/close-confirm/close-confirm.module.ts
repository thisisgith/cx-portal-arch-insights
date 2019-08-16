import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseConfirmComponent } from './close-confirm.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for confirm close modal component
 */
@NgModule({
	declarations: [CloseConfirmComponent],
	entryComponents: [CloseConfirmComponent],
	exports: [CloseConfirmComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CloseConfirmModule { }
