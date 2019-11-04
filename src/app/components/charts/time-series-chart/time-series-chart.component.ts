import {
	Component,
	Input,
} from '@angular/core';
import { Chart } from 'angular-highcharts';

/**
 * Main component for the Bullet Chart
 */

@Component({
	selector: 'time-series-chart',
	styleUrls: ['../tooltip/tooltip.scss'],
	template: '<div [chart]="chart"></div>',
})

export class TimeSeriesChartComponent {
	public chart: Chart;
	@Input() public loading;
	@Input() public graphData;
	@Input() public height;
	@Input() public width;
	@Input() public title;
	@Input() public plotYaxisLine;

	/**
	 * Initializes the bullet chart
	 */
	public buildGraph () {
		this.chart = new Chart({
			chart: {
				height: this.height,
				marginBottom : 60,
				marginLeft: 80,
				width: this.width,
			},
			credits: {
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				area: {
					fillColor: {
						linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1,
						},
						stops: [[0, '#7cb5ec'], [1, 'rgba(124,181,236,0)'],
						],
					},
					lineWidth: 1,
					marker: {
						radius: 2,
					},
					states: {
						hover: {
							lineWidth: 1,
						},
					},
					threshold: null,
				},
			},

			series: [{
				data: this.graphData,
				name: '',
				type: 'area',
			}],
			subtitle: {
				text: '',
			},
			title: {
				align: 'center',
				text: this.title,
				y: 340,
			},
			xAxis: {
				title: {
					text: 'Time',
				},
				type: 'datetime',
				visible: true,
			},
			yAxis: {
				gridLineColor: 'transparent',
				gridLineWidth: 0,
				lineWidth: 1,
				 plotLines: [{
					color: '#FF0000',
					value: 0,
					width: 1,
				},
				{
					color: 'grey',
					dashStyle: 'ShortDash',
					label: {
						align: 'right',
						text: 'Published Limit',
					},
					value: this.plotYaxisLine,
					width: 1,
				}],
				title: {
					text: 'Count',
				},
				visible: true,
			},
		});
	}

	/**
	 * ng oninit here
	 */
	public ngOnInit () {
		this.buildGraph();
	}
}
