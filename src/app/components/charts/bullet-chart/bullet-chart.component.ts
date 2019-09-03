import {
	Component,
	OnInit,
	Input,
} from '@angular/core';
import { Chart } from 'angular-highcharts';

/**
 * setting interface for input parameter
 */
interface Seriedata {
	target: number;
	xLabel: string;
	y: number;
}

/**
 * Main component for the Bullet Chart
 */

@Component({
	selector: 'bullet-chart',
	template: '<div [chart]="chart"></div>',
})

export class BulletChartComponent implements OnInit {
	public chart: Chart;
	@Input() public seriesData: Seriedata;
	/**
	 * Component initialization
	 */
	public ngOnInit () {
		if (this.seriesData) {
			this.buildGraph();
		}
	}

	/**
	 * Initializes the bullet chart
	 */
	public buildGraph () {
		this.chart = new Chart({
			chart: {
				height: 110,
				inverted: true,
				marginLeft: 135,
				marginTop: 40,
				type: 'bullet',
			},
			credits: {
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				bullet: {
					accessibility: {
						enabled: true,
					},
					borderColor: 'black',
					clip: false,
					color: '#008000',
					crisp: true,
					cursor: 'pointer',
					pointWidth: 8,
					targetOptions: { width: '250%' },
				},
				series: {
					borderWidth: 0,
					color: '#000',
				  },
			},
			series: [
				{
					data: [{
						target: this.seriesData.target,  // The target value of a point
						y: this.seriesData.y,
					}],
					enableMouseTracking: true,
					minPointLength: 5,
					name: '',
					opacity: 1,
					showInLegend: false,
					type: 'bullet',
				},
			],
			title: {
				text: '',
			},
			tooltip: { // Add data-auto-id to the default tooltip format
				footerFormat: '</div>',
				headerFormat: '<div data-auto-id="{point.key}Tooltip">' +
					'<span style="font-size: 10px">{point.key}</span><br/>',
				useHTML: true,
			},
			xAxis: {
				categories: [`<span style="font-size: 13px; font-weight: bold">
					${this.seriesData.xLabel}</span>`],
				gridLineWidth: 0,
			},
			yAxis: {
				gridLineWidth: 0,
				title: null,
			  },
		});
	}
}
