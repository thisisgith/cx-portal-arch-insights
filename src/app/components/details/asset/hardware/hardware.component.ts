import {
	Component,
	Input,
	OnInit,
	ViewChild,
	TemplateRef,
	SimpleChanges,
	OnChanges,
	OnDestroy,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { forkJoin, of, Subject } from 'rxjs';
import {
	map,
	catchError,
	mergeMap,
	takeUntil,
	tap,
	switchMap,
} from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import {
	Asset,
	HardwareEOLBulletin,
	ProductAlertsService,
	HardwareEOLBulletinResponse,
	HardwareEOLResponse,
	HardwareEOL,
	InventoryService,
	HardwareInfo,
	HardwareResponse,
} from '@sdp-api';
import { TimelineDatapoint } from '@interfaces';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { UserResolve } from '@utilities';

/** Interface for displaying a property of the HardwareEOLBulletin object */
interface EolTimelineProperty {
	label: string;
	propertyName: string;
}

/** properties in the HardwareEolBulletin object to use in the timeline */
const eolTimelineProperties: EolTimelineProperty[] = [
	{
		label: '_EndOfLifeAnnounced_',
		propertyName: 'eoLifeExternalAnnouncementDate',
	},
	{
		label: '_EndOfSale_',
		propertyName: 'eoSaleDate',
	},
	{
		label: '_LastShip_',
		propertyName: 'lastShipDate',
	},
	{
		label: '_EndOfRoutineFailureAnalysis_',
		propertyName: 'eoRoutineFailureAnalysisDate',
	},
	{
		label: '_EndOfNewServiceAttach_',
		propertyName: 'eoNewServiceAttachmentDate',
	},
	{
		label: '_EndOfServiceContractRenewal_',
		propertyName: 'eoServiceContractRenewalDate',
	},
	{
		label: '_LastDateOfSupport_',
		propertyName: 'lastDateOfSupport',
	},
];

/**
 * Hardware details component
 */
@Component({
	selector: 'asset-details-hardware',
	styleUrls: ['./hardware.component.scss'],
	templateUrl: './hardware.component.html',
})
export class AssetDetailsHardwareComponent implements OnInit, OnChanges, OnDestroy {

	@Input('asset') public asset: Asset;
	@Input('customerId') public customerId: string;
	@ViewChild('migrationModel', { static: true }) private migrationModelTemplate: TemplateRef<{ }>;
	@ViewChild('typeTemplate', { static: true }) private typeTemplate: TemplateRef<{ }>;
	@ViewChild('familyTemplate', { static: true }) private familyTemplate: TemplateRef<{ }>;
	@ViewChild('serialTemplate', { static: true }) private serialTemplate: TemplateRef<{ }>;

	public status = {
		loading: {
			eol: false,
			eolBulletin: false,
			modules: false,
			overall: false,
		},
	};

	private hardwareBulletinParams: ProductAlertsService.GetHardwareEoxBulletinParams;
	private hardwareEOLParams: ProductAlertsService.GetHardwareEoxParams;
	private moduleParams: InventoryService.GetHardwareParams;
	public eolData: HardwareEOL;
	public eolBulletinData: HardwareEOLBulletin;
	private destroyed$: Subject<void> = new Subject<void>();
	private refresh$: Subject<void>;

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private productAlertsService: ProductAlertsService,
		private userResolve: UserResolve,
	) { }

	public hardwareModules: HardwareInfo[];
	public hardwareModulesTable: CuiTableOptions;
	public migrationTable: CuiTableOptions;
	public timelineData: TimelineDatapoint[] = [];
	public migrationData: {
		migrationPid?: string;
		migrationProductDataUrl?: string;
		migrationProductModel?: string;
		migrationProductPageUrl?: string;
		migrationProductSeries?: string;
		migrationPromotionText?: string;
	}[];

	/**
	 * Fetch the eol bulletin data for the selected asset
	 * @returns bulletin data
	 */
	private fetchEOLBulletinData () {
		this.status.loading.eolBulletin = true;

		return this.productAlertsService.getHardwareEoxBulletin(this.hardwareBulletinParams)
		.pipe(
			map((response: HardwareEOLBulletinResponse) => {
				this.eolBulletinData = _.head(_.get(response, 'data', []));

				if (_.get(this.eolBulletinData, 'migrationPid')) {
					const {
						migrationPid,
						migrationProductDataUrl,
						migrationProductModel,
						migrationProductPageUrl,
						migrationProductSeries,
						migrationPromotionText,
					} = _.get(this, 'eolBulletinData');
					this.migrationData = [
						{
							migrationPid,
							migrationProductDataUrl,
							migrationProductModel,
							migrationProductPageUrl,
							migrationProductSeries,
							migrationPromotionText,
						},
					];
				}

				this.status.loading.eolBulletin = false;

				this.setTimelineData();
			}),
			catchError(err => {
				this.status.loading.eolBulletin = false;
				this.logger.error('hardware.component : fetchEOLBulletinData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetch the eol data for the selected asset
	 * @returns eol data
	 */
	private fetchEOLData () {
		this.status.loading.eol = true;

		return this.productAlertsService.getHardwareEox(this.hardwareEOLParams)
		.pipe(
			mergeMap((response: HardwareEOLResponse) => {
				this.eolData = _.head(_.get(response, 'data', []));

				this.status.loading.eol = false;

				const instanceId = _.get(this, ['eolData', 'hwEolInstanceId']);
				if (instanceId) {
					this.hardwareBulletinParams = {
						hwEolInstanceId: [instanceId],
					};

					return this.fetchEOLBulletinData();
				}

				return of({ });
			}),
			catchError(err => {
				this.status.loading.eol = false;
				this.logger.error('hardware.component : fetchEOLData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the module data for the selected asset
	 * @returns module data
	 */
	private fetchModuleData () {
		this.status.loading.modules = true;

		return this.inventoryService.getHardware(this.moduleParams)
		.pipe(
			map((response: HardwareResponse) => {
				this.hardwareModules = _.get(response, 'data', []);
			}),
			catchError(err => {
				this.status.loading.modules = false;
				this.logger.error('hardware.component : fetchModuleData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Refreshes the eox data
	 */
	private buildRefreshSubject () {
		this.refresh$ = new Subject();

		this.refresh$
		.pipe(
			tap(() => {
				this.hardwareModules = null;
				this.hardwareModulesTable = null;
				this.eolData = null;
				this.eolBulletinData = null;
				this.timelineData = null;
				this.migrationData = null;
				this.migrationTable = null;
			}),
			switchMap(() => {
				const obsBatch = [];
				const managedNeId = _.get(this.asset, 'managedNeId');
				const hwInstanceId = _.get(this.asset, 'hwInstanceId');

				if (managedNeId) {
					this.hardwareEOLParams = {
						customerId: this.customerId,
						managedNeId: [managedNeId],
					};

					obsBatch.push(this.fetchEOLData());
				}

				if (hwInstanceId) {
					this.moduleParams = {
						containingHwId: [hwInstanceId],
						customerId: this.customerId,
						equipmentType: ['MODULE'],
					};

					this.hardwareModulesTable = new CuiTableOptions({
						bordered: false,
						columns: [
							{
								key: 'productType',
								name: I18n.get('_Type_'),
								sortable: false,
								template: this.typeTemplate,
							},
							{
								key: 'productFamily',
								name: `${I18n.get('_ProductFamily_')} / ${I18n.get('_ID_')}`,
								sortable: false,
								template: this.familyTemplate,
							},
							{
								key: 'serialNumber',
								name: I18n.get('_SerialNumber_'),
								sortable: false,
								template: this.serialTemplate,
							},
						],
						padding: 'compressed',
						striped: false,
						wrapText: true,
					});

					this.migrationTable = new CuiTableOptions({
						bordered: false,
						columns: [
							{
								key: 'migrationProductModel',
								name: I18n.get('_ProductModel_'),
								sortable: false,
								template: this.migrationModelTemplate,
								width: '150px',
							},
							{
								key: 'migrationPid',
								name: `${I18n.get('_ProductID_')}`,
								render: item =>
									item.migrationPid ?
									item.migrationPid : I18n.get('_NA_'),
								sortable: false,
							},
							{
								key: 'migrationProductSeries',
								name: I18n.get('_ProductSeries_'),
								render: item =>
									item.migrationProductSeries ?
									item.migrationProductSeries : I18n.get('_NA_'),
								sortable: false,
							},
						],
						padding: 'compressed',
						striped: false,
						wrapText: true,
					});

					obsBatch.push(this.fetchModuleData());
				}

				return forkJoin(obsBatch);
			}),
			takeUntil(this.destroyed$),
		)
		.subscribe(() => {
			this.status.loading.overall = false;

			this.logger.debug('hardware.component : loadData() :: Finished Refresh');
		});
	}

	/**
	 * Initializes the component
	 */
	public ngOnInit (): void {
		this.buildRefreshSubject();
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
			this.refresh$.next();
		});
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
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.refresh$.next();
		}
	}

	/**
	 * Sets the timeline data
	 */
	private setTimelineData () {
		this.timelineData = [];
		eolTimelineProperties.forEach(property => {
			const propertyName = _.get(property, 'propertyName', '');
			const label = _.get(property, 'label', '');
			const value: string = _.get(this.eolBulletinData, propertyName, '');
			if (value) {
				this.timelineData.push({
					date: new Date(value),
					subTitle: new Date(value).toDateString(),
					title: I18n.get(label),
				});
			}
		});
	}
}
