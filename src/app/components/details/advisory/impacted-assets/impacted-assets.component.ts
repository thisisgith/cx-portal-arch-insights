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
	DiagnosticsService,
	BugImpactedAssetsResponse,
	RacetrackTechnology,
	RacetrackSolution,
	HardwareAsset,
	SystemAsset,
	HardwareAssets,
	SystemAssets,
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
	impacted: SystemAsset[];
	potentiallyImpacted: SystemAsset[];
	assets: HardwareAsset[];
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
	@ViewChild('productIdColumn', null) public productIdColumn: TemplateRef<{ }>;
	@ViewChild('versionColumn', null) public softwareVersionColumn: TemplateRef<{ }>;
	@ViewChild('serialNumberColumn', null) public serialNumberColumn: TemplateRef<{ }>;
	@ViewChild('recommendedVersionColumn', null) public recommendedVersionColumn: TemplateRef<{ }>;

	public affectedTable: CuiTableOptions;
	public potentiallyAffectedTable: CuiTableOptions;
	public isLoading = false;
	public potentiallyImpacted: SystemAsset[] = [];
	public impacted: SystemAsset[] = [];
	public impactedAssets: HardwareAsset[] = [];
	private params: {
		bugAssets?: DiagnosticsService.GetCriticalBugsAssetsParams;
		system?: InventoryService.GetSystemAssetsParams;
		assets?: InventoryService.GetHardwareAssetsParams;
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
	private fetchSystemAsset () {
		this.isLoading = true;

		this.impacted = [];
		this.potentiallyImpacted = [];

		const impacted = _.get(this.assetIds, 'impacted', []);
		const potentiallyImpacted = _.get(this.assetIds, 'potentiallyImpacted', []);

		this.inventoryService.getSystemAssets(this.params.system)
		.pipe(
			mergeMap((response: SystemAssets) => {
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
				 `fetchSystemAsset() :: Error : (${err.status}) ${err.message}`);

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

		return this.inventoryService.getHardwareAssets(this.params.assets)
		.pipe(
			map((response: HardwareAssets) => {
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
		const defaultOptions = {
			bordered: true,
			columns: null,
			padding: 'compressed',
			striped: false,
			wrapText: true,
		};
		const affectedOptions = _.cloneDeep(defaultOptions);
		const potentiallyAffectedOptions = _.cloneDeep(defaultOptions);

		switch (this.type) {
			case 'security':
				const securityAffectedTableColumns = [
					{
						key: 'deviceName',
						name: I18n.get('_SystemName_'),
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
						key: 'swVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						template: this.softwareVersionColumn,
						width: '300px',
					},
				];
				const securityPotentiallyAffectedTableColumns = [
					{
						key: 'deviceName',
						name: I18n.get('_SystemName_'),
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
						key: 'swVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						template: this.softwareVersionColumn,
						width: '300px',
					},
				];
				// Concat the default columns with the extra columns
				_.set(affectedOptions, 'columns', securityAffectedTableColumns);
				_.set(potentiallyAffectedOptions, 'columns',
					securityPotentiallyAffectedTableColumns);
				break;
			case 'field':
				const fieldAffectedTableColumns = [
					{
						key: 'deviceName',
						name: I18n.get('_SystemName_'),
						sortable: true,
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
						key: 'productId',
						name: I18n.get('_ProductID_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						template: this.productIdColumn,
					},
					{
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: true,
						template: this.serialNumberColumn,
					},
				];
				const fieldPotentiallyAffectedTableColumns = [
					{
						key: 'deviceName',
						name: I18n.get('_SystemName_'),
						sortable: true,
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
						key: 'productId',
						name: I18n.get('_ProductID_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						template: this.productIdColumn,
					},
					{
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: true,
						template: this.serialNumberColumn,
					},
				];
				_.set(affectedOptions, 'columns', fieldAffectedTableColumns);
				_.set(potentiallyAffectedOptions, 'columns',
					fieldPotentiallyAffectedTableColumns);
				break;
			case 'bug':
				const bugAffectedTableColumns = [
					{
						key: 'hostName',
						name: I18n.get('_SystemName_'),
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
						key: 'softwareVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						template: this.softwareVersionColumn,
					},
				];
				const bugPotentiallyAffectedTableColumns = [
					{
						key: 'hostName',
						name: I18n.get('_SystemName_'),
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
						key: 'softwareVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						template: this.softwareVersionColumn,
					},
				];
				_.set(affectedOptions, 'columns', bugAffectedTableColumns);
				_.set(potentiallyAffectedOptions, 'columns', bugPotentiallyAffectedTableColumns);
				break;
		}

		this.affectedTable = new CuiTableOptions(affectedOptions);
		this.potentiallyAffectedTable = new CuiTableOptions(potentiallyAffectedOptions);

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
			_.set(this.params, 'system', {
				customerId: this.customerId,
				managedNeId: _.concat(
					_.get(this.assetIds, 'impacted', []),
					_.get(this.assetIds, 'potentiallyImpacted', []),
				),
				page: 1,
				rows: 100,
				solution: this.selectedSolutionName,
				sort: [this.type === 'field' ? 'productId:ASC' : 'deviceName:ASC'],
				useCase: this.selectedTechnologyName,
			});

			this.fetchSystemAsset();
		}
	}

	/**
	 * Column Sort Handler
	 * @param options the selected column
	 */
	public onColumnSort (options: CuiTableColumnOption) {
		_.set(this.params, [this.type === 'bug' ? 'bugAssets' : 'system', 'sort'],
			[`${options.key}:${options.sortDirection.toUpperCase()}`]);

		if (this.type === 'bug') {
			this.fetchBugAssets();
		} else {
			this.fetchSystemAsset();
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
