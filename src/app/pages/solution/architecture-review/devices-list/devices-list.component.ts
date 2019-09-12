import { Component, OnInit, Input, SimpleChanges,
	OnChanges,
	TemplateRef,
	ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ArchitectureReviewService, IParamType, InventoryService, AssetLinkInfo } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { AssetPanelLinkService } from '@services';
/**
 * CBP Rule Component
 */
@Component({
	selector: 'app-devices-list',
	styleUrls: ['./devices-list.component.scss'],
	templateUrl: './devices-list.component.html',
})
export class DevicesListComponent implements OnInit, OnChanges {
	@Input() public filters;
	public customerId: string;
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public dnacDeviceDetails: any = [];
	public isLoading = true;
	public fullscreen: any ;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public lastCollectionTime = '';
	public deviceDetails: any = null;
	public tabIndex = 0;
	public searchText = '';
	public selectedAsset = false;
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });
	@ViewChild('productFamilyTemplate', { static: true })
	private productFamilyTemplate: TemplateRef<{ }>;
	@ViewChild('softwareVersionTemplate', { static: true })
	private softwareVersionTemplate: TemplateRef<{ }>;

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureReviewService,
		private route: ActivatedRoute,
		private assetPanelLinkService: AssetPanelLinkService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.paramsType.customerId = _.cloneDeep(this.customerId);
	}

	public paramsType: IParamType = {
		customerId : '',
		deviceCompliance: '',
		page: 0,
		pageSize: 10,
		searchText: '',
	};

	/**
	 * Used to call the getDevicesList and buildTable function for Updating the Table
	 */
	public ngOnInit () {
		this.buildTable();
	}

	/**
	 * Used to detect the changes in input object and
	 * call the getDevicesList function for Updating the Table
	 * @param changes SimpleChanges
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const selectedFilter = _.get(changes, ['filters', 'currentValue']);
		const isFirstChange = _.get(changes, ['filters', 'firstChange']);
		if (selectedFilter && !isFirstChange) {
			const compliantType = _.get(selectedFilter,  'exceptions');
			this.paramsType.deviceCompliance = compliantType ? compliantType.toString() : '';
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.getDevicesList();
		}
	}

	/**
	 * used to Intialize Table options
	 */
	public buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'neName',
					name: I18n.get('_ArchitectureDevice_'),
					sortable: false,
				},
				{
					key: 'productId',
					name: I18n.get('_ArchitectureProductId_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureProductFamily_'),
					sortable: false,
					template : this.productFamilyTemplate,
				},
				{
					key: 'softwareType',
					name: I18n.get('_ArchitectureSoftwareType_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureSoftwareVersion_'),
					sortable: false,
					template : this.softwareVersionTemplate,
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
		this.paramsType.page = event.page;
		this.paramsType.pageSize = event.limit;
		this.getDevicesList();
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public textFilter (event) {
		// key code 13 refers to enter key
		const eventKeycode = 13;
		if (event.keyCode === eventKeycode || this.searchText.trim().length === 0) {
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.paramsType.searchText = this.searchText;
			this.getDevicesList();
		}
	}

	/**
	 * used for setting the data for table
	 */
	public getDevicesList () {
		this.tableStartIndex = this.paramsType.page * this.paramsType.pageSize;
		const endIndex = (this.tableStartIndex + this.dnacDeviceDetails.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;
		this.architectureService.
			getDevicesList(this.paramsType)
			.subscribe(data => {
				if (!data) {
					return this.invalidResponseHandler();
				}
				const datePipe = new DatePipe('en-US');
				this.isLoading = false;
				this.totalItems = data.TotalCounts;
				this.dnacDeviceDetails = data.dnacDeviceDetails;
				this.lastCollectionTime = datePipe.transform(data.CollectionDate, 'medium');
				this.tableEndIndex = (this.tableStartIndex + this.dnacDeviceDetails.length);
			}, err => {
				this.logger.error('CBP Rule Component View' +
					'  : getDevicesList() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.invalidResponseHandler();
			});
	}

	/**
	 * This Function is used to handle the invalid Response
	 */
	public invalidResponseHandler () {
		this.isLoading = false;
		this.dnacDeviceDetails = [];
		this.totalItems = 0;
	}

	/**
 	* This method is used to set the exception object in order to open Fly-out View
 	* @param event - It contains the selected Exception
 	*/
	public onTableRowClicked (event: any) {
		this.deviceDetails = _.cloneDeep(event);
	}

	/**
	 * This method is used to set the null to exception object
	 * in order to Close device View
	 */
	public onPanelClose () {
		this.deviceDetails = null;
	}

	/**
	 * This method is used to set the null to asset object
	 * in order to Close Device View
	 */
	public closeDeviceView () {
		this.selectedAsset = false;
	}

	/**
	 * Used for Opening the Asset 360 View the data for table
	 * @param item - The Item to which Asset 360 needs to shown
	 */
	public openDeviceView (item: any) {
		this.assetParams = {
			customerId: this.paramsType.customerId,
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
