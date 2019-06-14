import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CaseParams, CaseService } from '@cui-x/services';
import { SolutionService } from '../../../solution.service';

import * as _ from 'lodash';
import { HardwareInfo } from '@cui-x/sdp-api';

import { LogService } from '@cisco-ngx/cui-services';

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
	@Input('asset') public asset: HardwareInfo;
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

	constructor (
		private caseService: CaseService,
		private solutionService: SolutionService,
		private logger: LogService,
	) { }

	/**
	 * Clear the currently displayed asset and close the details window
	 */
	public clearAsset () {
		this.asset = null;
		this.solutionService.sendCurrentAsset(null);
		this.hidden = true;
		this.closeEvent.emit(this.hidden);
	}

	// TODO WRITE TEST
	/**
	 * Toggle fullscreen details
	 */
	public toggleFullscreen () {
		this.fullscreen = !this.fullscreen;
		this.fullscreenEvent.emit(this.fullscreen);
	}

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
