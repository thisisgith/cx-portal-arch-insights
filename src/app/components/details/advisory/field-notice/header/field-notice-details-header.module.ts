import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldNoticeDetailsHeaderComponent } from './field-notice-details-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Field Notice Details Header Module
 */
@NgModule({
	declarations: [FieldNoticeDetailsHeaderComponent],
	exports: [FieldNoticeDetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class FieldNoticeDetailsHeaderModule { }
