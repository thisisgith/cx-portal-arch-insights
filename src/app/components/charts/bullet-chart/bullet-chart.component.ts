import {
	Component,
	OnChanges,
	Input,
	SimpleChanges,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';
/**
 * setting interface for input parameter
 */
interface SeriesData {
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

export class BulletChartComponent implements OnChanges {
	public chart: Chart;
	@Input() public loading;
	@Input() public seriesData: SeriesData;

	/**
	 * Initializes the bullet chart
	 */
	private buildGraph () {
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
					enableMouseTracking: !this.loading,
					minPointLength: 5,
					name: '',
					opacity: this.loading ? 0.5 : 1,
					showInLegend: false,
					type: 'bullet',
				},
			],
			title: {
				text: '',
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

	/**
	 * OnChanges Functionality
	 * @param changes The changes found
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const loadingInfo = _.get(changes, 'loading',
			{ currentValue: false, firstChange: false, previousValue: false });
		const seriesInfo = _.get(changes, 'seriesData',
			{ currentValue: null, firstChange: false, previousValue: null });
		if (!this.chart || !seriesInfo.previousValue) {
			this.buildGraph();
		} else {
			if (loadingInfo.currentValue !== loadingInfo.previousValue) {
				this.chart.ref.series[0].update(<any> {
					enableMouseTracking: !loadingInfo.currentValue,
					opacity: loadingInfo.currentValue ? 0.5 : 1,
				});
			}
			if (seriesInfo.currentValue !== seriesInfo.previousValue) {
				this.chart.ref.xAxis[0].update({ categories:
				[`<span style="font-size: 13px; font-weight: bold">
				${seriesInfo.currentValue.xLabel}</span>`] }, false);
				const data = [{
					target: seriesInfo.currentValue.target,
					y: seriesInfo.currentValue.y,
				}];
				this.chart.ref.series[0].setData(data);
			}
		}
	}
}
