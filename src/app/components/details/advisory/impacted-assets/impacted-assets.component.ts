import {
	Component,
	Input,
	OnInit,
	TemplateRef,
	ViewChild,
	Output,
	EventEmitter,
	SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	InventoryService,
	Asset,
	DiagnosticsService,
	BugImpactedAssetsResponse,
	NetworkElementResponse,
	NetworkElement,
	RacetrackTechnology,
	RacetrackSolution,
	Assets,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	catchError,
	takeUntil,
	mergeMap,
} from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { CuiTableOptions, CuiTableColumnOption } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { AdvisoryType } from '@interfaces';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import { RacetrackInfoService } from '@services';

/**
 * The interface for impacted asset ids utilizing managedNeId
 */
export interface AssetIds {
	impacted?: string[];
	potentiallyImpacted?: string[];
}

/**
 * The interface for our output
 */
export interface Impacted {
	impacted: (Asset | NetworkElement)[];
	potentiallyImpacted: (Asset | NetworkElement)[];
	assets: Asset[];
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
	@Output('assets') public assets = new EventEmitter<Impacted>();
	@ViewChild('ipAddressColumn', null) public ipAddressColumn: TemplateRef<{ }>;
	@ViewChild('deviceColumn', null) public deviceColumn: TemplateRef<{ }>;
	@ViewChild('versionColumn', null) public softwareVersionColumn: TemplateRef<{ }>;
	@ViewChild('recommendedVersionColumn', null) public recommendedVersionColumn: TemplateRef<{ }>;

	public assetsTable: CuiTableOptions;
	public isLoading = false;
	public potentiallyImpacted: (Asset | NetworkElement)[] = [];
	public impacted: (Asset | NetworkElement)[] = [];
	public impactedAssets: Asset[] = [];
	public selectedAsset: Asset | NetworkElement;
	private params: {
		bugAssets?: DiagnosticsService.GetCriticalBugsAssetsParams;
		elements?: InventoryService.GetNetworkElementsParams;
		assets?: InventoryService.GetAssetsParams;
	};
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private diagnosticsService: DiagnosticsService,
		private racetrackInfoService: RacetrackInfoService,
	) { }

	/**
	 * Fetches the network elements affected
	 * @returns the observable
	 */
	private fetchNetworkElements () {
		this.isLoading = true;

		this.impacted = [];
		this.potentiallyImpacted = [];

		const impacted = _.get(this.assetIds, 'impacted', []);
		const potentiallyImpacted = _.get(this.assetIds, 'potentiallyImpacted', []);

		this.inventoryService.getNetworkElements(this.params.elements)
		.pipe(
			mergeMap((response: NetworkElementResponse) => {
				const data = _.get(response, 'data', []);

				this.impacted =
					_.filter(data,
						x => _.includes(impacted, _.get(x, 'managedNeId'))) || [];

				this.potentiallyImpacted =
					_.filter(data,
						x => _.includes(potentiallyImpacted, _.get(x, 'managedNeId'))) || [];

				return this.fetchAssets();
			}),
			catchError(err => {
				this.logger.error('advisory-details:impacted-assets.component : ' +
				 `fetchNetworkElements() :: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		)
		.subscribe(() => {
			this.assets.emit({
				assets: this.impactedAssets,
				impacted: this.impacted,
				potentiallyImpacted: this.potentiallyImpacted,
			});
			this.impactedCount.emit(this.impacted.length + this.potentiallyImpacted.length);
			this.isLoading = false;
		});
	}

	/**
	 * Fetches the assets from /assets api
	 * @returns the observable
	 */
	private fetchAssets () {
		const serials = _.uniq(
			_.map(_.concat(this.impacted, this.potentiallyImpacted), 'serialNumber'));

		if (!serials.length) {
			return of({ });
		}
		_.set(this.params.assets, 'serialNumber', serials);

		return this.inventoryService.getAssets(this.params.assets)
		.pipe(
			map((response: Assets) => {
				this.impactedAssets = _.get(response, 'data', []);
			}),
			catchError(err => {
				this.logger.error('advisory-details:impacted-assets.component : fetchAssets() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);

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
			mergeMap((response: BugImpactedAssetsResponse) => {
				this.impacted = _.get(response, 'data', []);

				return this.fetchAssets();
			}),
			catchError(err => {
				this.logger.error('advisory-details:impacted-assets.component : getAssets() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		)
		.subscribe(() => {
			this.impactedCount.emit(this.impacted.length + this.potentiallyImpacted.length);
			this.assets.emit({
				assets: this.impactedAssets,
				impacted: this.impacted,
				potentiallyImpacted: this.potentiallyImpacted,
			});
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
					key: 'hostName',
					name: I18n.get('_Device_'),
					sortable: true,
					sortDirection: 'asc',
					sorting: true,
					template: this.deviceColumn,
					width: '300px',
				},
				{
					key: 'ipAddress',
					name: I18n.get('_IPAddress_'),
					sortable: true,
					template: this.ipAddressColumn,
				},
				{
					key: this.type === 'bug' ? 'softwareVersion' : 'swVersion',
					name: I18n.get('_SoftwareVersion_'),
					sortable: true,
					template: this.softwareVersionColumn,
				},
				{
					name: I18n.get('_RecommendedSoftwareVersion_'),
					sortable: false,
					template: this.recommendedVersionColumn,
				},
			],
			padding: 'compressed',
			striped: false,
			wrapText: true,
		});

		_.set(this.params, 'assets', {
			customerId: this.customerId,
			page: 1,
			rows: 100,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		});

		if (this.type === 'bug' && this.id) {
			_.set(this.params, 'bugAssets', {
				cdetId: [this.id],
				customerId: this.customerId,
				page: 1,
				rows: 100,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			});

			this.fetchBugAssets();
		} else if (this.assetIds) {
			_.set(this.params, 'elements', {
				customerId: this.customerId,
				managedNeId: _.concat(
					_.get(this.assetIds, 'impacted', []),
					_.get(this.assetIds, 'potentiallyImpacted', []),
				),
				page: 1,
				rows: 100,
				solution: this.selectedSolutionName,
				sort: ['hostName:ASC'],
				useCase: this.selectedTechnologyName,
			});

			this.fetchNetworkElements();
		}
	}

	/**
	 * Column Sort Handler
	 * @param options the selected column
	 */
	public onColumnSort (options: CuiTableColumnOption) {
		_.set(this.params, [this.type === 'bug' ? 'bugAssets' : 'elements', 'sort'],
			[`${options.key}:${options.sortDirection.toUpperCase()}`]);

		if (this.type === 'bug') {
			this.fetchBugAssets();
		} else {
			this.fetchNetworkElements();
		}
	}

	/**
	 * Initializes the component
	 */
	public ngOnInit () {
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.refresh();
			}
		});
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentId = _.get(changes, ['id', 'currentValue']);
		if (currentId && !changes.id.firstChange) {
			this.refresh();
		}
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
