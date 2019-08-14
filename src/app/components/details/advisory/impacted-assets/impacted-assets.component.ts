import {
	Component,
	Input,
	OnInit,
	TemplateRef,
	ViewChild,
	Output,
	EventEmitter,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	InventoryService, Assets, Asset, DiagnosticsService, BugImpactedAssetsResponse,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { CuiTableOptions, CuiTableColumnOption } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { AdvisoryType } from '@interfaces';

/**
 * The interface for impacted asset ids utilizing managedNeId
 */
export interface AssetIds {
	impacted?: string[];
	potentiallyImpacted?: string[];
}

/**
 * Security Details Component
 */
@Component({
	selector: 'advisory-impacted-assets',
	styleUrls: ['./impacted-assets.component.scss'],
	templateUrl: './impacted-assets.component.html',
})
export class AdvisoryImpactedAssetsComponent implements OnInit {

	@Input('id') public id: string;
	@Input('type') public type: AdvisoryType;
	@Input('assetIds') public assetIds: AssetIds;
	@Input('customerId') public customerId: string;
	@Output('impactedCount') public impactedCount = new EventEmitter<number>();
	@ViewChild('deviceColumn', null) public deviceColumn: TemplateRef<{ }>;
	@ViewChild('versionColumn', null) public softwareVersionColumn: TemplateRef<{ }>;
	@ViewChild('recommendedVersionColumn', null) public recommendedVersionColumn: TemplateRef<{ }>;

	public assetsTable: CuiTableOptions;
	public isLoading = false;
	public potentiallyImpacted: Asset[] = [];
	public impacted: Asset[] = [];
	public selectedAsset: Asset;
	private params: {
		assets?: InventoryService.GetAssetsParams;
		bugAssets?: DiagnosticsService.GetCriticalBugsAssetsParams;
	};

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private diagnosticsService: DiagnosticsService,
	) { }

	/**
	 * Fetches the assets affected by the field notice
	 * @returns the observable
	 */
	private getAssets () {
		this.isLoading = true;

		this.impacted = [];
		this.potentiallyImpacted = [];

		const impacted = _.get(this.assetIds, 'impacted', []);
		const potentiallyImpacted = _.get(this.assetIds, 'potentiallyImpacted', []);

		this.inventoryService.getAssets(this.params.assets)
		.pipe(
			map((response: Assets) => {
				const data = _.get(response, 'data', []);

				this.impacted =
					_.filter(data,
						x => _.includes(impacted, _.get(x, 'managedNeId'))) || [];

				this.potentiallyImpacted =
					_.filter(data,
						x => _.includes(potentiallyImpacted, _.get(x, 'managedNeId'))) || [];

				this.impactedCount.emit(this.impacted.length + this.potentiallyImpacted.length);
			}),
			catchError(err => {
				this.impactedCount.emit(0);
				this.logger.error('advisory-details:impacted-assets.component : getAssets() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		)
		.subscribe(() => {
			this.isLoading = false;
		});
	}

	/**
	 * Fetching the bug assets
	 */
	private fetchBugAssets () {
		this.isLoading = true;

		this.impacted = [];
		this.potentiallyImpacted = [];

		this.diagnosticsService.getCriticalBugsAssets(this.params.bugAssets)
		.pipe(
			map((response: BugImpactedAssetsResponse) => {
				const data = _.get(response, 'data', []);

				this.impacted = data;

				this.impactedCount.emit(this.impacted.length + this.potentiallyImpacted.length);
			}),
			catchError(err => {
				this.impactedCount.emit(0);
				this.logger.error('advisory-details:impacted-assets.component : getAssets() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		)
		.subscribe(() => {
			this.isLoading = false;
		});
	}

	/**
	 * refreshes the component
	 */
	public refresh () {
		this.params = { };
		this.assetsTable = new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: this.type === 'bug' ? 'hostName' : 'deviceName',
					name: I18n.get('_Device_'),
					sortable: true,
					sortDirection: 'asc',
					sorting: true,
					template: this.deviceColumn,
				},
				{
					key: 'ipAddress',
					name: I18n.get('_IPAddress_'),
					render: item => item.ipAddress ? item.ipAddress : I18n.get('_NA_'),
					sortable: true,
					width: '100px',
				},
				{
					key: this.type === 'bug' ? 'softwareVersion' : 'osVersion',
					name: I18n.get('_SoftwareVersion_'),
					sortable: true,
					template: this.softwareVersionColumn,
					width: '100px',
				},
				{
					name: I18n.get('_RecommendedSoftwareVersion_'),
					sortable: false,
					template: this.recommendedVersionColumn,
					width: '125px',
				},
			],
			padding: 'compressed',
			striped: false,
			wrapText: false,
		});

		if (this.type === 'bug' && this.id) {
			_.set(this.params, 'bugAssets', {
				cdetId: [this.id],
				customerId: this.customerId,
			});

			this.fetchBugAssets();
		} else if (this.assetIds) {
			_.set(this.params, 'assets', {
				customerId: this.customerId,
				managedNeId: _.concat(
					_.get(this.assetIds, 'impacted', []),
					_.get(this.assetIds, 'potentiallyImpacted', []),
				),
				sort: ['deviceName:ASC'],
			});

			this.getAssets();
		}
	}

	/**
	 * Column Sort Handler
	 * @param options the selected column
	 */
	public onColumnSort (options: CuiTableColumnOption) {
		_.set(this.params, [this.type === 'bug' ? 'bugAssets' : 'assets', 'sort'],
			[`${options.key}:${options.sortDirection.toUpperCase()}`]);

		if (this.type === 'bug') {
			this.fetchBugAssets();
		} else {
			this.getAssets();
		}
	}

	/**
	 * Initializes the component
	 */
	public ngOnInit () {
		this.refresh();
	}
}
