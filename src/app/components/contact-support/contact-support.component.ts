import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuiModalService, CuiModalContent } from '@cisco-ngx/cui-components';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { EmailControllerService, EmailRequest } from '@sdp-api';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';

/**
 * Component for portal support
 */
@Component({
	selector: 'app-contact-support',
	styleUrls: ['./contact-support.component.scss'],
	templateUrl: './contact-support.component.html',
})
export class ContactSupportComponent implements OnInit, CuiModalContent {

	public toggle = false;
	public loading = false;
	public supportForm: FormGroup;
	public data: any;
	public success = false;
	public descriptionMaxLength = 32000;
	public title: FormControl = new FormControl('', Validators.required);
	public description: FormControl = new FormControl('',
		[Validators.required, Validators.maxLength(this.descriptionMaxLength)]);
	public userMailId: string = this.profileService.getProfile().cpr.pf_auth_email;
	private destroy$ = new Subject();
	public items: any[] = [];

	constructor (
		public cuiModalService: CuiModalService, private profileService: ProfileService,
		public emailControllerService: EmailControllerService,
		private logger: LogService,
	) { }

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.supportForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
		this.getTopicList();
	}

	/**
	 * gets topic list
	 * @returns topic list
	 */
	public getTopicList () {
		const topicList = I18n.get('_SupportPortalTopicList_');
		_.forEach(topicList, topic => {
			this.items.push({ name: topic, value: topic });
		});
	}

	/**
	 * submit message
	 * @returns Observable with result
	 */
	public submitMessage () {
		if (this.supportForm.valid) {
			this.loading = true;
			const requestBody: EmailRequest = {
				body: this.createEmailTemplate(),
				from: environment.emailFromID,
				htmlBody: false,
				subject: I18n.get('_SupportEmailSubject_'),
				to: environment.emailToID,
			};
			return this.emailControllerService.sendEmail(requestBody)
				.pipe(
					catchError(err => {
						this.success = false;
						this.toggle = true;
						this.logger.error('contact-support.component : submitMessage() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return empty();
					}),
					takeUntil(this.destroy$),
				)
				.subscribe(res => {
					if (_.has(res, 'reason', 'errorCode')) {
						this.success = false;
					} else {
						this.success = true;
					}
					this.toggle = true;
					this.loading = false;
				});
		}
	}

	/**
	 * creates email template
	 * @returns email template
	 */
	public createEmailTemplate () {
		const userDetails = this.profileService.getProfile().cpr;
		return `${userDetails.pf_auth_firstname}` +
			` ${userDetails.pf_auth_lastname}` + ` ${I18n.get('_SupportSentBy_')}\n\n` +
			`${I18n.get('_SupportCiscoID_')}\n` + `${userDetails.pf_auth_uid}\n\n` +
			`${I18n.get('_SupportName_')}\n` +
			`${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname}\n\n` +
			`${I18n.get('_SupportEmail_')}\n` + `${userDetails.pf_auth_email}\n\n` +
			`${I18n.get('_SupportPhone_')}\n` + `${userDetails.pf_auth_email}\n\n` +
			`${I18n.get('_SupportMessageSection_')}\n\n` +
			`${I18n.get('_SupportEmailTopic_')}\n` +
			`${this.supportForm.controls.title.value}\n\n` +
			`${I18n.get('_SupportEmailDescription_')}\n` +
			`${this.supportForm.controls.description.value}\n\n` +
			`${I18n.get('_SupportMessageSection_')}\n\n` +
			`${I18n.get('_SupportOriginURL_')}\n` + `${window.location.href}`;
	}
}
