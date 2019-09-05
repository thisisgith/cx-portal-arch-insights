import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackSuccessComponent } from './feedback-success/feedback-success.component';
import { FeedbackSuccessModule } from './feedback-success/feedback-success.module';
import { FeedbackFailedComponent } from './feedback-failed/feedback-failed.component';
import { FeedbackFailedModule } from './feedback-failed/feedback-failed.module';
import { EmailModule } from '@sdp-api';
import { environment } from '@environment';
import { CharCountModule } from '@components';

/**
 * Ng Module
 */
@NgModule({
	declarations: [FeedbackComponent],
	entryComponents: [
		FeedbackSuccessComponent,
		FeedbackFailedComponent,
	],
	imports: [
		CommonModule,
		EmailModule.forRoot(
			{ rootUrl: `${environment.sdpServiceOrigin}${environment.sdpServiceBasePath}` },
		),
		FeedbackFailedModule,
		FeedbackSuccessModule,
		I18nPipeModule,
		ReactiveFormsModule,
		CharCountModule,
	],
})
export class FeedbackModule { }
