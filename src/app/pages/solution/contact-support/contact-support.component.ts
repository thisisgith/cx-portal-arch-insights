import { Component, ViewChild, TemplateRef } from '@angular/core';
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
 * ContactSupport Component
 */
@Component({
	selector: 'app-contact-support',
	styleUrls: ['./contact-support.component.scss'],
	templateUrl: './contact-support.component.html',
})
export class ContactSupportComponent {

	constructor (
		private logger: LogService,
		public cuiModalService: CuiModalService,
		public osvService: OSVService,
		public profileService: ProfileService,
	) {
		this.logger.debug('ContactSupportComponent Created!');
	}

	@ViewChild('content', { static: false }) public contactSupportTemp: TemplateRef<any>;
	public supportForm: FormGroup;
	public title: FormControl = new FormControl('', Validators.required);
	public description: FormControl = new FormControl('', Validators.required);

	public emailMessage = '';
	public ccRecipient = '';
	public showLoader = false;
	public modelHeading = I18n.get('_ContactUsInitialTitle_');
	public emailParams: OSVService.ContactSupportParams;
	public emailResponse: ContactSupportResponse;
	public responseAvailable = false;
	public emailStatus = false;
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
		this.supportForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
		this.responseAvailable = false;
		this.getTopicList();
		this.ccRecipient = this.profileService.getProfile().cpr.pf_auth_email;
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
	}

	/**
	 * Contact a Designated Expert on done buttom
	 * @param topicParam subject of email
	 * @param topicDetailsParam body of email
	 */

	public submitSupportTopic (topicParam: string, topicDetailsParam: string) {
		this.emailParams = {
			body: topicDetailsParam,
			cc: this.ccRecipient,
			subject: topicParam,
		};
		this.showLoader = true;
		this.osvService.contactSupport(this.emailParams)
			.pipe(
				catchError(err => {
					this.showLoader = false;
					this.responseAvailable = true;
					this.emailMessage = I18n.get('_ContactUsEmailFailedMessage_');
					this.modelHeading = I18n.get('_ContactUsFailedTitle_');
					this.logger.error(err);

					return empty();
				}),
				takeUntil(this.destroy$),
			)
			.subscribe((response: ContactSupportResponse) => {
				if (response.status) {
					this.showLoader = false;
					this.emailStatus = true;
					this.responseAvailable = true;
					this.modelHeading = response.message;
					this.emailMessage = response.messageDetails;
				} else {
					this.showLoader = false;
					this.emailStatus = false;
					this.responseAvailable = true;
					this.modelHeading = response.message;
					this.emailMessage = response.messageDetails;
				}
			});
	}

	/**
	 * open the Contact a Designated Expert modal
	 */
	public openModal () {
		this.supportForm.reset();
		this.responseAvailable = false;		
		this.modelHeading = I18n.get('_ContactUsInitialTitle_');
		this.cuiModalService.show(this.contactSupportTemp);
	}
}
