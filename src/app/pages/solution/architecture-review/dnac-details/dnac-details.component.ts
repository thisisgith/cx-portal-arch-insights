import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { ArchitectureReviewService } from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import { takeUntil } from 'rxjs/operators';
import {  Subject } from 'rxjs';
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
	@Input() public collectionTime: string | number | Date;
	public customerId: string;
	public params = {
		collectionDate: 1,
		collectionId: '',
		customerId: '',
		dnacIP: '',
	};
	public dataForSystemsGraph = [];
	public dataForFabricsGraph = [];
	public dataForWLCsGraph = [];
	public dataForEndPointsGraph = [];
	private destroy$ = new Subject();
	public networkDevicesData = { };
	public endPointsData = { };
	public fabricsData = { };
	public wlcData = { };
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
		if (this.collectionTime) {
			const date = new Date(this.collectionTime);
			this.params.collectionDate = date.getTime();
		}
		this.isLoading = true;
		this.getCollectionId();
	}

	/**
	 * method to get dnac scale utilization data
	 */
	public getDnacScaleUtilizationData () {
		this.architectureService.getDnacScaleUtilizationData(this.params)
		.subscribe(data => {
			this.isLoading = false;
			this.marshalDataForGraphs(data);
		}, err => {
			this.logger.error('time series count' +
				'  : getDnacScaleUtilizationData() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * method to marshall data for graphs
	 * @param data will have api response
	 */
	public marshalDataForGraphs (data: { length: any; }) {
		if (data.length) {
			_.each(data,
				(object: {
					collectionDate: any;
					noOfDevices: any;
					noOfFabrics: any;
					noOfWlc: any;
					endpointsPeakTime: any;
					noOfEndpoints: any;
				}) => {
					let tempArr = [];
					tempArr.push(new Date(object.collectionDate));
					tempArr.push(object.noOfDevices);
					this.dataForSystemsGraph.push(tempArr);
					tempArr = [];

					tempArr.push(new Date(object.collectionDate));
					tempArr.push(object.noOfFabrics);
					this.dataForFabricsGraph.push(tempArr);
					tempArr = [];

					tempArr.push(new Date(object.collectionDate));
					tempArr.push(object.noOfWlc);
					this.dataForWLCsGraph.push(tempArr);
					tempArr = [];

					tempArr.push(new Date(object.endpointsPeakTime));
					tempArr.push(object.noOfEndpoints);
					this.dataForWLCsGraph.push(tempArr);
			  });
		}
	}

	/**
	 * Method to fetch collectionId
	 */

	public getCollectionId () {
		this.architectureService.getCollectionId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(res => {
			this.params.collectionId = _.get(res, 'collection.collectionId');
			this.getDnacScaleUtilizationData();
		},
		err => {
			this.logger.error('Dnac list Component View' +
				'  : getCollectionId() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
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
			const wlcData = _.get(data, 'WLC');
			if (wlcData) {
				const series = {
					target : Number(wlcData.PublishedLimit),
					xLabel : wlcData.Label,
					y : Number(wlcData.Published),
				};
				this.wlcData = series;
			}
		}, err => {
			this.logger.error('bullet graph count' +
				'  : getNetworkDevicesCount() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	 }
}
