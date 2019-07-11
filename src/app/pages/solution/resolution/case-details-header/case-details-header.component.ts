import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CaseService } from '@cui-x/services';
import { RMAService } from '@services';
import { FormControl, FormGroup } from '@angular/forms';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { caseSeverities } from '@classes';

import * as _ from 'lodash-es';

/**
 * Case Details Header Component
 */
@Component({
	selector: 'app-case-details-header',
	styleUrls: ['./case-details-header.component.scss'],
	templateUrl: './case-details-header.component.html',
})
export class CaseDetailsHeaderComponent {

	public caseDetails: any;
	public isAddNoteClicked = false;
	public isRMAClicked = false;
	public rma: FormControl = new FormControl('');
	public rmaForm: FormGroup;
	public rmaTable: CuiTableOptions;
	public rmaDetails: any[] = [];
	@ViewChild('createdDate', { static: true }) private createdDateTemplate: TemplateRef<{ }>;

	constructor (
		private caseService: CaseService, private rmaService: RMAService,
	) { }

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.getCaseDetails();
		this.getRMADetails();
	}

	/**
	 * getCaseDetails function
	 * @returns the case details
	 */
	public getCaseDetails () {
		return this.caseService.fetchCaseDetails('686569635')
			.subscribe(
				(response: any) => {
					this.caseDetails = response;
				});
	}

	/**
	 * getseverity color
	 * @param severity of the case
	 * @returns color for the severity
	 */
	public getSeverityColor (severity: string) {
		const severityInt = parseInt(severity, 10);
		return _.get(caseSeverities[severityInt], 'class');
	}

	/**
	 * toggles add note section
	 */
	public toggleAddNote () {
		this.isAddNoteClicked = !this.isAddNoteClicked;
	}

	/**
	 * toggles RMA list section
	 */
	public toggleRMAList () {
		this.isRMAClicked = !this.isRMAClicked;
	}

	/**
	 * get RMA Details
	 */
	public getRMADetails () {
		this.rmaDetails = [
			{
				contatcId: '88332129',
				name: 'RMA 871245',
				orderDate: '2019-06-25T22:20:01.000Z',
				shipTo: 'ACE Company, 123 Main Street, Your town CO 80231',
				status: 'blocked',
			},
			{
				contatcId: '88332129',
				name: 'RMA 871246',
				orderDate: '2019-06-13T22:20:01.000Z',
				shipTo: 'ACE Company, 123 Main Street, Your town CO 80231',
				status: 'blocked',
			},
		];
		// this.rmaService.getByNumber('800000000')
		// 	.subscribe(
		// 		(response: any) => {
		// 			if (response.returns) {
		// 				this.rmaDetails = response.returns.RmaRecord;

		// 				// this.rmaDetails.forEach(el => {
		// 				// 	el.created = this.fromNowPipe.transform(new Date(el.created))
		// 				//    })

		this.buildTable();
		// 			}
		// 		});

	}

	/**
	 * builds RMA table
	 */
	private buildTable () {
		if (!this.rmaTable) {
			this.rmaTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'name',
						// name: I18n.get('_Device_'),
						name: 'Name',
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						width: '25px',
					},
					{
						key: 'status',
						name: 'Status',
						sortable: true,
						value: 'status',
					},
					{
						key: 'shipToInfo.customername',
						// name: I18n.get('_Device_'),
						name: 'Ship To',
						sortable: true,
						// sortDirection: 'asc',
						value: 'shipToInfo.customername',
						width: '10px',
					},
					{
						key: 'contractId',
						name: 'Contact Number',
						sortable: true,
						value: 'contractId',
					},
					{
						key: 'orderDate',
						name: 'Created',
						sortable: true,
						template: this.createdDateTemplate,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'loose',
				selectable: true,
				singleSelect: true,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}

		this.rmaForm = new FormGroup({
			rma: this.rma,
		});
	}
}
