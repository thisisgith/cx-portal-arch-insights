import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugDetailsComponent } from './bug-details.component';
import { DiagnosticsModule } from '@sdp-api';
import { environment } from '@environment';
import { BugDetailsHeaderModule } from './header/bug-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdvisoryFeedbackModule } from '../feedback/feedback.module';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { AdvisoryImpactedAssetsModule } from '../impacted-assets/impacted-assets.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module representing our Bug Details Component
 */
@NgModule({
	declarations: [BugDetailsComponent],
	exports: [
		BugDetailsComponent,
		BugDetailsHeaderModule,
	],
	imports: [
		AdvisoryFeedbackModule,
		AdvisoryImpactedAssetsModule,
		BugDetailsHeaderModule,
		CommonModule,
		CuiSpinnerModule,
		CuiTabsModule,
		DiagnosticsModule.forRoot({ rootUrl }),
		I18nPipeModule,
	],
})
export class BugDetailsModule { }
