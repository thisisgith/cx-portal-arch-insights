import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { HardwareInfo } from '@cui-x/sdp-api';
import { SolutionService } from '../../solution.service';
import { CaseParams, CaseService } from '@cui-x/services';

import { CuiTimelineItem } from '@cisco-ngx/cui-components';

import * as _ from 'lodash';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Asset Details Component
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'asset-details',
	styleUrls: ['./details.component.scss'],
	templateUrl: './details.component.html',
})
export class AssetDetailsComponent implements OnChanges, OnInit {

	@Input('asset') public asset: HardwareInfo;
	@ViewChild('timelineItem', { static: true }) private timelineItemTemplate: TemplateRef<{ }>;

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
			timeline: false,
		},
	};
	public hidden = true;
	public fullscreen = false;

	public timelineData: CuiTimelineItem[] = [];

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
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.refresh();
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		this.fetchCases();
		if (this.asset) {
			this.hidden = false;
		}
	}

	/**
	 * determine if fullscreen from child data
	 * @param $event gets the boolean value
	 */
	public determineFullScreen ($event: boolean) {
		if ($event) {
			this.fullscreen = true;
		} else {
			this.fullscreen = false;
		}
	}

	/**
	 * determine if close from child data
	 * @param $event gets the boolean value
	 */
	public determineClose ($event: boolean) {
		if ($event) {
			this.hidden = true;
		} else {
			this.hidden = false;
		}
	}
}
