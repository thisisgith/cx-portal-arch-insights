import { Component, OnInit } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	ArchitectureService,
	IAsset,
	assetExceptionList,
	InventoryService,
	AssetLinkInfo,
} from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { AssetPanelLinkService } from '@services';

/**
 * Devices With Exceptions Component
 */
@Component({
	selector: 'app-devices-with-exceptions',
	styleUrls: ['./devices-with-exceptions.component.scss'],
	templateUrl: './devices-with-exceptions.component.html',
})

export class DevicesWithExceptionsComponent implements OnInit {

	/**
	 * Our current customerId
	 */
	public customerId: string;
	constructor (
		private logger: LogService,
		private architectureService: ArchitectureService,
		private route: ActivatedRoute,
		private assetPanelLinkService: AssetPanelLinkService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId = _.cloneDeep(this.customerId);
	}

	public assetObject: IAsset = null;
	public selectedAsset = false;
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });
	public assetsExceptionDetails: assetExceptionList[] = [];
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public isLoading = true;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	private destroy$ = new Subject();
	public searchText = '';
	public lastCollectionTime = '';
	public params = { customerId: '', page: 0, pageSize: 10, searchText: '' };
	public fullscreen: any;

	/**
	 * used to Intialize Table options
	 */
	public ngOnInit () {
		this.getAllAssetsWithExceptions();
		this.buildTable();
	}
	/**
	 * builds Table
	 */

	public buildTable () {
		const datePipe = new DatePipe('en-US');
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'hostName',
					name: I18n.get('_ArchitectureHostName_'),
					sortable: false,
				},
				{
					key: 'ipAddress',
					name: I18n.get('_ArchitectureIPAddress_'),
					sortable: false,
				},
				{
					key: 'productId',
					name: I18n.get('_ArchitectureProductId_'),
					sortable: false,
				},
				{
					key: 'productFamily',
					name: I18n.get('_ArchitectureProductFamily_'),
					sortable: false,
				},
				{
					key: 'softwareType',
					name: I18n.get('_ArchitectureSoftwareType_'),
					sortable: false,
				},
				{
					key: 'softwareVersion',
					name: I18n.get('_ArchitectureSoftwareVersion_'),
					sortable: false,
				},
				{
					key: 'lastUpdateDate',
					name: I18n.get('_ArchitectureConfigCollectionDate_'),
					render: item =>
						datePipe.transform(item.lastUpdateDate, 'medium'),
					sortable: false,
				},
				{
					key: 'ruleIdWithExceptions',
					name: I18n.get('_ArchitectureCBPExceptions_'),
					render: item =>
						item.ruleIdWithExceptions.split(';').length,
					sortable: false,
				},
			],
			hover: true,
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
		this.getAllAssetsWithExceptions();
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public textFilter (event) {
		// key code 13 refers to enter key
		const enterKeyCode = 13;
		if (event.keyCode === enterKeyCode || this.searchText.trim().length === 0) {
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.params.page = 0;
			this.params.searchText = this.searchText;
			this.getAllAssetsWithExceptions();
		}
	}
	/**
	 * used for setting the data for table
	 */
	public getAllAssetsWithExceptions () {
		this.tableStartIndex = this.params.page * this.params.pageSize;
		const endIndex = (this.tableStartIndex + this.assetsExceptionDetails.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;

		this.architectureService.getAllAssetsWithExceptions(this.params)
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
				this.assetsExceptionDetails = res.AssetsExceptionDetails;
				this.tableEndIndex = (this.tableStartIndex + this.assetsExceptionDetails.length);
			}, err => {
				this.logger.error('Devices With Exceptions View' +
					'  : getAllAssetsWithExceptions() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.isLoading = false;
				this.assetsExceptionDetails = [];
				this.totalItems = 0;
			});
	}

	/**
	 * This Function is used to handle the invalid Response
	 */
	public inValidResponseHandler () {
		this.isLoading = false;
		this.assetsExceptionDetails = [];
		this.totalItems = 0;
	}
	/**
	 * This method is used to set the exception object in order to open Fly-out View
	 * @param event - It contains the selected asset object
	 */
	public onTableRowClicked (event: IAsset) {
		this.assetObject = event;
	}
	/**
	 * This method is used to set the null to asset object
	 * in order to Close Fly-out View
	 */
	public onPanelClose () {
		this.assetObject = null;
	}

	/**
		* This method is used to set the null to asset object
		* in order to Close Fly-out View
		*/
	public closeAssetDetailsView () {
		this.selectedAsset = false;
	}

	/**
	 * Used for Opening the Asset 360 View the data for table
	 * @param item - The Item to which Asset 360 needs to shown
	 */
	public openAssetDetailsView (item: IAsset) {
		this.assetParams = {
			customerId: this.params.customerId,
			serialNumber: [item.serialNumber],
		};

		this.assetPanelLinkService.getAssetLinkData(this.assetParams)
			.subscribe(response => {
				this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
				this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
				this.selectedAsset = true;
			});

	}

}
