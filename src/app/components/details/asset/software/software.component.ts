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
import { of, Subject, forkJoin } from 'rxjs';
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
	SoftwareEOLBulletin,
	ProductAlertsService,
	SoftwareEOLBulletinResponse,
	SoftwareEOLResponse,
	SoftwareEOL,
	SoftwareInfo,
	ControlPointIERegistrationAPIService,
	LicenseDataResponseModel,
} from '@sdp-api';
import { TimelineDatapoint } from '@interfaces';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { UserResolve } from '@utilities';

/** Interface for displaying a property of the SoftwareEOLBulletin object */
interface EolTimelineProperty {
	label: string;
	propertyName: string;
}

/**
 * Software details component
 */
@Component({
	selector: 'asset-details-software',
	styleUrls: ['./software.component.scss'],
	templateUrl: './software.component.html',
})
export class AssetDetailsSoftwareComponent implements OnInit, OnChanges, OnDestroy {

	@Input('asset') public asset: Asset;
	@ViewChild('licensesTable', { static: true }) private licensesTableTemplate: TemplateRef<{ }>;
	@ViewChild('statusTemplate', { static: true }) private licenseStatusTemplate: TemplateRef<{ }>;
	@ViewChild('typeTemplate', { static: true }) private licenseTypeTemplate: TemplateRef<{ }>;
	@ViewChild('nameTemplate', { static: true }) private licenseNameTemplate: TemplateRef<{ }>;
	@ViewChild('countTemplate', { static: true })
		private licenseUsageCountTemplate: TemplateRef<{ }>;
	@ViewChild('expiryTemplate', { static: true }) private licenseExpiryTemplate: TemplateRef<{ }>;

	public status = {
		loading: {
			eol: false,
			eolBulletin: false,
			licenses: false,
			overall: false,
		},
	};

	private softwareBulletinParams: ProductAlertsService.GetSoftwareEoxBulletinParams;
	private softwareEolParams: ProductAlertsService.GetSoftwareEoxParams;
	private licenseParams: ControlPointIERegistrationAPIService.GetLicenseDataParams;
	public eolData: SoftwareEOL;
	public eolBulletinData: SoftwareEOLBulletin;
	private refresh$: Subject<void>;
	private destroyed$: Subject<void> = new Subject<void>();
	private customerId: string;

	/** properties in the SoftwareEolBulletin object to use in the timeline */
	private eolTimelineProperties: EolTimelineProperty[] = [
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
			label: '_EndOfSoftwareMaintenance_',
			propertyName: 'eoSwMaintenanceReleasesDate',
		},
		{
			label: '_EndOfVulnerabilitySecuritySupport_',
			propertyName: 'eoVulnerabilitySecuritySupport',
		},
		{
			label: '_LastDateOfSupport_',
			propertyName: 'lastDateOfSupport',
		},
	];

	constructor (
		private logger: LogService,
		private controlPointService: ControlPointIERegistrationAPIService,
		private productAlertsService: ProductAlertsService,
		private userResolve: UserResolve,
	) { }

	public softwareLicenses: SoftwareInfo[];
	public softwareLicensesTable: CuiTableOptions;
	public timelineData: TimelineDatapoint[] = [];

	/**
	 * Fetch the eol bulletin data for the selected asset
	 * @returns bulletin data
	 */
	private fetchEOLBulletinData () {
		this.status.loading.eolBulletin = true;

		return this.productAlertsService.getSoftwareEoxBulletin(this.softwareBulletinParams)
		.pipe(
			map((response: SoftwareEOLBulletinResponse) => {
				this.eolBulletinData = _.head(_.get(response, 'data', []));

				this.status.loading.eolBulletin = false;

				this.setTimelineData();
			}),
			catchError(err => {
				this.status.loading.eolBulletin = false;
				this.logger.error('software.component : fetchEOLBulletinData() ' +
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

		return this.productAlertsService.getSoftwareEox(this.softwareEolParams)
		.pipe(
			mergeMap((response: SoftwareEOLResponse) => {
				this.eolData = _.head(_.get(response, 'data', []));

				this.status.loading.eol = false;

				const instanceId = _.get(this, ['eolData', 'swEolInstanceId']);
				if (instanceId) {
					this.softwareBulletinParams = {
						swEolInstanceId: [instanceId],
					};

					return this.fetchEOLBulletinData();
				}
			}),
			catchError(err => {
				this.status.loading.eol = false;
				this.logger.error('software.component : fetchEOLData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the license data for the selected asset
	 * @returns license data
	 */
	private fetchLicenseData () {
		this.status.loading.licenses = true;

		return this.controlPointService.getLicenseData(this.licenseParams)
		.pipe(
			map((response: LicenseDataResponseModel) => {
				this.softwareLicenses = _.get(response, 'license', []);
				this.status.loading.licenses = false;
			}),
			catchError(err => {
				this.status.loading.licenses = false;
				this.logger.error('software.component : fetchLicenseData() ' +
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
				this.status.loading.overall = true;
				this.softwareLicenses = null;
				this.softwareLicensesTable = null;
				this.eolData = null;
				this.eolBulletinData = null;
				this.timelineData = null;
			}),
			switchMap(() => {
				const obsBatch = [];
				const managedNeId = _.get(this.asset, 'managedNeId');
				const hostName = _.get(this.asset, 'deviceName');

				if (managedNeId) {
					this.softwareEolParams = {
						customerId: this.customerId,
						managedNeId: [managedNeId],
					};

					obsBatch.push(this.fetchEOLData());
				}

				if (hostName) {
					this.licenseParams = {
						hostName,
						customerId: this.customerId,
					};

					this.softwareLicensesTable = new CuiTableOptions({
						bordered: true,
						columns: [
							{
								key: 'licenseName',
								name: I18n.get('_Name_'),
								sortable: true,
								template: this.licenseNameTemplate,
							},
							{
								key: 'licenseType',
								name: `${I18n.get('_Type_')}`,
								sortable: false,
								template: this.licenseTypeTemplate,
							},
							{
								key: 'licenseExpiry',
								name: I18n.get('_Expires_'),
								sortable: false,
								template: this.licenseExpiryTemplate,
							},
							{
								key: 'usageCount',
								name: I18n.get('_Count_'),
								sortable: false,
								template: this.licenseUsageCountTemplate,
							},
							{
								key: 'status',
								name: I18n.get('_Status_'),
								sortable: false,
								template: this.licenseStatusTemplate,
							},
						],
						padding: 'compressed',
						striped: false,
						wrapText: true,
					});

					obsBatch.push(this.fetchLicenseData());
				}

				return forkJoin(obsBatch);
			}),
			takeUntil(this.destroyed$),
		)
		.subscribe(() => {
			this.status.loading.overall = false;

			this.logger.debug('Software.component : loadData() :: Finished Refresh');
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
		this.eolTimelineProperties.forEach(property => {
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
