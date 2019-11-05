import {
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	ViewChild,
	OnInit,
	OnChanges,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	ArchitectureReviewService,
	IParamType,
} from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { catchError, takeUntil, map } from 'rxjs/operators';
import { Subject, forkJoin, of } from 'rxjs';

/**
 * Devices SDA Product Compatibility Component
 */
@Component({
	selector: 'devices-sda',
	styleUrls: ['./devices-sda.component.scss'],
	templateUrl: './devices-sda.component.html',
})
export class DevicesSdaComponent implements OnInit, OnChanges {
	[x: string]: any;

	@Input('deviceDetails') public deviceDetails: any = null;
	public nonOptimalLinksTableOptions: CuiTableOptions;
	public softwareTableOptions: CuiTableOptions;
	public hardwareTableOptions: CuiTableOptions;
	@ViewChild('sdaSoftwareVersions', { static: true })
	public sdaSoftwareVersions: TemplateRef<any>;
	@ViewChild('sdaHardwareProductId', { static: true })
	public sdaHardwareProductId: TemplateRef<any>;
	@ViewChild('sdaHardwareProductFamily', { static: true })
	public sdaHardwareProductFamily: TemplateRef<any>;
	public sdaSoftwareGridData: [];
	public sdaHardwareGridData: [];
	public isLoading = false;
	public isError = false;
	@Output() public osvCriteriaToEmit = new EventEmitter<any>();
	@Output() public failedCriteriaToEmit = new EventEmitter<any>();
	@Output() public deviceInfoToEmit = new EventEmitter<any>();
	public customerId = '';
	private destroy$ = new Subject();
	public nonOptimalLinks = [];
	public showL3Switch = false;
	public showSwitchRedundency = false;
	public showSwitchInterface = false;
	public nonOptimalLinkTableLimit = 10;
	public nonOptimalLinksTotalCount = 0;
	public selectedSoftwareGroup: any;
	public tabIndex: number;
	public params: IParamType = {
		body : [],
		collectionId: '',
		customerId: '',
		deviceIp: '',
		page : 0,
		pageSize : 10,
	};
	public sdaData = { };
	constructor (private logger: LogService, private route: ActivatedRoute,
		private architectureReviewService: ArchitectureReviewService) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId = _.cloneDeep(this.customerId);
	}

	/**
	 * Used to Intialize Table options
	 */
	public ngOnInit () {
		this.buildTable();
	}

	/**
	 * Used to detect the changes in input object and
	 * call the getdata function for Updating the Table
	 */
	public ngOnChanges () {
		this.isLoading = true;
		if (this.deviceDetails) {
			const ipAddress = this.deviceDetails.ipAddress;
			this.params.body = ipAddress;
			this.params.page = 0 ;
			this.params.deviceIp = this.deviceDetails.ipAddress;
			this.params.collectionId = '';
			this.getCollectionId();
			forkJoin(
				this.getSdaDeviceData(),
				this.getOptimalLinks(1),
			)
			.subscribe();
		} else {
			this.isLoading = false;
		}
	}
	/**
	 * Method to fetch collectionId
	 */

	public getCollectionId () {
		this.architectureReviewService.getCollectionId()
		.subscribe(res => {
			this.params.collectionId = _.get(res, 'collection.collectionId');
		},
		err => {
			this.errorHandler();
			this.logger.error('Devices list Component View' +
				'  : getCollectionId() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	 }
	/**
	 * will get the data for underlay recommendation table
	 * @returns data for underlay table
	 * @param pageNo will be the page number
	 */
	public getOptimalLinks (pageNo) {
		this.params.page = pageNo;

		return this.architectureReviewService.getOptimalLinks(this.params)
		.pipe(
			takeUntil(this.destroy$),
			map((results: any) => {
				const dnacDeviceDetails = results.dnacDeviceDetails;
				this.nonOptimalLinks = dnacDeviceDetails.mtuNonOptimalLinks;
				this.nonOptimalLinksTotalCount = dnacDeviceDetails.totalCount;
				this.isLoading = false;
			}),
			catchError(err => {
				this.errorHandler();
				this.logger.error('Get SDA Devices : getSdaDeviceData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}
	/**
	 * redirects to osv page
	 * call method in parent component
	 * @param message to pass
	 */
	public callOsvPage () {
		const data = {
			active: false,
			customerId: this.customerId,
			id: this.deviceDetails.productId,
			optimalVersion: null,
			productFamily: this.deviceDetails.productFamily,
			productId: this.deviceDetails.productId,
			profileName: this.deviceDetails.productId,
			recommAcceptedDate: '',
			recommendation: '',
			rowSelected: true,
			statusUpdated: false,
			swType: this.deviceDetails.softwareType,
			swVersions: [this.deviceDetails.softwareVersion],
		};
		this.osvCriteriaToEmit.emit(data);
	}
	/**
	 * gets SDA devices
	 * @returns SDA devices
	 */
	public getSdaDeviceData () {
		return this.architectureReviewService.getDevicesSDA(this.params)
		.pipe(
			takeUntil(this.destroy$),
			map((results: any) => {
				const dnacDeviceDetails = results.dnacDeviceDetails;
				this.sdaData = dnacDeviceDetails;
				this.sdaSoftwareGridData = dnacDeviceDetails.sdaSupportedSoftware;
				this.sdaHardwareGridData = dnacDeviceDetails.sdaSupportedHardware;
				this.failedCriteriaToEmit.emit(dnacDeviceDetails.failedCriteria);
				this.deviceInfoToEmit.emit(dnacDeviceDetails);
				if (dnacDeviceDetails.sdaL3AccessEnabled === 'Yes') {
					this.showL3Switch = true;
				}
				if (dnacDeviceDetails.sdaRedundantLinks === 'Yes') {
					this.showSwitchRedundency = true;
				}
				if (dnacDeviceDetails.sdaNoOfMtuNonOptimalInterfaces > 0) {
					this.showSwitchInterface = true;
				}
				this.isLoading = false;
			}),
			catchError(err => {
				this.errorHandler();
				this.logger.error('Get SDA Devices : getSdaDeviceData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}
	/**
	 * This Function is used to build  software and hardware grid
	 */
	public buildTable () {
		this.softwareTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceRole',
					name: I18n.get('_ArchitectureDeviceRole_'),
					sortable: false,
					width: '20%',
				},
				{
					key: 'productFamily',
					name: I18n.get('_ArchitectureProductFamily_'),
					sortable: false,
					width: '50%',
				},
				{
					key: 'software',
					name: I18n.get('_ArchitectureSupportedVersion_'),
					sortable: false,
					template: this.sdaSoftwareVersions,
					width: '30%',
				},
			],
			striped: false,
			wrapText: true,
		});
		this.hardwareTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceRole',
					name: I18n.get('_ArchitectureDeviceRole_'),
					sortable: false,
					width: '20%',
				},
				{
					key: 'productFamily',
					name: I18n.get('_ArchitectureProductFamily_'),
					sortable: false,
					template: this.sdaHardwareProductFamily,
					width: '50%',
				},
				{
					key: 'productId',
					name: I18n.get('_ArchitectureProductId_'),
					sortable: false,
					template: this.sdaHardwareProductId,
					width: '30%',
				},
			],
			striped: false,
		});

		this.nonOptimalLinksTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'linkId',
					name: 'Link ID',
					sortable: false,
				},
				{
					key: 'sourceDevice',
					name: 'Source',
					sortable: false,
				},
				{
					key: 'sourceInterface',
					name: 'Source Interface',
					sortable: false,
				},
				{
					key: 'mtuValue',
					name: 'Link MTU (Bytes)',
					sortable: false,
				},
				{
					key: 'destinationDevice',
					name: 'Target',
					sortable: false,
				},
				{
					key: 'destinationInterface',
					name: 'Target Interface',
					sortable: false,
				},
			],
			striped: false,
			wrapText: true,
		});
	}
	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
	/**
	 * On Error
	 */
	public errorHandler () {
		this.isLoading = false;
		this.isError = true;
	}
}
