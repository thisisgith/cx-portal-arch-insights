import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { CaseParams, CaseService } from '@cui-x/services';
import {
	PolicyResponseModel, Asset,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { of, Subject } from 'rxjs';
import {
	map,
	catchError,
	takeUntil,
} from 'rxjs/operators';
import { ModSystemAsset, ModHardwareAsset } from '@interfaces';

/**
 * Asset Details Header Component
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'asset-details-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class AssetDetailsHeaderComponent implements OnChanges, OnInit, OnDestroy {

	@Input('asset') public asset: Asset;
	@Input('systemAsset') public systemAsset: ModSystemAsset;
	@Input('hardwareAsset') public hardwareAsset: ModHardwareAsset;
	@Input('scanPolicy') public scanPolicy: PolicyResponseModel;
	@Input('customerId') public customerId: string;
	@Input('scanStatus') public scanStatus: {
		error: boolean;
		inProgress: boolean;
	} = {
		error: false,
		inProgress: false,
	};

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
			eligibility: false,
			overall: false,
		},
	};
	public casesDropdownActive = false;
	private destroyed$: Subject<void> = new Subject<void>();

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
	 * @returns the observable
	 */
	private fetchCases () {
		this.status.loading.cases = true;
		const params = _.cloneDeep(this.caseParams);
		_.set(params, 'serialNumbers', this.systemAsset.serialNumber);

		return this.caseService.read(params)
		.pipe(
			takeUntil(this.destroyed$),
			map(data => {
				this.openCases = _.get(data, 'content', []);
				this.status.loading.cases = false;
			}),
			catchError(err => {
				this.openCases = [];
				this.status.loading.cases = false;
				this.logger.error('asset-details:header.component : fetchCases()' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Refreshes the data
	 */
	public refresh () {
		_.set(this.status, ['scan', 'inProgress'], false);
		if (this.systemAsset && _.get(this.systemAsset, 'serialNumber')) {
			this.status.loading.overall = true;

			this.fetchCases()
			.subscribe(() => {
				this.status.loading.overall = false;
			});
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Destroys the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['systemAsset', 'currentValue']);
		if (currentAsset && !changes.systemAsset.firstChange) {
			this.ngOnDestroy();
			this.refresh();
		}
	}
}
