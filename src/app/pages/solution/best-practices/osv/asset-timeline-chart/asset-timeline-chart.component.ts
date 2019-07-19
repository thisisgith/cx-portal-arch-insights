
import { Component, Input, ViewEncapsulation, SimpleChanges } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';
/**
 * AssetTimelineChart Component
 */
@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'app-asset-timeline-chart',
	styleUrls: ['./asset-timeline-chart.component.scss'],
	templateUrl: './asset-timeline-chart.component.html',
})
export class AssetTimelineChartComponent {
	@Input() public seriesData;
	@Input() public fullscreen;
	public chart: Chart;
	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetTimelineChartComponent Created!');
	}

	/**
	 * Initializes the bubble chart
	 */
	public ngOnInit () {
		// if (this.seriesData) {
		this.buildGraph();
		// }
	}

	/**
	 * Builds our bubble graph
	 */
	private buildGraph () {
		// const series = _.map(this.seriesData, d => ({
		// 	data: [
		// 		{
		// 			name: d.label,
		// 			value: d.value,
		// 		},
		// 	],
		// 	name: d.label,
		// 	type: undefined,
		// }));

		this.chart = new Chart({
			chart: {
				styledMode: true,
				type: 'timeline',
				zoomType: 'x',
			},
			credits: {
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				timeline: {
					dataLabels: {
						borderWidth: 0,
						connectorColor: 'blue',
						distance: 50,
						enabled: true,
						style: {
							fontWeight: 'normal',
							textOutline: 'none',
						},
					},
					marker: {
						lineColor: 'blue',
						lineWidth: 10,
						radius: 0,
						symbol: '',
					},
				},
			},
			series: [
				{
					data: [
						{
							description: 'Current',
							label: '18 Mar 2013',
							name: 'Current',
							x: Date.UTC(2013, 2, 18),
						},
						{
							description: 'Minumum',
							label: '7 Mar 2014',
							name: 'Minumum',
							x: Date.UTC(2014, 2, 7),
						},
						{
							description: 'Suggested',
							label: '7 Dec 2014',
							name: 'Suggested',
							x: Date.UTC(2014, 11, 7),
						},
						{
							description: 'Golden Image',
							label: '7 Dec 2017',
							name: 'Golden Image',
							x: Date.UTC(2017, 11, 7),
						},
						{
							description: 'Latest',
							label: '21 Jan 2019',
							name: 'Latest',
							x: Date.UTC(2019, 0, 21),
						},
					],
					type: 'timeline',
				},
			],
			title: {
				text: null,
			},
			xAxis: {
				lineColor: 'blue',
				lineWidth: 1,
				reversed: true,
				tickColor: 'blue',
				tickInterval: 365 * 24 * 3600 * 1000,
				tickLength: 10,
				type: 'datetime',
				visible: true,
			},
			yAxis: {
				gridLineWidth: 0,
				labels: {
					enabled: false,
				},
				title: null,
			},
		});
	}

	/**
	 * OnChanges Functionality
	 * @param changes change found
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const fullscreen = _.get(changes, 'fullscreen',
			{ currentValue: null, firstChange: false });
		if (!fullscreen.firstChange) {
			this.buildGraph();
		}
	}

}
