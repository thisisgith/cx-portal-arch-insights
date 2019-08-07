import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldNoticeImpactedAssetsComponent } from './field-notice-impacted-assets.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTableModule } from '@cisco-ngx/cui-components';

/**
 * Field Notice Details Header Module
 */
@NgModule({
	declarations: [FieldNoticeImpactedAssetsComponent],
	exports: [FieldNoticeImpactedAssetsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		I18nPipeModule,
	],
})
export class FieldNoticeImpactedAssetsModule { }
