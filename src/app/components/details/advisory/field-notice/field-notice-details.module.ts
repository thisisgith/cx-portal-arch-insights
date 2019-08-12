import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldNoticeDetailsComponent } from './field-notice-details.component';
import { ProductAlertsModule } from '@sdp-api';
import { environment } from '@environment';
import { FieldNoticeDetailsHeaderModule } from './header/field-notice-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { AdvisoryFeedbackModule } from '../feedback/feedback.module';
import { AdvisoryImpactedAssetsModule } from '../impacted-assets/impacted-assets.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module representing our Field Notice Details Component
 */
@NgModule({
	declarations: [FieldNoticeDetailsComponent],
	exports: [
		FieldNoticeDetailsComponent,
		FieldNoticeDetailsHeaderModule,
	],
	imports: [
		AdvisoryFeedbackModule,
		AdvisoryImpactedAssetsModule,
		CommonModule,
		CuiSpinnerModule,
		CuiTabsModule,
		FieldNoticeDetailsHeaderModule,
		I18nPipeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class FieldNoticeDetailsModule { }
