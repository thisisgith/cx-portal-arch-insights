import { Component, Input, OnInit, ViewChild, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';

import { LogService } from '@cisco-ngx/cui-services';
import { Asset, HardwareEOLBulletin, HardwareResponse } from '@sdp-api';
import { TimelineDatapoint } from '@interfaces';
import { formatDate } from '@angular/common';

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
	}
];

@Component({
	selector: 'details-hardware',
	styleUrls: ['./details-hardware.component.scss'],
	templateUrl: './details-hardware.component.html',
})
export class DetailsHardwareComponent implements OnInit, OnChanges {

	@Input('asset') public asset: Asset;
	// @Input('eolBulletinData') public eolBulletinData: HardwareEOLBulletin;
	public eolBulletinData: HardwareEOLBulletin;
	// @ViewChild('modulesTable', { static: true }) public modulesTableTemplate:
	// 	TemplateRef<{ }>;
	@ViewChild('modulesTable', { static: true }) private modulesTableTemplate: TemplateRef<{ }>;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('DetailsHardwareComponent Created!');
	}

	/** mock data for the modules table */
	public modules = [
		{
			productFamily: 'family1',
			serialNumber: 'serialNumber1',
			slot: 'slot1',
			type: 'type1',
		},
		{
			productFamily: 'family2',
			serialNumber: 'serialNumber2',
			slot: 'slot2',
			type: 'type2',
		},
	];

	public mockEolBulletin: HardwareEOLBulletin = {
		hwEolInstanceId: 'NA,FOC1544Y16T,WS-C2960S-24PS-L,NA',
// tslint:disable-next-line: object-literal-sort-keys
		bulletinNumber: null,
		bulletinProductId: null,
		bulletinTitle: null,
		URL: null,
		publishedDate: '2016-05-31T13:20:21',
		eoLifeExternalAnnouncementDate: '2016-05-01T00:00:00',
		eoLifeInternalAnnouncementDate: '2016-04-01T00:00:00',
		eoSaleDate: '2016-10-30T00:00:00',
		lastDateOfSupport: '2021-10-31T00:00:00',
		lastShipDate: '2017-01-28T00:00:00',
		eoNewServiceAttachmentDate: '2017-10-30T00:00:00',
		eoRoutineFailureAnalysisDate: '2017-10-30T00:00:00',
		eoSwMaintenanceReleasesDate: '2017-10-30T00:00:00',
		eoBuEngineeringSupportTacDate: '2018-10-30T00:00:00',
		eoServiceContractRenewalDate: '2021-01-25T00:00:00',
		eoSignatureReleasesDate: null,
		eoSoftwareAvailabilityDate: null,
		eoSoftwareLicenseAvailabilityDate: null,
		eoVulnerabilitySecuritySupport: '2019-10-30T00:00:00',
		milestoneInfo: [],
		migrationPid: null,
		migrationProductSeries: null,
		migrationProductModel: null,
		migrationPromotionText: null,
		migrationProductPageUrl: null,
		migrationProductDataUrl: null,
		internalAnnouncementDate: null,
	};

	/** temporary  */
	public timelineDataPoint: TimelineDatapoint = {
		title: 'title',
		subTitle: 'subtitle',
		date: new Date(),
	};

	public timelineData: TimelineDatapoint[] = [
		this.timelineDataPoint,
	];

	public ngOnInit (): void {
		console.log('implement me!');
		// console.log(this.asset);
		this.eolBulletinData = this.mockEolBulletin;
		this.setTimelineData();
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		// const currentAsset = _.get(changes, ['asset', 'currentValue']);
		// if (currentAsset && !changes.asset.firstChange) {
		// 	this.refresh();
		// }
		if (changes.asset) {
			console.log(this.asset);
		}
		if (changes.eolBulletinData) {
			console.log(this.eolBulletinData);
			this.setTimelineData();
		}
	}

	private setTimelineData () {
		this.timelineData = [];
		if (eolTimelineProperties) {
			eolTimelineProperties.forEach(property => {
				console.log(property);

				const propertyName = _.get(property, 'propertyName', '');
				const label = _.get(property, 'label', '');
				const value: string = _.get(this.eolBulletinData, property.propertyName, '');

				if (propertyName && value) {
					this.timelineData.push({
						date: new Date(value),
						subTitle: new Date(value).toDateString(),
						title: I18n.get(label),
					});
				}
			});
		}
		// for (const propertyName in eolTimelinePropertyNames) {
		// 	const value = _.get(this.eolBulletinData, propertyName, '');
		// 	if (value) {
		// 		console.log('hi');
		// 	}
		// }
	}
}
