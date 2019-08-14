import {
	Component,
	Input,
	OnInit,
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
export class AdvisoryFeedbackComponent implements OnInit {

	@Input('id') public id: string;
	@Input('type') public type: AdvisoryType;
	@Input('customerId') public customerId: string;
	@Output('alert') public alertMessage = new EventEmitter<Alert>();

	public upVoteSelected = false;
	public downVoteSelected = false;
	public feedbackMaxLength = 150;
	public feedbackDescription: FormControl = new FormControl('',
		[
			Validators.required,
			Validators.maxLength(this.feedbackMaxLength),
		]);
	public feedbackForm: FormGroup;
	public isSubmitting = false;
	private rating: string;

	constructor (
		private logger: LogService,
		private feedbackService: FeedbackService,
	) { }

	/**
	 * Submits the users feedback on the security advisory
	 */
	public submitFeedback () {
		this.isSubmitting = true;
		const feedback: FeedbackRequest = {
			customerId: this.customerId,
			feedbackMsg: this.feedbackDescription.value,
			rating: this.rating ? this.rating : '',
		};

		if (this.type === 'bug') {
			feedback.cdetId = this.id;
		} else if (this.type === 'field') {
			feedback.fieldNoticeId = this.id;
		} else if (this.type === 'security') {
			feedback.psirtId = this.id;
		}

		this.feedbackService.postAdvisoryFeedback(feedback)
		.pipe(
			map(() => {
				this.alertMessage.emit({
					message: I18n.get('_SubmittedFeedbackForAdvisory_', this.id),
					severity: 'success',
				});
				this.feedbackDescription.setValue('');
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
	 * Initializer
	 */
	public ngOnInit () {
		this.feedbackForm = new FormGroup({
			description: this.feedbackDescription,
		});
	}

	/**
	 * Handles the clicking of vote buttons
	 * @param event click event
	 */
	public voteClicked (event: Event) {
		const btnId = _.get(event, 'toElement.id');
		if (btnId === 'upVoteBtn') {
			this.upVoteSelected = !this.upVoteSelected;
			this.downVoteSelected = false;
		}
		if (btnId === 'downVoteBtn') {
			this.downVoteSelected = !this.downVoteSelected;
			this.upVoteSelected = false;
		}

		if (this.upVoteSelected) {
			this.rating = 'thumbsUp';
		} else if (this.downVoteSelected) {
			this.rating = 'thumbsDown';
		}
	}
}
