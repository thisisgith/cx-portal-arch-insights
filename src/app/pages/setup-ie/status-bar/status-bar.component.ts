import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SETUP_STATES } from '@classes';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';

/**
 * Reference for a step to display in the status bar
 */
export interface IESetupStatusBarStep {
	iconActiveSrc: SafeUrl;
	iconInactiveSrc: SafeUrl;
	isActive: () => boolean;
	label: string;
}

/**
 * Component for the IE Setup Wizard Status Bar
 */
@Component({
	selector: 'ie-setup-status-bar',
	styleUrls: ['./status-bar.component.scss'],
	templateUrl: './status-bar.component.html',
})
export class IESetupWizardStatusBar {
	@Input() public state: SETUP_STATES;
	public steps: IESetupStatusBarStep[] = [
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s1-on.png'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s1-off.png'),
			isActive: () => this.state === SETUP_STATES.INIT,
			label: _.toUpper(I18n.get('_PrepareToSetupCXPortal_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s2-on.png'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s2-off.png'),
			isActive: () => this.state === SETUP_STATES.INSTALL,
			label: _.toUpper(I18n.get('_InstallCXCollectorOnVM_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s3-on.png'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s3-off.png'),
			isActive: () => this.state === SETUP_STATES.CONNECT_COLLECTOR,
			label: _.toUpper(I18n.get('_ConnectVMToBrowser_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s4-on.png'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s4-off.png'),
			isActive: () => this.state === SETUP_STATES.CONFIGURE_COLLECTOR,
			label: _.toUpper(I18n.get('_ConfigureCXCollector_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s5-on.png'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s5-off.png'),
			isActive: () => this.state === SETUP_STATES.CONNECT_DNAC,
			label: _.toUpper(I18n.get('_ConnectDNAToCXCollector_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s6-on.png'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/nav/s6-off.png'),
			isActive: () => this.state === SETUP_STATES.MANAGE_USERS,
			label: _.toUpper(I18n.get('_AddUsersToCXPortal_')),
		},
	];
	constructor (
		private sanitizer: DomSanitizer,
	) {	}
}
