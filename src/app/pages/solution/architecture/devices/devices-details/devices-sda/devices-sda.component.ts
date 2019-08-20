import {
	Component,
	Input,
	TemplateRef,
	ViewChild,
	OnInit,
	OnChanges,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Devices SDA Product Compatibility Component
 */
@Component({
	selector: 'devices-sda',
	styleUrls: ['./devices-sda.component.scss'],
	templateUrl: './devices-sda.component.html',
})
export class DevicesSdaComponent implements OnInit,OnChanges{

	@Input('deviceDetails') public deviceDetails: any = null;
	@ViewChild('assetTmpl', { static: true }) public assetTemplate: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public tableLimit = 0;
	public tableOffset = 0;
	public totalItems = 0;
	public tableData: any[] = [];
	public tempData: any[] = [];
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public isLoading = true;
	public params: any = {
		page : 0,
		pageSize : 8,
		body : [],
	};

	constructor(private logger: LogService) {

		
	}

	/**
	 * Used to Intialize Table options
	 */
	public ngOnInit () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceRole',
					name: I18n.get('_ArchitectureDeviceRole_'),
					sortable: false,
				},
				{
					key: 'recommendedProductFamily',
					name: I18n.get('_ArchitectureRecommendedProductFamily_'),
					sortable: false,
				},
				{
					key: 'minimumSupportedVersion',
					name: I18n.get('_ArchitectureMinimumSupportedVersion_'),
					sortable: false,
				},
				{
					key: 'recommendedVersion',
					name: I18n.get('_ArchitectureRecommendedVersion_'),
					sortable: false,
				},
			],
		});
		this.getData();
	}

	/**
	 * Used to detect the changes in input object and
	 * call the getdata function for Updating the Table
	 */
	public ngOnChanges()
	{
		if(this.deviceDetails){
			// const deviceIdsWithExceptions = this.cbpDetails.deviceIdsWithExceptions.split(';');
			// this.totalItems = deviceIdsWithExceptions.length;
			// this.params.body = deviceIdsWithExceptions;
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

		this.tableData = [
			{
				deviceRole: "Border Role",
				recommendedProductFamily: "Cicso Catalyst 9300 Series",
				minimumSupportedVersion: "IOS XE 16.1",
				recommendedVersion: "IOS XE 16.1,IOS XE 16.1,IOS XE 16.1"
			},
			{
				deviceRole: "Border Role",
				recommendedProductFamily: "Cicso Catalyst 9300 Series",
				minimumSupportedVersion: "IOS XE 16.1",
				recommendedVersion: "IOS XE 16.1,IOS XE 16.1,IOS XE 16.1"
			},
			{
				deviceRole: "Border Role",
				recommendedProductFamily: "Cicso Catalyst 9300 Series",
				minimumSupportedVersion: "IOS XE 16.1",
				recommendedVersion: "IOS XE 16.1,IOS XE 16.1,IOS XE 16.1"
			},
		];
		
		this.tableStartIndex = this.params.page * this.params.pageSize;
		let x = (this.tableStartIndex + this.tableData.length);
		this.tableEndIndex = (x) > this.totalItems ? this.totalItems : x;

		// this.architectureService.getAllCBPDeviceAffected(this.params)
		// 			.subscribe((res: IAsset[]) => {
		// 				this.assetDatas = res;
		// 				this.isLoading = false;
		// 				this.tableEndIndex = (this.tableStartIndex + this.assetDatas.length);
		// 			},
		// 				err => {
		// 					this.logger.error('CBP-Device-Affected Fly-Out View' +
		// 						'  : getData() ' +
		// 						`:: Error : (${err.status}) ${err.message}`);
		// 					this.isLoading = false;
		// 					this.assetDatas = [];
		// 					this.totalItems = 0;
		// 				});
	}
}
