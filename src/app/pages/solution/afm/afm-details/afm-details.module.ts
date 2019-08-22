import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfmDetailsComponent } from './afm-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * This is afm details panal module
 */
@NgModule({
	declarations: [AfmDetailsComponent],
	exports: [AfmDetailsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class AfmDetailsModule { }
