import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main component for the Assets Pie Chart
 */
@Component({
	selector: 'assets-pie-chart',
	styleUrls: ['./assets-pie-chart.component.scss'],
	templateUrl: './assets-pie-chart.component.html',
})
export class AssetsPieChartComponent implements OnInit {

	public chart: Chart;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetsPieChartComponent Created!');
	}

	/**
	 * Initializes the pie chart
	 */
	public ngOnInit () {
		// fake data until the API's are complete
		this.chart = new Chart({
			chart: {
				height: 200,
				type: 'pie',
				width: 300,
			},
			credits: {
				enabled: false,
			},
			title: {
				text: '',
			},
			series: [
				{
					name: 'Placeholder',
					data: [
						{
							name: 'Placeholder',
							y: 20,
						},
						{
							name: 'Placeholder',
							y: 40,
						},
						{
							name: 'Placeholder',
							y: 15,
						},
						{
							name: 'Placeholder',
							y: 25,
						},
					],
					type: undefined,
				},
			],
		});
	}
}
