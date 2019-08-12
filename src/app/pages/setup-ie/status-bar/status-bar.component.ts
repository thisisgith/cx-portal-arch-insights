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
	isVisited: () => boolean;
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
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s1-on.svg'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s1-off.svg'),
			isActive: () => this.state === 'init',
			isVisited: () => this.state !== 'init',
			label: _.toUpper(I18n.get('_PreRequisites_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s2-on.svg'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s2-off.svg'),
			isActive: () => this.state === 'ova',
			isVisited: () => this.state === 'ie' || this.state === 'collector',
			label: _.toUpper(I18n.get('_VirtualMachine_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s3-on.svg'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s3-off.svg'),
			isActive: () => this.state === 'ie',
			isVisited: () => this.state === 'collector',
			label: _.toUpper(I18n.get('_CiscoCXCollector_')),
		},
		{
			iconActiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s4-on.svg'),
			iconInactiveSrc: this.sanitizer
				.bypassSecurityTrustResourceUrl('assets/img/setup-ie/icons/icon-s4-off.svg'),
			isActive: () => this.state === 'collector',
			isVisited: () => this.state === 'collector',
			label: _.toUpper(I18n.get('_CiscoDNACollector_')),
		},
	];
	constructor (
		private sanitizer: DomSanitizer,
	) {	}
}
