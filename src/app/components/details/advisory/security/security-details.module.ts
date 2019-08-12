import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityDetailsComponent } from './security-details.component';
import { ProductAlertsModule } from '@sdp-api';
import { environment } from '@environment';
import { SecurityDetailsHeaderModule } from './header/security-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import {
	AdvisoryImpactedAssetsModule,
} from '../impacted-assets/impacted-assets.module';
import { AdvisoryFeedbackModule } from '../feedback/feedback.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing our Advisory Details Component
 */
@NgModule({
	declarations: [SecurityDetailsComponent],
	exports: [
		SecurityDetailsComponent,
		SecurityDetailsHeaderModule,
	],
	imports: [
		AdvisoryFeedbackModule,
		AdvisoryImpactedAssetsModule,
		CommonModule,
		CuiSpinnerModule,
		CuiTabsModule,
		I18nPipeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
		SecurityDetailsHeaderModule,
	],
})
export class SecurityDetailsModule { }
