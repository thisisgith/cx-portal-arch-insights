import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CaseParams } from '@cui-x/services';

import { Asset, HardwareInfo } from '@sdp-api';

/**
 * Details Header Component
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'details-header',
	styleUrls: ['./details-header.component.scss'],
	templateUrl: './details-header.component.html',
})
export class DetailsHeaderComponent {
	@Input('asset') public asset: Asset;
	@Input('hardwareData') public hardwareData: HardwareInfo;
	@Output() public fullscreenEvent = new EventEmitter<boolean>();
	@Output() public closeEvent = new EventEmitter<boolean>();

	public componentData = {
		openCases: 0,
	};
	private caseParams: CaseParams = new CaseParams({
		page: 0,
		size: 20,
		sort: 'lastModifiedDate,desc',
		statusTypes: 'O',
	});

	public status = {
		loading: {
			cases: false,
		},
	};
	public hidden = true;
	public fullscreen = false;

	public actionDropdownActive = false;
	public casesDropdownActive = false;

	/**
	 * Toggles the action dropdown
	 */
	public toggleActiveAction () {
		this.actionDropdownActive = !this.actionDropdownActive;
	}

	/**
	 * Toggles the open cases dropdown
	 */
	public toggleActiveCases () {
		this.casesDropdownActive = !this.casesDropdownActive;
	}
}
