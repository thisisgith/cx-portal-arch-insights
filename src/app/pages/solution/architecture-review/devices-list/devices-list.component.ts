import { Component, OnInit, Input, SimpleChanges,
	OnChanges,
	TemplateRef,
	ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ArchitectureReviewService, IParamType, InventoryService } from '@sdp-api';
import { AssetLinkInfo } from '@interfaces';
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
	public collectionId: any;
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });
	@ViewChild('sdaReady', { static: true })
	private sdaReadyTemplate: TemplateRef<{ }>;
	@ViewChild('assuranceReady', { static: true })
	private assuranceReadyTemplate: TemplateRef<{ }>;
	@ViewChild('swimReady', { static: true })
	private swimReadyTemplate: TemplateRef<{ }>;
	@ViewChild('pnpReady', { static: true })
	private pnpReadyTemplate: TemplateRef<{ }>;
	@ViewChild('productId', { static: true })
	private productIdTemplate: TemplateRef<{ }>;
	@ViewChild('softwareVersion', { static: true })
	private softwareVersionTemplate: TemplateRef<{ }>;
	public failedCriteriaMessages: any = null;
	public deviceInfoMessage: any = null;
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
		collectionId: '',
		customerId : '',
		filterBy: '',
		page: 0,
		pageSize: 10,
		searchText: '',
		useCase: '',
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
			const compliantType = _.get(selectedFilter,  'sdareadiness');
			const isClearAllSelected = _.get(selectedFilter, 'isClearAllSelected');
			const useCase = _.get(selectedFilter, 'title');
			this.paramsType.filterBy = compliantType ? compliantType.toString() : '';
			this.paramsType.useCase = useCase ? useCase.toString() : '';
			if (isClearAllSelected) {
				this.paramsType.searchText = '';
				this.searchText = '';
			}
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.getCollectionId();
		}
	}

	/**
	 * Method to fetch collectionId
	 */

	 public getCollectionId () {
		this.architectureService.getCollectionId()
		.subscribe(res => {
			this.paramsType.collectionId = _.get(res, 'collection.collectionId');
			const datePipe = new DatePipe('en-US');
			this.getDevicesList();
			this.lastCollectionTime = datePipe.transform(res.collection.collectionDate, 'medium');
		},
		err => {
			this.logger.error('Devices list Component View' +
				'  : getCollectionId() ' +
				`:: Error : (${err.status}) ${err.message}`);
			this.invalidResponseHandler();
		});
	 }
	/**
	 * used to Intialize Table options
	 */
	public buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'hostName',
					name: I18n.get('_ArchitectureSystemName_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureProductId_'),
					sortable: false,
					template : this.productIdTemplate,
					width : '14%',
				},
				{
					name: I18n.get('_ArchitectureSoftwareVersion_'),
					sortable: false,
					template : this.softwareVersionTemplate,
					width : '14%',
				},
				{
					key: 'softwareType',
					name: I18n.get('_ArchitectureSoftwareType_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureSDAReady_'),
					sortable: false,
					template : this.sdaReadyTemplate,
				},
				{
					name: I18n.get('_ArchitectureAssuranceReady_'),
					sortable: false,
					template : this.assuranceReadyTemplate,
				},
				{
					name: I18n.get('_ArchitetureSwimReady_'),
					sortable: false,
					template : this.swimReadyTemplate,
				},
				{
					name: I18n.get('_ArchitecturePnpReady_'),
					sortable: false,
					template : this.pnpReadyTemplate,
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
		this.getCollectionId();
	}
	/**
 	* Used for getting pageNumber Index and call the getdata function
 	* @param message - The Object that contains pageNumber Index
 	*/
	public getfailedCriteriaMessage (message: any) {
		this.failedCriteriaMessages = message;

	}
	/**
 	* Used for getting pageNumber Index and call the getdata function
 	* @param message - The Object that contains pageNumber Index
 	*/
	 public getDeviceInfo (message: any) {
		this.deviceInfoMessage = message;

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
			this.getCollectionId();
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
				this.isLoading = false;
				this.totalItems = data.totalCount;
				this.dnacDeviceDetails = data.dnacDeviceDetails;
				this.tableEndIndex = (this.tableStartIndex + this.dnacDeviceDetails
					? this.dnacDeviceDetails.length : 0);
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
		_.set(this.selectedAsset, 'active', false);
		_.set(this.deviceDetails, 'active', false);
		this.deviceDetails = null;
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
	 * This method is used to set the null to asset object
	 * in order to Close Device View
	 */
	public closeDeviceView () {
		_.set(this.selectedAsset, 'active', false);
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
