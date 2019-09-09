import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelConfirmComponent } from './cancel-confirm.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for confirm Cancel modal component
 */
@NgModule({
	declarations: [CancelConfirmComponent],
	entryComponents: [CancelConfirmComponent],
	exports: [CancelConfirmComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CancelConfirmModule { }
