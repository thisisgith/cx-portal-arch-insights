import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { of, Subject, forkJoin } from 'rxjs';
import {
	catchError,
	map,
	mergeMap,
	switchMap,
	takeUntil,
} from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { DateTime } from 'luxon';
import { CaseOpenComponent } from '../../../case/case-open/case-open.component';
import { CuiModalService, CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	HardwareEOL,
	HardwareEOLBulletin,
	HardwareEOLBulletinResponse,
	HardwareEOLResponse,
	NetworkElement,
	ProductAlertsService,
	FieldNoticeResponse,
	RacetrackSolution,
	RacetrackTechnology,
	FieldNotice,
	FieldNoticeBulletin,
} from '@sdp-api';
import {
	TimelineDatapoint,
	ModSystemAsset,
	ModHardwareAsset,
	ModFieldNotice,
} from '@interfaces';
import { RacetrackInfoService } from '@services';
import { getProductTypeImage, getProductTypeTitle } from '@classes';

/** Interface for displaying a property of the HardwareEOLBulletin object */
interface EolTimelineProperty {
	label: string;
	propertyName: string;
	urlName?: string;
}

/** properties in the HardwareEolBulletin object to use in the timeline */
const eolTimelineProperties: EolTimelineProperty[] = [
	{
		label: '_Announcement_',
		propertyName: 'eoLifeExternalAnnouncementDate',
		urlName: 'URL',
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

/**
 * Hardware details component
 */
@Component({
	selector: 'asset-details-hardware',
	styleUrls: ['./hardware.component.scss'],
	templateUrl: './hardware.component.html',
})
export class AssetDetailsHardwareComponent implements OnInit, OnChanges, OnDestroy {

	@Input('customerId') public customerId: string;
	@Input('element') public element: NetworkElement;
	@Input('selectedAsset') public selectedAsset;
	@Input('systemAsset') public systemAsset: ModSystemAsset;
	@Input('hardwareAsset') public hardwareAsset: ModHardwareAsset;
	@Input('hardwareAssets') public hardwareAssets: ModHardwareAsset[];
	@ViewChild('migrationModel', { static: true }) private migrationModelTemplate: TemplateRef<{ }>;
	@ViewChild('typeTemplate', { static: true }) private typeTemplate: TemplateRef<{ }>;
	@ViewChild('serialTemplate', { static: true }) private serialTemplate: TemplateRef<{ }>;
	@ViewChild('hardwareComponent', { static: true }) private hardwareTemplate: TemplateRef<{ }>;
	@ViewChild('productIDTemplate', { static: true }) private productIDTemplate: TemplateRef<{ }>;
	@ViewChild('expandTemplate', { static: true }) private expandTemplate: TemplateRef<{ }>;

	public status = {
		loading: {
			eol: false,
			eolBulletin: false,
			fieldNoticeBulletins: false,
			fieldNotices: false,
			overall: false,
		},
	};

	private destroyed$: Subject<void> = new Subject<void>();
	private refresh$: Subject<void>;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;

	constructor (
		private logger: LogService,
		private cuiModalService: CuiModalService,
		private productAlertsService: ProductAlertsService,
		private racetrackInfoService: RacetrackInfoService,
	) { }

	public hardwareTable: CuiTableOptions;

	/**
	 * Fetch the eol bulletin data for the selected asset
	 * @returns bulletin data
	 */
	private fetchEOLBulletinData () {
		this.status.loading.eolBulletin = true;

		const params: ProductAlertsService.GetHardwareEoxBulletinParams = {
			hwEolInstanceId: _.uniq(_.map(this.hardwareAssets, 'eol.hwEolInstanceId')),
		};

		return this.productAlertsService.getHardwareEoxBulletin(params)
		.pipe(
			map((response: HardwareEOLBulletinResponse) => {
				_.each(this.hardwareAssets, (asset: ModHardwareAsset) => {
					const bulletin = _.find(response.data, (eol: HardwareEOLBulletin) =>
						_.toString(_.get(eol, 'hwEolInstanceId', ''))
							=== _.get(asset, ['eol', 'hwEolInstanceId']));

					if (bulletin) {
						_.set(asset, ['eol', 'bulletin'], bulletin);
					}
				});

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

		const params: ProductAlertsService.GetHardwareEoxParams = {
			customerId: this.customerId,
			hwInstanceId: _.map(this.hardwareAssets, 'hwInstanceId'),
			page: 1,
			rows: 100,
		};

		return this.productAlertsService.getHardwareEox(params)
		.pipe(
			mergeMap((response: HardwareEOLResponse) => {
				_.each(this.hardwareAssets, (asset: ModHardwareAsset) => {
					asset.eol = _.find(response.data, (eol: HardwareEOL) =>
						eol.hwInstanceId === asset.hwInstanceId);
				});

				this.status.loading.eol = false;

				return this.fetchEOLBulletinData();
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
	 * Fetches the field notice bulletins for all of the hardware
	 * @returns the field notice bulletins
	 */
	private fetchFieldNoticeBulletins () {
		this.status.loading.fieldNoticeBulletins = true;

		const fieldNotices = _.flatMap(this.hardwareAssets, 'fieldNotices');

		const params: ProductAlertsService.GetFieldNoticeBulletinParams = {
			fieldNoticeId: _.uniq(_.map(fieldNotices, 'fieldNoticeId')),
			page: 1,
			rows: 100,
		};

		return this.productAlertsService.getFieldNoticeBulletin(params)
		.pipe(
			map((response: FieldNoticeResponse) => {
				_.each(this.hardwareAssets, (asset: ModHardwareAsset) => {
					_.each(asset.fieldNotices, (fn: ModFieldNotice) => {
						const bulletin = _.find(response.data, (fnb: FieldNoticeBulletin) =>
						fn.fieldNoticeId === fnb.fieldNoticeId);

						if (bulletin) {
							const splitTitle = _.split(bulletin.bulletinTitle, ' - ');
							_.pullAt(splitTitle, [0]);
							bulletin.bulletinTitle = _.join(splitTitle, ' - ');
							fn.bulletin = bulletin;
						}
					});
				});

				this.status.loading.fieldNoticeBulletins = false;
			}),
			catchError(err => {
				this.status.loading.fieldNoticeBulletins = false;
				this.logger.error('hardware.component : fetchFieldNoticeBulletins() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the field notices for all of the hardware
	 * @returns field notices
	 */
	private fetchFieldNotices () {
		this.status.loading.fieldNotices = true;

		const params: ProductAlertsService.GetFieldNoticeParams = {
			customerId: this.customerId,
			page: 1,
			rows: 100,
			serialNumber: _.map(this.hardwareAssets, 'serialNumber'),
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
			vulnerabilityStatus: ['POTVUL', 'VUL'],
		};

		return this.productAlertsService.getFieldNotice(params)
		.pipe(
			mergeMap((response: FieldNoticeResponse) => {
				_.each(this.hardwareAssets, (asset: ModHardwareAsset) => {
					asset.fieldNotices = _.filter(response.data, (fn: FieldNotice) =>
						fn.hwInstanceId === asset.hwInstanceId);
				});

				this.status.loading.fieldNotices = false;

				return this.fetchFieldNoticeBulletins();
			}),
			catchError(err => {
				this.status.loading.fieldNotices = false;
				this.logger.error('hardware.component : fetchFieldNotices() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Handler for selecting row
	 * @param row the row selected
	 */
	public onRowSelect (row) {
		row.active = false;
		row.toggleWell = !row.toggleWell;
	}

	/**
	 * Refreshes the eox data
	 */
	private buildRefreshSubject () {
		this.refresh$ = new Subject();

		this.refresh$
		.pipe(
			switchMap(() => {
				this.hardwareTable = new CuiTableOptions({
					bordered: false,
					columns: [
						{
							key: 'expandAction',
							name: '',
							sortable: false,
							sortDirection: 'asc',
							sorting: false,
							template: this.expandTemplate,
							width: '40px',
						},
						{
							key: 'equipmentType',
							name: I18n.get('_Type_'),
							sortable: true,
							sortDirection: 'asc',
							sorting: true,
							template: this.typeTemplate,
							width: '100px',
						},
						{
							key: 'serialNumber',
							name: I18n.get('_SerialNumber_'),
							sortable: true,
							template: this.serialTemplate,
						},
						{
							key: 'productId',
							name: I18n.get('_ProductID_'),
							sortable: true,
							template: this.productIDTemplate,
						},
						{
							key: 'cxLevel',
							name: I18n.get('_CXLevel_'),
							render: item => item.cxLevel || I18n.get('_NA_'),
							sortable: true,
						},
					],
					padding: 'compressed',
					rowWellColor: '#f4f6f8',
					rowWellTemplate: this.hardwareTemplate,
					selectable: false,
					singleSelect: true,
					striped: false,
					wrapText: true,
				});

				const sortColumn = _.find(this.hardwareTable.columns, 'sorting');
				this.hardwareAssets = _.orderBy(this.hardwareAssets,
					[sortColumn.key], [sortColumn.sortDirection]);
				this.fetchElementSelected();
				return forkJoin([
					this.fetchEOLData(),
					this.fetchFieldNotices(),
				]);
			}),
				takeUntil(this.destroyed$),
		)
		.subscribe(() => {
			this.status.loading.overall = false;

			this.logger.debug('hardware.component : loadData() :: Finished Refresh');
		});
	}

	public fetchElementSelected () {
		if (this.hardwareAssets.length > 1) {
			this.hardwareAssets.map((currentElement, index) =>
			 this.selectedAsset.hwInstanceId === currentElement.hwInstanceId ?
			 _.set(this.hardwareAssets[index], 'toggleWell', true) : _.set(this.hardwareAssets[index], 'toggleWell', false));
		} else {
			 _.set(this.hardwareAssets[0], 'toggleWell', true);
		}
	}
	/**
	 * On "Open a Case" button pop up "Open Case" component
	 * @param hardwareAsset the hardware to open the case on
	 */
	public openCase (hardwareAsset: ModHardwareAsset) {
		this.cuiModalService.showComponent(CaseOpenComponent,
			{ asset: hardwareAsset, element: this.element }, 'fluid');
	 }

	/**
	 * Initializes the component
	 */
	public ngOnInit (): void {
		this.buildRefreshSubject();
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
				this.refresh$.next();
			}
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
		const currentAsset = _.get(changes, ['hardwareAsset', 'currentValue']);
		if (currentAsset && !changes.hardwareAsset.firstChange) {
			this.refresh$.next();
		}
	}

	/**
	 * Sets the timeline data
	 */
	private setTimelineData () {
		_.each(this.hardwareAssets, (asset: ModHardwareAsset) => {
			if (!_.isEmpty(_.get(asset, ['eol', 'bulletin']))) {
				_.set(asset, ['eol', 'timelineData'], []);

				eolTimelineProperties.forEach(property => {
					const propertyName = _.get(property, 'propertyName', '');
					const label = _.get(property, 'label', '');
					const urlName = _.get(property, 'urlName');
					const value: string = _.get(asset, ['eol', 'bulletin', propertyName], '');
					const url: string = _.get(asset, ['eol', 'bulletin', urlName]);

					if (value) {
						const data: TimelineDatapoint = {
							date: new Date(value),
							subTitle: new Date(value).toDateString(),
							title: I18n.get(label),
						};

						if (url) {
							data.url = url;
						}

						asset.eol.timelineData.push(data);
					}
				});

				const lastDateOfSupport = _.get(asset.eol,
					['bulletin', 'lastDateOfSupport']);
				let todayClass;
				let todayIcon = 'warning';

				if (lastDateOfSupport) {
					const ldosTime = DateTime.fromISO(lastDateOfSupport);
					if (ldosTime.diffNow('months').months < 0) {
						todayClass = 'label label--danger';
						_.set(asset, ['eol', 'lastSupportDataPassed'], true);
						_.set(asset, ['eol', 'lastSupportDataPassedLabel'], 'danger');
					} else if (ldosTime.diffNow('months').months < 6) {
						todayClass = 'label label--danger';
						_.set(asset, ['eol', 'ldosAnnouncement'], true);
						_.set(asset, ['eol', 'ldosAnnouncementLabel'], 'danger');
					} else if (ldosTime.diffNow('months').months < 12) {
						todayClass = 'label label--warning-alt';
						_.set(asset, ['eol', 'ldosAnnouncement'], true);
						_.set(asset, ['eol', 'ldosAnnouncementLabel'], 'warning-alt');
					} else {
						todayClass = 'label label--info';
						_.set(asset, ['eol', 'ldosAnnouncement'], false);
						todayIcon = null;
					}
				}
				_.set(asset, ['eol', 'timelineTodayIcon'], todayIcon);
				_.set(asset, ['eol', 'timelineTodayClass'], todayClass);
			}
		});
	}
}
