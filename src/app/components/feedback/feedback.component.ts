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

/**
 * The main feedback component
 */
@Component({
	selector: 'app-feedback',
	templateUrl: './feedback.component.html',
})
export class FeedbackComponent implements OnInit {
	public feedbackForm: FormGroup;
	public isSubmitting = false;
	public thumbsUpSelected = false;
	public thumbsDownSelected = false;

	private user = this.profileService.getProfile();

	public feedbackMaxLength = 2000;
	public thumbValue = '-';
	public okayToContact = 'No';
	private userEmail = this.user.cpr.pf_auth_email;
	public emailParams = {
		from: this.userEmail,
		subject: I18n.get('_FeedbackEmailSubject_'),
		to: environment.feedbackToEmail,
	};

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
			`Date\n${new Date()}`,
			'--------------------------------------',
			`Rating\n${this.thumbValue}`,
			`Feedback\n${this.feedbackForm.value.comment}`,
			`Okay to contact?\n${this.okayToContact}`,
			'--------------------------------------',
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
			from: this.emailParams.from.split('@')
					.join('-noreply@'),
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
	 * @param event click event
	 */
	 public thumbClicked (event: Event) {
		const btnId = _.get(event, 'toElement.id');
		if (btnId === 'thumbUpBtn') {
			this.thumbsUpSelected = !this.thumbsUpSelected;
			this.thumbsDownSelected = false;
			this.thumbValue = 'Thumbs Up';
		}
		if (btnId === 'thumbDownBtn') {
			this.thumbsDownSelected = !this.thumbsDownSelected;
			this.thumbsUpSelected = false;
			this.thumbValue = 'Thumbs Down';
		}
	}

}
