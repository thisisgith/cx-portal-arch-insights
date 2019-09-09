import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { ArchitectureReviewService } from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
/**
 * DNAC Details Component
 */
@Component({
	selector: 'dnac-details',
	styleUrls: ['./dnac-details.component.scss'],
	templateUrl: './dnac-details.component.html',
})
export class DnacDetailsComponent implements OnChanges {

	@Input('dnacDetails') public dnacDetails: any = null;
	public customerId: string;
	public params = {
		customerId: '',
		dnacIP: '',
	};

	public networkDevicesData = { };
	public endPointsData = { };
	public fabricsData = { };
	public isLoading = true;

	constructor (private logger: LogService,
		private architectureService: ArchitectureReviewService,
		private route: ActivatedRoute) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId = _.cloneDeep(this.customerId);
	}

	/**
	 * onchange
	 */

	public ngOnChanges () {
		if (this.dnacDetails) {
			this.params.dnacIP = this.dnacDetails.dnacIpaddress;
		}
		this.getNetworkDevicesCount();
	}

	/**
	 * method to get networkdevices count
	 */
	public getNetworkDevicesCount () {

		this.architectureService.getDnacList(this.params)
		.subscribe(data => {
			this.isLoading = false;
			const networkDevices = _.get(data, 'Network Devices');
			if (networkDevices) {
				const series = {
					target : Number(networkDevices.PublishedLimit),
					xLabel : networkDevices.Label,
					y : Number(networkDevices.Published),
				};
				this.networkDevicesData = series;
			}
			const endPoints = _.get(data, 'End Points');
			if (endPoints) {
				const series = {
					target : Number(endPoints.PublishedLimit),
					xLabel : endPoints.Label,
					y : Number(endPoints.Published),
				};
				this.endPointsData = series;
			}
			const fabrics = _.get(data, 'Fabrics');
			if (fabrics) {
				const series = {
					target : Number(fabrics.PublishedLimit),
					xLabel : fabrics.Label,
					y : Number(fabrics.Published),
				};
				this.fabricsData = series;
			}
		}, err => {
			this.logger.error('bullet graph count' +
				'  : getNetworkDevicesCount() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	 }
}
