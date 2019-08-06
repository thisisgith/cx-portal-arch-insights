import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SelectInstructionsComponent } from './select-instructions.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for instruction select page
 */
@NgModule({
	declarations: [SelectInstructionsComponent],
	imports: [
		CommonModule,

		FormsModule,
		I18nPipeModule,
	],
})
export class SelectInstructionsModule { }
