import {
	Component,
	Input,
	OnInit,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { CaseParams, CaseService } from '@cui-x/services';
import { Asset } from '@sdp-api';
import * as _ from 'lodash-es';
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
export class DetailsHeaderComponent implements OnChanges, OnInit {
	@Input('asset') public asset: Asset;

	public openCases: any[];
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
	public casesDropdownActive = false;

	constructor (
		private caseService: CaseService,
		private logger: LogService,
	) { }

	/**
	 * Toggle the open cases dropdown
	 */
	public toggleActiveCases () {
		this.casesDropdownActive = !this.casesDropdownActive;
	}

	/**
	 * Fetch the cases for the selected asset
	 */
	private fetchCases () {
		if (_.get(this.asset, 'serialNumber')) {
			this.status.loading.cases = true;
			const params = _.cloneDeep(this.caseParams);
			_.set(params, 'serialNumbers', this.asset.serialNumber);
			this.caseService.read(params)
			.subscribe(data => {
				this.openCases = _.get(data, 'content', []);
				this.status.loading.cases = false;
			},
			err => {
				this.openCases = [];
				this.status.loading.cases = false;
				this.logger.error('details-header.component : fetchCases()' +
					`:: Error : (${err.status}) ${err.message}`);
			});
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		if (this.asset) {
			this.fetchCases();
		}
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.fetchCases();
		}
	}
}
