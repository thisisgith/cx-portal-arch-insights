import { Component, Input, OnInit, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { HardwareInfo } from '@cui-x/sdp-api';
import { SolutionService } from '../../solution.service';
import { CaseParams, CaseService } from '@cui-x/services';

import * as _ from 'lodash';
import { LogService } from '@cisco-ngx/cui-services';

/** Interface representing our tab */
interface Tab {
	disabled?: boolean;
	selected?: boolean;
	template?: TemplateRef<{ }>;
	key: string;
	title: string;
}

/**
 * Asset Details Component
 */
@Component({
	selector: 'asset-details',
	styleUrls: ['./details.component.scss'],
	templateUrl: './details.component.html',
})
export class AssetDetailsComponent implements OnInit {

	@Input('asset') public asset: HardwareInfo;
	@ViewChild('details') private detailsTemplate: TemplateRef<{ }>;

	public selectedTab: Tab;
	public componentData = {
		openCases: 0,
	};
	public assetTabs: Tab[];
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

	public actionDropdownActive = false;
	public casesDropdownActive = false;

	constructor (
		private caseService: CaseService,
		private solutionService: SolutionService,
		private logger: LogService,
	) { }

	/**
	 * Fetch the cases for the selected asset
	 */
	private fetchCases () {
		if (_.get(this.asset, 'serialNumber')) {
			this.status.loading.cases = true;
			const params = _.cloneDeep(this.caseParams);
			_.set(params, 'serialNumbers', this.asset.serialNumber);
			this.caseService.read(params)
			.subscribe((data: any) => {
				this.componentData.openCases = _.get(data, 'totalElements', 0);
				this.status.loading.cases = false;
				console.log('>>>>', data);

			},
			err => {
				this.componentData.openCases = 0;
				this.status.loading.cases = false;
				this.logger.error('assetDetails.component : fetchCases()' +
					`:: Error : (${err.status}) ${err.message}`);
			});
		}
	}

	/**
	 * Clear the currently displayed asset and close the details window
	 */
	public clearAsset () {
		this.asset = null;
		this.solutionService.sendCurrentAsset(null);
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

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.ngOnInit();
		}
	}

	/**
	 * Creates and assigns the asset tabs
	 */
	private buildTabs () {
		this.assetTabs = [
			{
				key: 'details',
				selected: true,
				template: this.detailsTemplate,
				title: '_Details_',
			},
			{
				disabled: true,
				key: 'hardware',
				title: '_Hardware_',
			},
			{
				disabled: true,
				key: 'software',
				title: '_Software_',
			},
			{
				disabled: true,
				key: 'advisories',
				title: '_Advisories_',
			},
			{
				disabled: true,
				key: 'insights',
				title: '_Insights_',
			},
			{
				disabled: true,
				key: 'activity',
				title: '_Activity_',
			},
		];

		this.selectedTab = this.assetTabs[0];
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.buildTabs();
		this.fetchCases();
	}
}
