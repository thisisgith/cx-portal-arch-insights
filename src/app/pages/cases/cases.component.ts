import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Cases component
 */
@Component({
	selector: 'app-cases',
	styleUrls: ['./cases.component.scss'],
	templateUrl: './cases.component.html',
})
export class CasesComponent  implements OnInit {
	@ViewChild('caseInfo', { static: true }) public caseInfoTemplate: TemplateRef<{ }>;
	@ViewChild('caseMoreInfo', { static: true }) public caseMoreInfoTemplate: TemplateRef<{ }>;
	@ViewChild('caseSubmit', { static: true }) public caseSubmitTemplate: TemplateRef<{ }>;

	public visibleTemplate: TemplateRef<{ }>;
	public lanTech = 'LAN Switching';
	public lanSubTech = 'Cat9300';
	public dnaTech = ' Cisco DNA - Software Defined Access';
	public dnaSubTech = 'Cisco DNA Center Appliance (SD-Access)';
	public voiceTech = 'Voice - Communications Manager';
	public voiceSubTech = 'Voice Quality - IP Phone to IP Phone';
	public configProblem = 'Configuration';
	public operateProblem = 'Operate';
	public installProblem = 'Installation';
	public errorSubProblem = 'Error Messages, Logs, Debugs';
	public configSubProblem  = 'Configuration Assistance';

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('CasesComponent Created!');
	}

	/**
	 * Changes to the given cases page
	 * @param template page to change to
	 */
	public showCasesPage (template: string) {
		switch (template) {
			case 'caseMoreInfo':
				this.visibleTemplate = this.caseMoreInfoTemplate;
				break;
			case 'caseSubmit':
				this.visibleTemplate = this.caseSubmitTemplate;
				break;
			default:
				this.visibleTemplate = this.caseInfoTemplate;
		}
	}

	/**
	 * Function which instanstiates the cases page to the initial view
	 */
	public ngOnInit () {
		this.visibleTemplate = this.caseInfoTemplate;
	}
}
