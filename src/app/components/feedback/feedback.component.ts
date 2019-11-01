import { Component, OnInit } from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedbackSuccessComponent } from './feedback-success/feedback-success.component';
import { FeedbackFailedComponent } from './feedback-failed/feedback-failed.component';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { EmailControllerService } from '@sdp-api';
import { environment } from '@environment';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';

/** Data Interface */
interface Data {
	facet?: string;
	pitstop?: string;
	solution?: string;
	useCase?: string;
}

/**
 * The main feedback component
 */
@Component({
	selector: 'app-feedback',
	styleUrls: ['./feedback.component.scss'],
	templateUrl: './feedback.component.html',
})
export class FeedbackComponent implements OnInit {
	public feedbackForm: FormGroup;
	public isSubmitting = false;
	public thumbSelected: 'up' | 'down' | '';

	private user = this.profileService.getProfile();

	public feedbackMaxLength = 32000;
	public thumbValue = '-';
	public okayToContact = 'No';
	private userEmail = this.user.cpr.pf_auth_email;
	public emailParams = {
		from: this.userEmail,
		subject: I18n.get('_FeedbackEmailSubject_'),
		to: environment.feedbackToEmail,
	};
	public data: Data = { };

	constructor (
		private cuiModalService: CuiModalService,
		private emailService: EmailControllerService,
		private formBuilder: FormBuilder,
		private profileService: ProfileService,
	) { }

	/**
	 * Onit
	 */
	public ngOnInit (): void {
		this.buildForm();
	}

	/**
	 * Builds the feedback form
	 */
	private buildForm () {
		this.feedbackForm = this.formBuilder.group({
			allowedContact: [false],
			comment: ['', [
				Validators.required,
				Validators.maxLength(this.feedbackMaxLength)],
			],
		});
	}

	/**
	 * Generate the email body
	 * @returns the email body
	 */
	private generateBody () {
		// TODO: add the following to the email body
		// Offer Level, Cisco team comtact, Smart Account/Virtual Account detail
		// Solution selected, Use case selected

		const cpr = _.get(this.user, 'cpr', { });

		if (this.feedbackForm.value.allowedContact) {
			this.okayToContact = 'Yes';
		}

		const body = [
			`Cisco ID\n${_.get(cpr, 'pf_auth_uid', 'N/A')}`,
			`Name\n${_.get(cpr, 'pf_auth_firstname', 'N/A')}`
			 + ` ${_.get(cpr, 'pf_auth_lastname', 'N/A')}`,
			`Email\n${_.get(cpr, 'pf_auth_email', 'N/A')}`,
			`Access Level\n${_.get(cpr, 'pf_auth_user_level', 'N/A')}`,
			`Organization Name\n${_.get(cpr, 'pf_auth_company_name', 'N/A')}`,
			`Success Track\n${_.get(this.data, 'solution', 'N/A')}`,
			`UseCase\n${_.get(this.data, 'useCase', 'N/A')}`,
			`Current Pitstop\n${_.get(this.data, 'pitstop', 'N/A')}`,
			`Date\n${new Date()}`,
			'--------------------------------------',
			`Rating\n${this.thumbValue}`,
			`Feedback\n${this.feedbackForm.value.comment}`,
			`Okay to contact?\n${this.okayToContact}`,
			'--------------------------------------',
			`Current Metric View\n${_.get(this.data, 'facet', 'N/A')}`,
			`URL of page user was on when they clicked Feedback\n${window.location.href}`,
		];

		return _.join(body, '\n\n');
	}
	/**
	 * Sends the feedback to backend
	 */
	public submitFeedback () {
		this.isSubmitting = true;

		const email = {
			body: this.generateBody(),
			from: `${this.emailParams.from.split('@')[0]}-noreply@cisco.com`,
			htmlBody: false,
			subject: this.emailParams.subject,
			to: this.emailParams.to,
		};

		this.emailService.sendEmail(email)
			.subscribe(
				() => this.isSubmitting = false,
				async () =>
				await this.cuiModalService.showComponent(FeedbackFailedComponent, { }, 'normal'),
				async () =>
				await this.cuiModalService.showComponent(FeedbackSuccessComponent, { }, 'normal'));

	}

	/**
	 * Cancels the modal
	 */
	public cancelModal () {
		this.cuiModalService.onCancel.emit();
		this.cuiModalService.hide();
	}

	/**
	 * Handles the clicking of thumb buttons
	 * @param dir direction of thumb
	 */
	 public thumbClicked (dir: 'up' | 'down') {
		this.thumbSelected = this.thumbSelected === dir ? '' : dir;
		let val;
		switch (this.thumbSelected) {
			case 'up':
				val = 'Thumbs Up';
				break;
			case 'down':
				val = 'Thumbs Down';
				break;
			default:
				val = '-';
		}
		this.thumbValue = val;
	}

}
