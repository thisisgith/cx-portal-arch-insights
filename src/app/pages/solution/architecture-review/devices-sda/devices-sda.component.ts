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
import {
	ArchitectureReviewService,
	IDeviceRecommendedVersions,
	IParamType,
} from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * Devices SDA Product Compatibility Component
 */
@Component({
	selector: 'devices-sda',
	styleUrls: ['./devices-sda.component.scss'],
	templateUrl: './devices-sda.component.html',
})
export class DevicesSdaComponent implements OnInit, OnChanges {

	@Input('deviceDetails') public deviceDetails: any = null;
	@ViewChild('recommendedVersions', { static: true })
	 public recommendedVersions: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public tableLimit = 0;
	public tableOffset = 0;
	public totalItems = 0;
	public deviceSDAdatas: IDeviceRecommendedVersions[] = [];
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public isLoading = true;
	public sdaVersion = '';
	public customerId = '';
	public params: IParamType = {
		body : [],
		customerId: '',
		page : 0,
		pageSize : 10,
	};

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
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceRole',
					name: I18n.get('_ArchitectureDeviceRole_'),
					sortable: false,
				},
				{
					key: 'hardware',
					name: I18n.get('_ArchitectureCompliantProductFamily_'),
					sortable: false,
				},
				{
					key: 'minimumSupportedVersion',
					name: I18n.get('_ArchitectureMinimumSupportedVersion_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureCompliantVersion_'),
					sortable: false,
					template: this.recommendedVersions,
				},
			],
		});
	}

	/**
	 * Used to detect the changes in input object and
	 * call the getdata function for Updating the Table
	 */
	public ngOnChanges () {
		if (this.deviceDetails) {
			const ipAddress = this.deviceDetails.ipAddress;
			this.totalItems = this.deviceDetails.recommendedVersions.length;
			this.params.body = ipAddress;
			this.params.page = 0 ;
			this.isLoading = true;
			this.getSdaDeviceData();
		}
	}

	/**
	 * used for setting the data for table
	 */
	public getSdaDeviceData () {
		this.tableStartIndex = this.params.page * this.params.pageSize;
		const endIndex = (this.tableStartIndex + this.deviceSDAdatas.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;

		this.architectureReviewService.getDevicesSDA(this.params)
					.subscribe((res: any) => {
						if (!res) {
							return this.inValidResponseHandler();
						}
						this.sdaVersion = res.dnacVersion;
						this.deviceSDAdatas = <IDeviceRecommendedVersions[]>
							res.dnacDeviceDetails.recommendedVersions;
						this.isLoading = false;
						this.tableEndIndex = (this.tableStartIndex + this.deviceSDAdatas.length);
					},
						err => {
							this.logger.error('Devices SDA Fly-Out View' +
								'  : getData() ' +
								`:: Error : (${err.status}) ${err.message}`);
							this.inValidResponseHandler();
						});
	}

	/**
	 * This Function is used to handle the invalid Response
	 */
	public inValidResponseHandler () {
		this.sdaVersion = '';
		this.isLoading = false;
		this.deviceSDAdatas = [];
		this.totalItems = 0;
	}
}
