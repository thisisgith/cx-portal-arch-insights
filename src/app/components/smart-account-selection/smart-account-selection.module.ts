import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartAccountSelectionComponent } from './smart-account-selection.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Ng Module
 */
@NgModule({
	declarations: [SmartAccountSelectionComponent],
	entryComponents: [SmartAccountSelectionComponent],
	exports: [SmartAccountSelectionComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class SmartAccountSelectionModule { }
