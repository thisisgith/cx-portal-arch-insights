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
	DiagnosticsPagination,
	SecurityAdvisoryInfo,
	ProductAlertsService,
	SecurityAdvisoryResponse,
	FieldNoticeResponse,
	FieldNoticeAdvisory,
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
	selector: 'advisory-impacted-assets',
	styleUrls: ['./impacted-assets.component.scss'],
	templateUrl: './impacted-assets.component.html',
})
export class AdvisoryImpactedAssetsComponent implements OnInit {
	@Input('affectedSystems') public affectedSystems;
	@Input('advisory') public advisory: SecurityAdvisoryInfo | FieldNoticeAdvisory;
	@Input('id') public id: string;
	@Input('type') public type: AdvisoryType;
	@Input('vulnerability') public vulnerability: string;
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
	public isLoading = false;
	public potentiallyImpacted: SystemAsset[] = [];
	public impacted: SystemAsset[] = [];
	public impactedAssets: HardwareAsset[] = [];
	private params: {
		bugAssets?: DiagnosticsService.GetCriticalBugsAssetsParams;
		system?: InventoryService.GetSystemAssetsParams;
		assets?: InventoryService.GetHardwareAssetsParams;
		notice?: any;
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
		private productAlertsService: ProductAlertsService,
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
		this.inventoryService.getSystemAssets(this.params.system)
			.pipe(
				mergeMap((response: SystemAssets) => {
					const data = _.get(response, 'data', []);

					this.impacted =
						_.filter(data,
							x => _.includes(impacted, _.get(x, 'managedNeId'))) || [];
					this.pagination = this.buildPagination(_.get(response, 'Pagination'));

					return this.fetchAssets();
				}),
				catchError(err => {
					this.pagination = {
						total: 0,
					};
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
				// this.impactedCount.emit(this.impacted.length + this.potentiallyImpacted.length);
				this.impactedCount.emit(this.impacted.length);
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
					this.pagination = this.buildPagination(_.get(response, 'Pagination'));

					return this.fetchAssets();
				}),
				catchError(err => {
					this.pagination = {
						total: 0,
					};
					this.logger.error('advisory-details:impacted-assets.component : getAssets() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe(() => {
				this.impactedCount.emit(this.pagination.total);
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
		this.params.notice = { };
		switch (this.type) {
			case 'security':
				const securityAffectedTableColumns = [
					{
						key: 'hostname',
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
						key: 'swVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						template: this.softwareVersionColumn,
					},
				];
				// Concat the default columns with the extra columns
				_.set(affectedOptions, 'columns', securityAffectedTableColumns);
				const advisoryId = _.get(this.advisory, 'id');
				if (!this.id) {
					this.id = advisoryId;
				}
				this.params.notice = {
					advisoryId: [_.toSafeInteger(this.id)],
					customerId: this.customerId,
					solution: this.selectedSolutionName,
					useCase: this.selectedTechnologyName,
					vulnerabilityStatus: [this.vulnerability],
					page: 1,
					rows: 10,
					sort: ['hostname:ASC'],
				};
				break;
			case 'field':
				const fieldAffectedTableColumns = [
					{
						key: 'hostname',
						name: I18n.get('_SystemName_'),
						sortable: true,
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
				const fieldNoticeId = _.get(this.advisory, 'id');
				if (!this.id) {
					this.id = fieldNoticeId;
				}
				this.params.notice = {
					customerId: this.customerId,
					fieldNoticeId: [_.toSafeInteger(this.id)],
					solution: this.selectedSolutionName,
					useCase: this.selectedTechnologyName,
					vulnerabilityStatus: [this.vulnerability],
					sort: ['productId:ASC'],
					page: 1,
					rows: 10,
				};
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
						key: 'softwareVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						template: this.softwareVersionColumn,
					},
				];
				_.set(affectedOptions, 'columns', bugAffectedTableColumns);
				break;
		}

		this.affectedTable = new CuiTableOptions(affectedOptions);
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
				rows: 15,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			});
			this.fetchBugAssets();
		} else if (this.type === 'field') {
			this.getFieldNotice();
		} else {
			this.getSecurityAdvisory();
		}
	}

	/**
	 * Retrieves the field notices
	 * @returns the data
	 */
	private getFieldNotice () {
		return this.productAlertsService.getFieldNotice(this.params.notice)
			.pipe(
				map((response: FieldNoticeResponse) => {
					const data = _.get(response, 'data', []);
					data.forEach(element => {
						const affectedSystem = _.find(this.affectedSystems, affectedSys =>
							element.neInstanceId === affectedSys.neInstanceId);
						element.serialNumber = _.get(affectedSystem, ['serialNumber']);
						element.productType = _.get(affectedSystem, ['productType']);
					});
					this.impacted = data;
					const pagination = _.get(response, 'Pagination');
					const total = _.get(pagination, 'total', 0);
					this.impactedCount.emit(total);
					this.pagination = this.buildPagination(_.get(response, 'Pagination'));
				}),
				catchError(err => {
					this.logger.error('field-notice-details.component : getFieldNotice() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe();
	}

	/**
	 * Retrieves the security advisories
	 * @returns the data
	 */
	private getSecurityAdvisory () {
		this.params.notice = this.params.notice || { };
		return this.productAlertsService.getSecurityAdvisories(this.params.notice)
			.pipe(
				map((response: SecurityAdvisoryResponse) => {
					const data = _.get(response, 'data', []);
					data.forEach(element => {
						const affectedSystem = _.find(this.affectedSystems, affectedSys =>
							element.neInstanceId === affectedSys.neInstanceId);
						element.serialNumber = _.get(affectedSystem, ['serialNumber']);
						element.productType = _.get(affectedSystem, ['productType']);
					});
					this.impacted = data;
					const pagination = _.get(response, 'Pagination');
					const total = _.get(pagination, 'total', 0);
					this.impactedCount.emit(total);
					this.pagination = this.buildPagination(_.get(response, 'Pagination'));
				}),
				catchError(err => {
					this.logger.error('security-details.component : getSecurityAdvisory() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe();
	}

	/**
	 * Column Sort Handler
	 * @param options the selected column
	 */
	public onColumnSort (options: CuiTableColumnOption) {
		_.set(this.params, [this.type === 'bug' ? 'bugAssets' : 'notice', 'sort'],
			[`${options.key}:${options.sortDirection.toUpperCase()}`]);

		if (this.type === 'bug') {
			this.fetchBugAssets();
		} else if (this.type === 'field') {
			this.getFieldNotice();
		} else {
			this.getSecurityAdvisory();
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
		const currentAdvisory = _.get(changes, ['advisory', 'currentValue']);
		if ((currentId && !changes.id.firstChange) || (currentAdvisory && !changes.advisory.firstChange)) {
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
	 * @param type the type of advisory
 	*/
	public onPageChanged (event: any, type: any) {
		if (type === 'bug') {
			this.params.bugAssets.page = event.page + 1;
			this.fetchBugAssets();
		} else if (type === 'field') {
			this.params.system.page = event.page + 1;
			this.getFieldNotice();
		} else {
			this.params.notice.page = event.page + 1;
			this.getSecurityAdvisory();
		}
	}

	public openSystemDetails (cellData) {
		const queryParams = { serialNumber: cellData.serialNumber, select: true, assetsViewOpen: false };
		if (window.location.pathname.indexOf('assets/system') > -1) {
			queryParams.assetsViewOpen = true;
		}
		const path = this.type === 'field' ? '/solution/assets/hardware' : '/solution/assets/system';
		this.router.navigate([path], {
			queryParams,
		});
	}

	private buildPagination (
		pagination: DiagnosticsPagination) {
		const rows = _.get(pagination, 'rows', 10);
		const page = _.get(pagination, 'page', 1);
		const total = _.get(pagination, 'total', 0);
		const first = (rows * (page - 1)) + 1;
		let last = (rows * page);
		if (last > total) {
			last = total;
		}

		return {
			page,
			rows,
			total,
			countStr: `${first}-${last}`,
		};
	}
}
