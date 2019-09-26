import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldNoticeDetailsHeaderComponent } from './field-notice-details-header.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { DateTimePipeModule } from '@pipes';

/**
 * Field Notice Details Header Module
 */
@NgModule({
	declarations: [FieldNoticeDetailsHeaderComponent],
	exports: [FieldNoticeDetailsHeaderComponent],
	imports: [
		CommonModule,
		DateTimePipeModule,
		FromNowPipeModule,
		I18nPipeModule,
	],
})
export class FieldNoticeDetailsHeaderModule { }
