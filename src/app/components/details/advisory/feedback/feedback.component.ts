import {
	Component,
	Input,
	EventEmitter,
	Output,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	FeedbackService,
	FeedbackRequest,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AdvisoryType, Alert } from '@interfaces';
import { I18n } from '@cisco-ngx/cui-utils';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Security Details Component
 */
@Component({
	selector: 'advisory-feedback',
	styleUrls: ['./feedback.component.scss'],
	templateUrl: './feedback.component.html',
})
export class AdvisoryFeedbackComponent {

	@Input('id') public id: string;
	@Input('type') public type: AdvisoryType;
	@Input('customerId') public customerId: string;
	@Output('alert') public alertMessage = new EventEmitter<Alert>();

	public feedbackOptions = {
		max: 150,
		min: 5,
		pattern: /^[a-zA-Z0-9\s\-\/\(\).]*$/,
	};
	public feedbackForm = new FormGroup({
		feedback: new FormControl('',
			[
				Validators.required,
				Validators.minLength(this.feedbackOptions.min),
				Validators.maxLength(this.feedbackOptions.max),
				Validators.pattern(this.feedbackOptions.pattern),
			]),
	});
	public isSubmitting = false;
	public rating: string;

	constructor (
		private logger: LogService,
		private feedbackService: FeedbackService,
	) { }

	/** Returns the feedback form value */
	public get feedbackValue () {
		return _.get(this.feedbackForm, ['controls', 'feedback', 'value'], '');
	}

	/**
	 * Submits the users feedback on the security advisory
	 */
	public submitFeedback () {
		this.isSubmitting = true;
		const feedback: FeedbackRequest = {
			customerId: this.customerId,
			feedbackMsg: this.feedbackForm.controls.feedback.value,
			rating: this.rating ? this.rating : '',
		};

		if (this.type === 'bug') {
			feedback.cdetId = this.id;
		} else if (this.type === 'field') {
			feedback.fnId = this.id;
		} else {
			feedback.psirtId = this.id;
		}

		this.feedbackService.postAdvisoryFeedback(feedback)
		.pipe(
			map(() => {
				this.alertMessage.emit({
					message: I18n.get('_SubmittedFeedbackForAdvisory_', this.id),
					severity: 'success',
				});
				this.rating = null;
				this.feedbackForm.controls.feedback.reset();
				this.feedbackForm.controls.feedback.setValue('', {
					emitModelToViewChange: true,
				});
				this.isSubmitting = false;
			}),
			catchError(err => {
				this.alertMessage.emit({
					message: I18n.get('_FailedToSubmitFeedbackForAdvisory_', this.id),
					severity: 'danger',
				});
				this.logger.error('advisory-details:feedback.component : submitFeedback() ' +
				`:: Error : (${err.status}) ${err.message}`);
				this.isSubmitting = false;

				return of({ });
			}),
		)
		.subscribe();
	}

	/**
	 * Handles the clicking of vote buttons
	 * @param thumbRating the thumb pressed
	 */
	public voteClicked (thumbRating: string) {
		if (this.rating === thumbRating) {
			this.rating = null;
		} else {
			this.rating = thumbRating;
		}
	}
}
