import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityDetailsHeaderComponent } from './security-details-header.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { DateTimePipeModule } from '@pipes';

/**
 * Security Details Header Module
 */
@NgModule({
	declarations: [SecurityDetailsHeaderComponent],
	exports: [SecurityDetailsHeaderComponent],
	imports: [
		CommonModule,
		DateTimePipeModule,
		FromNowPipeModule,
		I18nPipeModule,
	],
})
export class SecurityDetailsHeaderModule { }
