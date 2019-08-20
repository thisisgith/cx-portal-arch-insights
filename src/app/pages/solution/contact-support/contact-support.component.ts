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
	 * open the Contact a Designated Expert modal
	 */
	public openModal () {
		this.supportForm.reset({ title: this.items[8] });
		this.responseAvailable = false;
		this.modelHeading = I18n.get('_CSTitle_');
		this.cuiModalService.show(this.contactSupportTemp);
	}
}
