import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisoryDetailsComponent } from './advisory-details.component';
import { SecurityDetailsModule } from './security/security-details.module';
import { BugDetailsModule } from './bug/bug-details.module';
import { FieldNoticeDetailsModule } from './field-notice/field-notice-details.module';
import { DetailsPanelModule } from '../panel/details-panel.module';

/**
 * Module representing our Advisory Details Component
 */
@NgModule({
	declarations: [AdvisoryDetailsComponent],
	exports: [AdvisoryDetailsComponent],
	imports: [
		BugDetailsModule,
		CommonModule,
		DetailsPanelModule,
		FieldNoticeDetailsModule,
		SecurityDetailsModule,
	],
})
export class AdvisoryDetailsModule { }
