import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main component for the Assets Bar Chart
 */
@Component({
	selector: 'assets-bar-chart',
	styleUrls: ['./assets-bar-chart.component.scss'],
	templateUrl: './assets-bar-chart.component.html',
})
export class AssetsBarChartComponent implements OnInit {

	public chart: Chart;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetsBarChartComponent Created!');
	}

	/**
	 * Initializes the bar chart
	 */
	public ngOnInit () {
		// all placeholder until the API's are finalized
		this.chart = new Chart({
			chart: {
				height: 100,
				type: 'bar',
				width: 200,
			},
			credits: {
				enabled: false,
			},
			series: [
				{
					name: 'Placeholder',
					showInLegend: false,
					data: [
						{
							y: 20,
						},
						{
							y: 40,
						},
						{
							y: 15,
						},
					],
					type: undefined,
				},
			],
			title: {
				text: null,
			},
			xAxis: {
				visible: false,
			},
			yAxis: {
				visible: false,
			},
		});
	}
}
