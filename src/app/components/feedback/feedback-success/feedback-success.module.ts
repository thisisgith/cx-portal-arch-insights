import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackSuccessComponent } from './feedback-success.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Ng Module
 */
@NgModule({
	declarations: [FeedbackSuccessComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class FeedbackSuccessModule { }
