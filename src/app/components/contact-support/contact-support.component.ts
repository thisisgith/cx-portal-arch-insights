import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuiModalService, CuiModalContent, CuiInputOptions } from '@cisco-ngx/cui-components';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { EmailControllerService, EmailRequest } from '@sdp-api';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';

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
	public title: FormControl = new FormControl('', Validators.required);
	public description: FormControl = new FormControl('', Validators.required);
	public userMailId: string = this.profileService.getProfile().cpr.pf_auth_email;
	private destroy$ = new Subject();
	public textOptions: CuiInputOptions = new CuiInputOptions({
		autofocus: false,
		required: true,
		minLength: 0,
		maxLength: 32000,
		rows: 10,
	});
	public items: any[] = [];
	// public items: any[] = [
	// 	{
	// 		name: I18n.get('_SupportCXPortal_'),
	// 		value: I18n.get('_SupportCXPortal_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportCXCollector_'),
	// 		value: I18n.get('_SupportCXCollector_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportInquiries_'),
	// 		value: I18n.get('_SupportInquiries_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportUpgrades_'),
	// 		value: I18n.get('_SupportUpgrades_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportCiscoComm_'),
	// 		value: I18n.get('_SupportCiscoComm_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportCiscoLearning_'),
	// 		value: I18n.get('_SupportCiscoLearning_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportAskExpert_'),
	// 		value: I18n.get('_SupportAskExpert_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportRequestAccelerator_'),
	// 		value: I18n.get('_SupportRequestAccelerator_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportRequestExpert_'),
	// 		value: I18n.get('_SupportRequestExpert_'),
	// 	},
	// 	{
	// 		name: I18n.get('_SupportOther_'),
	// 		value: I18n.get('_SupportOther_'),
	// 	},
	// ];

	constructor (
		public cuiModalService: CuiModalService, private profileService: ProfileService,
		public emailControllerService: EmailControllerService,
		private logger: LogService,
	) { }

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		const topicList = I18n.get('_SupportPortalTopicList_');
		_.forEach(topicList, topic => {
			this.items.push({ name: topic, value: topic });
		});
		this.supportForm = new FormGroup({
			description: this.description,
			title: this.title,
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
				body: this.supportForm.controls.description.value,
				from: 'cxportal-noreply@cisco.com',
				htmlBody: false,
				subject: this.supportForm.controls.title.value,
				to: 'ayadunat@cisco.com', // cx-portal-support@cisco.com in prod
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
}
