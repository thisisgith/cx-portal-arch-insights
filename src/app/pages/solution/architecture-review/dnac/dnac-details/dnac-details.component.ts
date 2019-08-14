import { Component, Input, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { Chart } from 'angular-highcharts';
/**
 * DNAC Details Component
 */
@Component({
	selector: 'dnac-details',
	styleUrls: ['./dnac-details.component.scss'],
	templateUrl: './dnac-details.component.html',
})
export class DnacDetailsComponent implements OnInit {

	@Input('dnacDetails') public dnacDetails: any = null;
	constructor (private logger: LogService) {
	}
	public Highcharts : Chart;

	ngOnInit (){
		// this.Highcharts = new Chart({
		// 	chart: {
		// 		marginTop: 40
		// 	},
		// 	title: {
		// 		text: '2017 YTD'
		// 	},
		// 	xAxis: {
		// 		categories: ['<span class="hc-cat-title">Revenue</span><br/>U.S. $ (1,000s)']
		// 	},
		// 	yAxis: {
		// 		plotBands: [{
		// 			from: 0,
		// 			to: 150,
		// 			color: '#666'
		// 		}, {
		// 			from: 150,
		// 			to: 225,
		// 			color: '#999'
		// 		}, {
		// 			from: 225,
		// 			to: 9e9,
		// 			color: '#bbb'
		// 		}],
		// 		title: null
		// 	},
		// 	series: [{
		// 		data: [{
		// 			y: 275,
		// 			target: 250
		// 		}]
		// 	}],
		// 	tooltip: {
		// 		pointFormat: '<b>{point.y}</b> (with target at {point.target})'
		// 	}
		// });
	}
}
