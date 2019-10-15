import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CuiModalService, CuiTableOptions } from '@cisco-ngx/cui-components';

import { Asset, NetworkElement } from '@sdp-api';
import { CaseOpenData } from '../caseOpenData';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Component to display view after a Case Open submit. Either with success message
 * and case info or error messages.
 */
@Component({
	selector: 'app-case-submitted',
	styleUrls: ['./case-submitted.component.scss'],
	templateUrl: './case-submitted.component.html',
})
export class CaseSubmittedComponent {
	@Input() public errors: string[];
	@Input() public assets: (Asset | NetworkElement)[];
	@Input() public caseData: CaseOpenData;

	public requestRma = false;

	public assetListTableOptions: CuiTableOptions;

	constructor (
		public cuiModalService: CuiModalService,
		private router: Router,
	) { }

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		if (this.assets.length > 1) {
			this.buildAssetsTable();
		}
	}

	/**
	 * Build assets table
	 */
	public buildAssetsTable () {
		this.assetListTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'serialNumber',
					name: I18n.get('_SerialNumber_'),
					width: '25%',
					sortable: false,
				},
				{
					key: 'deviceName' || 'hostName',
					name: I18n.get('_HostName_'),
					sortable: false,
				},
				{
					key: 'productId',
					name: I18n.get('_Model_'),
					sortable: false,
				},
			],
			wrapText: true,
			striped: false,
		});
	}

	/**
	 * Close modal
	 */
	public close () {
		this.cuiModalService.onCancel.next();
		this.cuiModalService.hide();
	}

	/**
	 * When user selects a "View Case" button, take them to the details
	 */
	public async onViewCase () {
		await this.router.navigate(['/solution/resolution'], {
			queryParams: { case: this.caseData.caseNum },
		});
		this.close();
	}
}
