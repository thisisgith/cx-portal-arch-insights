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
import { DetailsPanelStackService } from '@services';

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
		private detailsPanelStackService: DetailsPanelStackService,
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
	public searchText  = '';
	public collectionTime = '';
	public lastCollectionTime = '';
	public params: IBullet =
		{
		  collectionId: '',
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
	@ViewChild('devicesTooltipTemplate', { static: true })
	private devicesTooltipTemplate: TemplateRef<{ }>;
	@ViewChild('fabricsTooltipTemplate', { static: true })
	private fabricsTooltipTemplate: TemplateRef<{ }>;
	@ViewChild('wlcsTooltipTemplate', { static: true })
	private wlcsTooltipTemplate: TemplateRef<{ }>;
	@ViewChild('endPointsTooltipTemplate', { static: true })
	private endPointsTooltipTemplate: TemplateRef<{ }>;

	/**
	 * used to Intialize Table options
	 */
	public ngOnInit () {
		this.getCollectionId();
		this.buildTable();
		this.getCollectionId();
	}

	/**
	 * Method to fetch collectionId
	 */

	public getCollectionId () {
		this.architectureReviewService.getCollectionId()
		.subscribe(res => {
			this.params.collectionId = _.get(res, ['collection', 'collectionId']);
			if (this.params.collectionId !== undefined) {
				this.getDnacList();
				const datePipe = new DatePipe('en-US');
				this.collectionTime = _.get(res, ['collection', 'collectionDate']);
				this.lastCollectionTime =
					datePipe.transform(_.get(res, ['collection', 'collectionDate']), 'medium');
			}
		},
		err => {
			this.logger.error('Dnac list Component View' +
				'  : getCollectionId() ' +
				`:: Error : (${err.status}) ${err.message}`);
			this.inValidResponseHandler();
		});
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
					headerTemplate: this.devicesTooltipTemplate,
					sortable: false,
					template : this.devicesTemplate,
					width : '17%',
				},
				{
					headerTemplate : this.fabricsTooltipTemplate,
					sortable: false,
					template : this.fabricsTemplate,
					width : '17%',
				},
				{
					headerTemplate : this.wlcsTooltipTemplate,
					name: I18n.get('_ArchitectureWLC(WLCPublishedLimit)_'),
					sortable: false,
					template : this.wlcTemplate,
					width : '17%',
				},
				{
					headerTemplate : this.endPointsTooltipTemplate,
					name: I18n.get('_ArchitectureEndPoints(EndPublishedLimit)_'),
					sortable: false,
					template : this.endPointsTemplate,
					width : '17%',
				},
			],
			singleSelect: true,
			striped: false,
			wrapText: true,
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
		this.getCollectionId();
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public textFilter (event) {
		// key code 13 refers to enter key
		const eventKeycode = 13;
		if (event.keyCode === eventKeycode
			|| (event.keyCode !== eventKeycode && this.searchText.trim().length === 0)) {
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.params.page = 0;
			this.params.searchText = this.searchText;
			this.getCollectionId();
		}
	}

	/**
	 * To show status of the dnac
	 * @param item will have the full indicator
	 * @returns the css class
	 */
	public setIndicators (item) {
		return {
			'text-danger': item > 100,
			'text-success': item < 90,
			'text-warning': item > 90 && item < 100,
		  };
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
			this.isLoading = false;
			this.totalItems = res.totalCount;
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
		this.detailsPanelStackService.reset();
		_.set(_.get(this.dnacDetails, 'active'), false);
		this.dnacDetails = null;
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
		}
	}

	/**
	 * This function is used to concate the noOfFabrics and fabricsPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getFabricsTemplate (item) {
		return `${item.noOfFabrics }/${item.fabricsPublishedLimits}`;
	}

	/**
	 * This function is used to concate the noOfEndpoints and endpointsPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getEndPointsTemplate (item) {
		return `${item.noOfEndpoints }/${item.endpointsPublishedLimits}`;
	}

	/**
	 * This function is used to concate the noOfDevices and devicesPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getDevicesTemplate (item) {
		return `${item.noOfDevices }/${item.devicesPublishedLimits}`;
	}

	/**
	 * This function is used to concate the noOfWlc and wlcPublishedLimits
	 * in specific format
	 * @param item - Contains dnac info
	 * @returns - Returns the formatted string
	 */
	public getWlcTemplate (item) {
		return `${item.noOfWlc }/${item.wlcPublishedLimits}`;
	}

}
