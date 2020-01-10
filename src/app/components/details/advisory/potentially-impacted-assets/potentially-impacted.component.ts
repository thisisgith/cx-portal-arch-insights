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
	RacetrackTechnology,
	RacetrackSolution,
	HardwareAsset,
	SystemAsset,
	SystemAssets,
	DiagnosticsPagination,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	catchError,
	takeUntil,
} from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { CuiTableOptions, CuiTableColumnOption } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import { RacetrackInfoService } from '@services';
import { Router } from '@angular/router';

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
	selector: 'potentially-impacted-assets',
	styleUrls: ['./potentially-impacted.component.scss'],
	templateUrl: './potentially-impacted.component.html',
})
export class PotentiallyImpactedAssetsComponent implements OnInit {

	@Input('id') public id: string;
	@Input('assetIds') public assetIds: AssetIds;
	@Input('customerId') public customerId: string;
	@Output('potentiallyImpactedCount') public impactedCount = new EventEmitter<number>();
	@ViewChild('ipAddressColumn', null) public ipAddressColumn: TemplateRef<{ }>;
	@ViewChild('deviceColumn', null) public deviceColumn: TemplateRef<{ }>;
	@ViewChild('productIdColumn', null) public productIdColumn: TemplateRef<{ }>;
	@ViewChild('versionColumn', null) public softwareVersionColumn: TemplateRef<{ }>;
	@ViewChild('serialNumberColumn', null) public serialNumberColumn: TemplateRef<{ }>;
	@ViewChild('recommendedVersionColumn', null) public recommendedVersionColumn: TemplateRef<{ }>;

	public potentiallyAffectedTable: CuiTableOptions;
	public isLoading = false;
	public potentiallyImpacted: SystemAsset[] = [];
	public potentiallyImpactedAssets: HardwareAsset[] = [];
	private params: {
		system?: InventoryService.GetSystemAssetsParams;
	};
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	private destroyed$: Subject<void> = new Subject<void>();
	public pagination?: DiagnosticsPagination;

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private diagnosticsService: DiagnosticsService,
		private racetrackInfoService: RacetrackInfoService,
		private router: Router,
	) { }

	/**
	 * Fetches the network elements affected
	 * @returns the observable
	 */
	private fetchSystemAsset () {
		this.isLoading = true;

		this.potentiallyImpacted = [];

		const potentiallyImpactedIds = _.get(this.assetIds, 'potentiallyImpacted', []);
		this.inventoryService.getSystemAssets(this.params.system)
			.pipe(
				map((response: SystemAssets) => {
					const data = _.get(response, 'data', []);
					this.potentiallyImpacted =
						_.filter(data,
							x => _.includes(potentiallyImpactedIds, _.get(x, 'managedNeId'))) || [];
					this.pagination = this.buildPagination(_.get(response, 'Pagination'));
				}),
				catchError(err => {
					this.pagination = {
						total: 0,
					};
					this.logger.error('advisory-details:potentially-impacted-assets.component : ' +
						`fetchSystemAsset() :: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe(() => {
				this.impactedCount.emit(this.pagination.total);
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
		const potentiallyAffectedOptions = _.cloneDeep(defaultOptions);

		const securityPotentiallyAffectedTableColumns = [
			{
				key: 'deviceName',
				name: I18n.get('_SystemName_'),
				sortable: true,
				sortDirection: 'asc',
				sorting: true,
				template: this.deviceColumn,
				width: '225px',
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
				template: this.productIdColumn,
			},
			{
				key: 'osVersion',
				name: I18n.get('_SoftwareRelease_'),
				sortable: true,
				template: this.softwareVersionColumn,
			},
		];
		_.set(potentiallyAffectedOptions, 'columns',
			securityPotentiallyAffectedTableColumns);

		this.potentiallyAffectedTable = new CuiTableOptions(potentiallyAffectedOptions);

		_.set(this.params, 'system', {
			customerId: this.customerId,
			managedNeId: _.get(this.assetIds, 'potentiallyImpacted', []),
			page: 1,
			rows: 100,
			solution: this.selectedSolutionName,
			sort: ['deviceName:ASC'],
			useCase: this.selectedTechnologyName,
		});

		this.fetchSystemAsset();
	}

	/**
	 * Column Sort Handler
	 * @param options the selected column
	 */
	public onColumnSort (options: CuiTableColumnOption) {
		_.set(this.params, ['system', 'sort'],
			[`${options.key}:${options.sortDirection.toUpperCase()}`]);
		this.fetchSystemAsset();
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

	/**
	 * Page change handler
	 * @param event the event emitted
 	*/
	public onPageChanged (event: any) {
		this.params.system.page = event.page + 1;
		this.fetchSystemAsset();
	}

	public openSystemDetails (serialNumber: string) {
		const queryParams = { serialNumber, select: true, assetsViewOpen: false };
		if (window.location.pathname.indexOf('assets/system') > -1) {
			queryParams.assetsViewOpen = true;
		}
		this.router.navigate(['/solution/assets/system'], {
			queryParams,
		});
	}

	private buildPagination (
		pagination: DiagnosticsPagination) {
		const rows = _.get(pagination, 'rows', 15);
		const page = _.get(pagination, 'page', 1);
		const total = _.get(pagination, 'total', 0);
		let last = (rows * page);
		if (last > total) {
			last = total;
		}

		return {
			page,
			rows,
			total,
			countStr: last,
		};
	}
}
