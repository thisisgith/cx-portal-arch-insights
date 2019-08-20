import { Component, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiModalService, CuiInputOptions } from '@cisco-ngx/cui-components';
import { OSVService, ContactSupportResponse } from '@sdp-api';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { Subject, empty } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
/**
 * ContactExpert Component
 */
@Component({
	selector: 'app-contact-expert',
	styleUrls: ['./contact-expert.component.scss'],
	templateUrl: './contact-expert.component.html',
})
export class ContactExpertComponent implements OnInit, OnDestroy {

	constructor (
		private logger: LogService,
		public cuiModalService: CuiModalService,
		public osvService: OSVService,
		public profileService: ProfileService,
	) {
		this.logger.debug('ContactExpertComponent Created!');
	}

	@ViewChild('content', { static: false }) public contactSupportTemp: TemplateRef<any>;
	public supportForm: FormGroup;
	public title: FormControl = new FormControl({ value: '', disabled: true }, Validators.required);
	public description: FormControl = new FormControl('',
			[Validators.required, Validators.maxLength(5000)]);

	public emailMessage = '';
	public ccRecipient = '';
	public showLoader = false;
	public modelHeading = I18n.get('_CSTitle_');
	public emailParams: OSVService.ContactSupportParams;
	public emailResponse: ContactSupportResponse;
	public responseAvailable = false;
	private destroy$ = new Subject();
	public textareaOptions: CuiInputOptions = new CuiInputOptions({
		autofocus: true,
		maxLength: 5000,
		required: false,
		rows: 5,
	});
	public items: any[] = [];

	/**
	 * ngoninit for initializing response availability
	 * responseAvailable email set intially false here
	 * ccRecipient assigned with logged person email address
	 */
	public ngOnInit () {
		this.modelHeading = I18n.get('_CSTitle_');
		this.supportForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
		this.responseAvailable = false;
		this.getTopicList();
		const profile = this.profileService.getProfile();
		this.ccRecipient = _.get(profile, ['cpr', 'pf_auth_email']);
	}

	/**
	 * gets topic list
	 * @returns topic list
	 */
	public getTopicList () {
		const topicList = I18n.get('_SupportPortalTopicList_');
		_.forEach(topicList, topicVal => {
			this.items.push({ name: topicVal, value: topicVal });
		});
		this.supportForm.patchValue({ title: _.get(this.items, [8]) });
	}

	/**
	 * Contact a Designated Expert on done buttom
	 */
	public submitMessage () {
		this.emailParams = {
			body: this.supportForm.controls.description.value,
			cc: this.ccRecipient,
			subject: this.items[8].name,
		};
		this.showLoader = true;
		this.osvService.contactSupport(this.emailParams)
			.pipe(
				catchError(err => {
					this.showLoader = false;
					this.responseAvailable = true;
					this.emailMessage = I18n.get('_CSErrorMessage_');
					this.modelHeading = I18n.get('_CSErrorTitle_');
					this.logger.error(err);

					return empty();
				}),
				takeUntil(this.destroy$),
			)
			.subscribe((response: ContactSupportResponse) => {
				if (response.status) {
					this.showLoader = false;
					this.responseAvailable = true;
					this.modelHeading = response.message;
					this.emailMessage = response.messageDetails;
				} else {
					this.showLoader = false;
					this.responseAvailable = true;
					this.modelHeading = response.message;
					this.emailMessage = response.messageDetails;
				}
			});
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
