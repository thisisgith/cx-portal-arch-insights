import {
	Component, Output, EventEmitter, TemplateRef,
	ViewChild, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { environment } from '@environment';

/**
 * Related RMA list Component
 */
@Component({
	selector: 'app-related-rma',
	styleUrls: ['./related-rma.component.scss'],
	templateUrl: './related-rma.component.html',
})
export class RelatedRmaComponent {

	public rma: FormControl = new FormControl('');
	public rmaForm: FormGroup;
	public rmaTable: CuiTableOptions;
	public loading = false;
	public rmaToolUrl = environment.rmaToolUrl;
	@ViewChild('createdDateTmpl', { static: true }) private createdDateTemplate: TemplateRef<{ }>;
	@ViewChild('shipToTmpl', { static: true }) private shipToTemplate: TemplateRef<{ }>;
	@ViewChild('caseRmaNoTemplate', { static: true }) public caseRmaNoTemplate: TemplateRef<{ }>;
	@Output('close') public close = new EventEmitter<boolean>();
	@Input() public rmaRecords: any;

	/**
 	* OnInit lifecycle hook
 	*/
	public ngOnInit () {
		this.buildTable();
	}

	/**
	 * builds RMA table
	 */
	public buildTable () {
		if (!this.rmaTable) {
			this.rmaTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'rmaNo',
						name: I18n.get('_Name_'),
						sortable: true,
						sorting: true,
						template: this.caseRmaNoTemplate,
						width: '25px',
					},
					{
						key: 'status',
						name: I18n.get('_Status_'),
						sortable: true,
						value: 'status',
					},
					{
						name: I18n.get('_ShipTo_'),
						sortable: true,
						template: this.shipToTemplate,
						width: '10px',
					},
					{
						key: 'contractId',
						name: I18n.get('_ContractNumber_'),
						sortable: true,
						value: 'contractId',
					},
					{
						name: I18n.get('_Created_'),
						sortable: true,
						template: this.createdDateTemplate,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'loose',
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}

		this.rmaForm = new FormGroup({
			rma: this.rma,
		});
	}

	/**
	 * Hide the rma list popup
	 */
	public hide () {
		this.close.emit(true);
	}

	/**
	 * Checks if our currently selected case has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		if (changes.rmaRecords) {
			this.loading = (changes.rmaRecords.currentValue.length > 0
				|| !changes.rmaRecords.firstChange) ? false : true;
		}
	}
}
