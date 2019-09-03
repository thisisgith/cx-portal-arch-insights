import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackFailedComponent } from './feedback-failed.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Ng Module
 */
@NgModule({
	declarations: [FeedbackFailedComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class FeedbackFailedModule { }
