import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuiModalService, CuiModalContent, CuiInputOptions } from '@cisco-ngx/cui-components';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { EmailControllerService, EmailRequest } from '@sdp-api';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
	@ViewChild('emailTemplate', { static: true }) private emailTemplate: TemplateRef<{}>;
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
		private logger: LogService, private router: Router, private location: Location,
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
		const userDetails = this.profileService.getProfile().cpr;
		console.log(`${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname} ${I18n.get('_SupportSentBy_')}

		${I18n.get('_SupportCiscoID_')}
		${userDetails.pf_auth_uid}
						
		${I18n.get('_SupportName_')}
		${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname}
						
		${I18n.get('_SupportEmail_')}
		${userDetails.pf_auth_email}
						
		${I18n.get('_SupportPhone_')}
		${userDetails.pf_auth_email}
						
		---------------------------------------------------
						
		${I18n.get('_SupportEmailTopic_')}
		${this.supportForm.controls.title.value}
						
		${I18n.get('_SupportEmailDescription_')}
		${this.supportForm.controls.description.value}
						
		---------------------------------------------------
						
		${I18n.get('_SupportOriginURL_')}
		${window.location.href}`)
	}

	/**
	 * submit message
	 * @returns Observable with result
	 */
	public submitMessage () {
		if (this.supportForm.valid) {
			this.loading = true;
			//console.log("email" + this.emailTemplate.elementRef.nativeElement);
			const userDetails = this.profileService.getProfile().cpr;
			const accountDetails = this.profileService.getAccount();
			const cprDetails = this.profileService.getCpr();
			const requestBody: EmailRequest = {
				body: this.createEmailTemplate(),
				from: 'cxportal-noreply@cisco.com',
				htmlBody: false,
				subject: 'Support Request from the CX Portal',
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

	public createEmailTemplate () {
		const userDetails = this.profileService.getProfile();
		return `${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname} ${I18n.get('_SupportSentBy_')}

${I18n.get('_SupportCiscoID_')}
${userDetails.pf_auth_uid}
				
${I18n.get('_SupportName_')}
${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname}
				
${I18n.get('_SupportEmail_')}
${userDetails.pf_auth_email}
				
${I18n.get('_SupportPhone_')}
${userDetails.pf_auth_email}
				
---------------------------------------------------
				
${I18n.get('_SupportEmailTopic_')}
${this.supportForm.controls.title.value}
				
${I18n.get('_SupportEmailDescription_')}
${this.supportForm.controls.description.value}
				
---------------------------------------------------
				
${I18n.get('_SupportOriginURL_')}
${window.location.href}`
	}
}
