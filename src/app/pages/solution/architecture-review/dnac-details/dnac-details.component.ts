import { Component, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * DNAC Details Component
 */
@Component({
	selector: 'dnac-details',
	styleUrls: ['./dnac-details.component.scss'],
	templateUrl: './dnac-details.component.html',
})
export class DnacDetailsComponent {

	@Input('dnacDetails') public dnacDetails: any = null;
	constructor (private logger: LogService) {
	}
	public seriesData = {
		target: 1000,
		xLabel: 'Network Devices',
		y: 850,
	};
	public seriesData1 = {
		target: 4000,
		xLabel: 'End Points',
		y: 3750,
	};
	public seriesData2 = {
		target: 500,
		xLabel: 'Fabrics',
		y: 300,
	};

	// /**
	//  * oninit
	//  */
	// public ngOnInit () {
	// }

	/**
	 * method to get networkdevices count
	 */
	public getNetworkDevicesCount () {
		const networkDevices = _.get(this.dnacDetails);
	}

	/**
	 * method to get EndPoints count
	 */
	public getEndPointsCount () {
		const EndPoints = _.get(this.dnacDetails);
	}

	/**
	 * method to get EndPoints count
	 */
	public getFabricsCount () {
		const Fabrics = _.get(this.dnacDetails);
	}
}
