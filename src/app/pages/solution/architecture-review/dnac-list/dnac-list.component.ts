import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureReviewService, assetExceptionList, IBullet } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * Devices With Exceptions Component
 */
@Component({
	selector: 'app-dnac-list',
	styleUrls: ['./dnac-list.component.scss'],
	templateUrl: './dnac-list.component.html',
})

export class DnacListComponent implements OnInit {

	/** Our current customerId */
	public customerId: string;

	constructor (
		private logger: LogService,
		private architectureReviewService: ArchitectureReviewService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId = this.customerId;
	}

	public dnacDetails: any = null;
	public dnacDetailsResponse: assetExceptionList[] = [];
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public isLoading = true;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	private destroy$ = new Subject();
	public globalSearchText  = '';
	public lastCollectionTime = '';
	public params: IBullet =
		{
		  customerId : '',
		  dnacIP: '',
		  page: 0,
		  pageSize: 10,
		  searchText : '',
		};
	public fullscreen: any ;
	@ViewChild('devicesTemplate', { static: true })
	private devicesTemplate: TemplateRef<{ }>;
	@ViewChild('endPointsTemplate', { static: true })
	private endPointsTemplate: TemplateRef<{ }>;
	@ViewChild('fabricsTemplate', { static: true })
	private fabricsTemplate: TemplateRef<{ }>;
	@ViewChild('wlcTemplate', { static: true })
	private wlcTemplate: TemplateRef<{ }>;

	/**
	 * used to Intialize Table options
	 */
	public ngOnInit () {
		this.getDnacList();
		this.buildTable();
	}
	/**
	 * builds Table
	 */

	public buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'dnacIpaddress',
					name: I18n.get('_ArchitectureDNACIPAddress_'),
					sortable: false,
				},
				{
					key: 'dnacVersion',
					name: I18n.get('_ArchitectureDNACVersion_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureDevices(DevicesPublishedLimit)_'),
					sortable: false,
					template : this.devicesTemplate,
				},
				{
					name: I18n.get('_ArchitectureEndPoints(EndPublishedLimit)_'),
					sortable: false,
					template : this.endPointsTemplate,
				},
				{
					name: I18n.get('_ArchitectureFabrics(FabricsPublishedLimit)_'),
					sortable: false,
					template : this.fabricsTemplate,
				},
				{
					name: I18n.get('_ArchitectureWLC(WLCPublishedLimit)_'),
					sortable: false,
					template : this.wlcTemplate,
				},
				{
					key: 'dnacCpu',
					name: I18n.get('_ArchitectureCPUUsage_'),
					sortable: false,
				},
				{
					key: 'dnacFilesystem',
					name: I18n.get('_ArchitectureFileSystemUsage_'),
					sortable: false,
				},
				{
					key: 'dnacMemory',
					name: I18n.get('_ArchitectureMemoryUsage_'),
					sortable: false,
				},
			],
			singleSelect: true,
		});
	}

	/**
 	* Used for getting pageNumber Index and call the getdata function
 	* @param event - The Object that contains pageNumber Index
 	*/
	public onPagerUpdated (event) {
		this.isLoading = true;
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getDnacList();
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public globalSearchFunction (event) {
		if (event.keyCode === 13) {
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.params.page = 0;
			this.params.searchText = this.globalSearchText;
			this.getDnacList();
		}
	}
	/**
	 * used for setting the data for table
	 */
	public getDnacList () {
		this.tableStartIndex = this.params.page * this.params.pageSize;
		const endIndex = (this.tableStartIndex + this.dnacDetailsResponse.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;

		this.architectureReviewService.getDnacList(this.params)
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(res => {
			if (!res) {
				return this.inValidResponseHandler();
			}
			const datePipe = new DatePipe('en-US');
			this.isLoading = false;
			this.totalItems = res.TotalCounts;
			this.lastCollectionTime = datePipe.transform(res.CollectionDate, 'medium');
			this.dnacDetailsResponse = res.dnacDetails;
			this.tableEndIndex = (this.tableStartIndex + this.dnacDetailsResponse.length);
		},
				err => {
					this.logger.error('Devices With Exceptions View' +
						'  : getDnacList() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.inValidResponseHandler();
				});
	}

	/**
	 * This Function is used to handle the invalid Response
	 */
	public inValidResponseHandler () {
		this.isLoading = false;
		this.dnacDetailsResponse = [];
		this.totalItems = 0;
	}
	/**
	 * This method is used to set the exception object in order to open Fly-out View
	 * @param event - It contains the selected asset object
	 */
	public onTableRowClicked (event: any) {
		this.dnacDetails = event;
	}
	/**
	 * This method is used to set the null to asset object
	 * in order to Close Fly-out View
	 */
	public onPanelClose () {
		this.dnacDetails = null;
	}

	/**
	 * This function is used to concate the noOfFabrics and fabricsPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getFabricsTemplate (item) {
		return `${item.noOfFabrics }(${item.fabricsPublishedLimits})`;
	}

	/**
	 * This function is used to concate the noOfEndpoints and endpointsPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getEndPointsTemplate (item) {
		return `${item.noOfEndpoints }(${item.endpointsPublishedLimits})`;
	}

	/**
	 * This function is used to concate the noOfDevices and devicesPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getDevicesTemplate (item) {
		return `${item.noOfDevices }(${item.devicesPublishedLimits})`;
	}

	/**
	 * This function is used to concate the noOfWlc and wlcPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getWlcTemplate (item) {
		return `${item.noOfWlc }(${item.wlcPublishedLimits})`;
	}

}
