import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisoryFeedbackComponent } from './feedback.component';
import { FeedbackModule } from '@sdp-api';
import { environment } from '@environment';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing our Advisory Details Component
 */
@NgModule({
	declarations: [AdvisoryFeedbackComponent],
	exports: [
		AdvisoryFeedbackComponent,
	],
	imports: [
		CommonModule,
		FeedbackModule.forRoot({ rootUrl }),
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class AdvisoryFeedbackModule { }
