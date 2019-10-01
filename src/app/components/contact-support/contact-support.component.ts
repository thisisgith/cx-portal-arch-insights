import { Component, OnInit, SecurityContext, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuiModalService, CuiModalContent } from '@cisco-ngx/cui-components';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { EmailControllerService, EmailRequest, ContactSupportResponse } from '@sdp-api';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';
import { DomSanitizer } from '@angular/platform-browser';
import { UserResolve } from '@utilities';

/**
 * Component for portal support
 */
@Component({
	selector: 'app-contact-support',
	styleUrls: ['./contact-support.component.scss'],
	templateUrl: './contact-support.component.html',
})
export class ContactSupportComponent implements OnInit, OnDestroy, CuiModalContent {

	public toggle = false;
	public loading = false;
	public supportForm: FormGroup;
	public data: any;
	public success = false;
	public descriptionMaxLength;
	public title: FormControl;
	public description: FormControl;
	public userMailId: string = _.get(this.profileService.getProfile(), ['cpr', 'pf_auth_email']);
	public modalHeading;
	private destroy$ = new Subject();
	public items: any[] = [];
	public contactExpert = false;
	private customerId: string;

	constructor (
		public cuiModalService: CuiModalService, private profileService: ProfileService,
		public emailControllerService: EmailControllerService,
		private logger: LogService, private sanitizer: DomSanitizer,
		private userResolve: UserResolve,
	) {
		this.loading = true;
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
			this.loading = false;
		});
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.contactExpert = _.get(this.data, 'contactExpert');
		this.descriptionMaxLength = this.contactExpert ? 5000 : 32000;
		this.title = this.contactExpert ? new FormControl(
			{
				disabled: true,
				value: '',
			}, Validators.required) : new FormControl('', Validators.required);
		this.description = new FormControl('', [
			Validators.required,
			Validators.maxLength(this.descriptionMaxLength),
		]);
		this.modalHeading = this.contactExpert ? I18n.get('_CSTitle_') :
			I18n.get('_SupportContact_');
		this.supportForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
		this.getTopicList();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
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
		if (this.contactExpert) {
			this.supportForm.patchValue({ title: _.get(this.items, [8, 'name']) });
		}
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
	 * Contact a Designated Expert on done buttom
	 */
	public sendSupportEmail () {
		if (this.supportForm.valid) {
			const userDetails = _.get(this.profileService.getProfile(), 'cpr');
			const params = {
				body: this.supportForm.controls.description.value,
				cc: _.get(userDetails, 'pf_auth_email'),
				subject: this.items[8].name,
			};
			this.loading = true;
			this.emailControllerService.contactSupport(params)
				.pipe(
					catchError(err => {
						this.loading = false;
						this.toggle = true;
						this.success = false;
						this.logger.error(err);

						return empty();
					}),
					takeUntil(this.destroy$),
				)
				.subscribe((response: ContactSupportResponse) => {
					this.loading = false;
					this.toggle = true;
					this.success = response.status ? true : false;
				});
		}
	}

	/**
	 * creates email template
	 * @returns email template
	 */
	public createEmailTemplate () {
		const userDetails = _.get(this.profileService.getProfile(), 'cpr', { });

		return `${userDetails.pf_auth_firstname}` +
			` ${userDetails.pf_auth_lastname}` + ` ${I18n.get('_SupportSentBy_')}\n\n` +
			`${I18n.get('_SupportCiscoID_')}\n` + `${userDetails.pf_auth_uid}\n\n` +
			`${I18n.get('_SupportName_')}\n` +
			`${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname}\n\n` +
			`${I18n.get('_SupportEmail_')}\n` + `${userDetails.pf_auth_email}\n\n` +
			`${I18n.get('_SupportAccessLevel_')}\n` + `${userDetails.pf_auth_user_level}\n\n` +
			`${I18n.get('_SupportCustomerId_')}\n` + `${this.customerId}\n\n` +
			`${I18n.get('_SupportMessageSection_')}\n\n` +
			`${I18n.get('_SupportEmailTopic_')}\n` +
			`${this.supportForm.controls.title.value}\n\n` +
			`${I18n.get('_SupportEmailDescription_')}\n` +
			`${this.sanitizer.sanitize(SecurityContext.HTML,
				this.supportForm.controls.description.value)}\n\n` +
			`${I18n.get('_SupportMessageSection_')}\n\n` +
			`${I18n.get('_SupportOriginURL_')}\n` + `${window.location.href}`;
	}
}
