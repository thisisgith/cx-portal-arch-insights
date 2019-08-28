import {
	Component,
	Input,
	ViewChild,
	TemplateRef,
	OnChanges,
	OnInit,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService , IException, IAsset } from '@sdp-api';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * CBP Device Affected Table Component
 */
@Component({
	selector: 'cbp-device-affected',
	styleUrls: ['./cbp-device-affected.component.scss'],
	templateUrl: './cbp-device-affected.component.html',
})
export class CbpDeviceAffectedComponent implements OnInit, OnChanges {

	@Input('cbpDetails') public cbpDetails: IException;
	@ViewChild('assetTmpl', { static: true }) public assetTemplate: TemplateRef<any>;

	/** Our current customerId */
	public customerId: string;
	public fullscreen: any ;
	public tableOptions: CuiTableOptions;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public totalItems = 0;
	public isLoading = true;
	public assetDatas: IAsset[] = [];
	public selectedAsset: IAsset = null;
	public destroy$ = new Subject();
	public params: any = {
		body : [],
		customerId: '',
		page : 0,
		pageSize : 10,
	};

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId =  _.get(user, ['info', 'customerId']);
		this.params.customerId =  _.cloneDeep(this.customerId);
	}

	/**
	 * Used to Intialize Table options
	 */
	public ngOnInit () {
		const datePipe = new DatePipe('en-US');
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					name: I18n.get('_ArchitectureHostName_'),
					sortable: false,
					template: this.assetTemplate,
				},
				{
					key: 'productId',
					name: I18n.get('_ArchitectureProductId_'),
					sortable: false,
				},
				{
					key: 'productFamily',
					name:  I18n.get('_ArchitectureProductFamily_'),
					sortable: false,
				},
				{
					key: 'softwareVersion',
					name:  I18n.get('_ArchitectureSoftwareVersion_'),
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
					key: 'ipAddress',
					name: I18n.get('_ArchitectureIPAddress_'),
					sortable: false,
				},
			],
		});

	}

	/**
	 * Used to detect the changes in input object and
	 * call the getdata function for Updating the Table
	 */
	public ngOnChanges () {
		if (this.cbpDetails) {
			const deviceIdsWithExceptions = this.cbpDetails.deviceIpsWithExceptions.split(';');
			this.totalItems = deviceIdsWithExceptions.length;
			this.params.body = deviceIdsWithExceptions;
			this.params.page = 0 ;
			this.isLoading = true;
			this.getData();
		}
	}

	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo - The Object that contains pageNumber Index
	 */
	public onPagerUpdated (pageInfo: any) {
		this.params.page = pageInfo.page;
		this.isLoading = true;
		this.getData();
	}

	/**
	 * used for setting the data for table
	 */
	public getData () {

		this.tableStartIndex = this.params.page * this.params.pageSize;
		const endIndex = (this.tableStartIndex + this.assetDatas.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;

		this.architectureService.getAllCBPDeviceAffected(this.params)
		.pipe(
			takeUntil(this.destroy$),
		)
				.subscribe((res: IAsset[]) => {
					this.assetDatas = res;
					this.isLoading = false;
					this.tableEndIndex = (this.tableStartIndex + this.assetDatas.length);
				},
					err => {
						this.logger.error('CBP-Device-Affected Fly-Out View' +
							'  : getData() ' +
							`:: Error : (${err.status}) ${err.message}`);
						this.isLoading = false;
						this.assetDatas = [];
						this.totalItems = 0;
					});
	}

	/**
	 * Used for Opening the Asset 360 View the data for table
	 * @param item - The Item to which Asset 360 needs to shown
	 */
	public openAsset360View (item: IAsset) {
		this.selectedAsset = item;
	}

	/**
	 * This method is used to set the null to asset object
	 * in order to Close Fly-out View
	 * @param isClosed - should be true or false
	 */
	public onPanelClose (isClosed: Boolean) {
		if (isClosed) {
			this.selectedAsset = null;
		}
	}

}