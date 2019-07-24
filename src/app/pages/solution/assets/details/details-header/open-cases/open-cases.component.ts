import { Component, Output, EventEmitter, TemplateRef, ViewChild, Input } from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';

import { caseSeverities } from '@classes';
import * as _ from 'lodash-es';

/**
 * Open Cases list Component
 */
@Component({
	selector: 'app-open-cases',
	styleUrls: ['./open-cases.component.scss'],
	templateUrl: './open-cases.component.html',
})
export class OpenCasesComponent {

	public caseTable: CuiTableOptions;
	@ViewChild('severityTemplate', { static: true }) public severityTemplate: TemplateRef<any>;
	@ViewChild('statusTemplate', { static: true }) public statusTemplate: TemplateRef<any>;
	@ViewChild('updatedTemplate', { static: true }) public updatedTemplate: TemplateRef<any>;
	@Output('close') public close = new EventEmitter<boolean>();
	@Input() public openCases: any[];

	/**
 	* OnInit lifecycle hook
 	*/
	 public ngOnInit () {
		this.buildTable();
	}

	/**
	 * Build the open case table
	 */
	private buildTable () {
		this.caseTable = new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: 'priority',
					name: I18n.get('_RMACaseSeverity_'),
					sortable: true,
					template: this.severityTemplate,
				},
				{
					key: 'caseNumber',
					name: I18n.get('_RMACaseID_'),
					sortable: true,
				},
				{
					key: 'summary',
					name: I18n.get('_RMACaseSummary_'),
					sortable: true,
				},
				{
					key: 'status',
					name: I18n.get('_RMACaseStatus_'),
					sortable: true,
					template: this.statusTemplate,
				},
				{
					key: 'lastModifiedDate',
					name: I18n.get('_RMACaseUpdatedDate_'),
					sortable: true,
					sorting: true,
					template: this.updatedTemplate,
				},
			],
			dynamicData: true,
			hover: true,
			sortable: true,
			striped: false,
			wrapText: true,
		});
	}

	/**
	 * Get the color of severity icon
	 * @param severity string representation of case severity
	 * @returns Corresponding color to case severity
	 */
	 public getSeverityColor (severity: string) {
		const severityInt = parseInt(severity, 10);

		return _.get(caseSeverities[severityInt], 'class', 'info');
	}

	/**
	 * Hide the case list popup
	 */
	public hide () {
		this.close.emit(true);
	}
}
