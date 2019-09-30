import {
	Component,
	EventEmitter,
	Output,
	Input,
	SimpleChanges,
	OnChanges,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';

/** All possible colors for the pie chart subfilters with 5 possible values. */
const filterColors5Max = [
	'#92dde4',
	'#8ab6d0',
	'#c8d4d7',
	'#c8e4e6',
	'#e4f0f1',
];

/** All possible colors for the pie chart subfilters with 8 possible values. */
const filterColors8Max = [
	'#92dde4',
	'#8ab6d0',
	'#c8d4d7',
	'#c8e4e6',
	'#92dde4',
	'#8ab6d0',
	'#c8d4d7',
	'#e4f0f1',
];

/**
 * Main component for the Pie Chart
 */
@Component({
	selector: 'pie-chart',
	template: '<div [chart]="chart"></div>',
	styleUrls: ['../tooltip/tooltip.scss'],
})
export class PieChartComponent implements OnChanges {

	@Input() public loading;
	@Input() public seriesData;
	@Input() public width = 225;
	@Input() public height = 125;
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Initializes the pie chart
	 */
	private buildGraph () {
		const data = _.map(this.seriesData, (d, index) => ({
			color: _.get(this.seriesData.length <= 5 ?
				filterColors5Max : filterColors8Max, index, '#fff'),
			id: d.label,
			name: d.label,
			y: d.value,
		}));

		this.chart = new Chart({
			tooltip: {
				useHTML: true,
				backgroundColor: null,
				borderWidth: 0,
			},
			chart: {
				events: {
					load: () => {
						if (window.Cypress) {
							// Hack to allow Cypress to click on highcharts series
							_.each(this.chart.ref.series[0].points, point => {
								point.graphic.element.setAttribute(
									'data-auto-id', `${point.name}Point`,
								);
								// When a "normal" click event fires,
								// turn it into a highcharts point event instead
								point.graphic.element.addEventListener('click', () => {
									const event = Object.assign(new MouseEvent('click'), { point });
									point.firePointEvent('click', event);
								});
							});
						}
					},
				},
				height: this.height,
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				width: this.width,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				pie: {
					cursor: 'pointer',
					dataLabels: {
						alignTo: 'plotEdges',
						allowOverlap: false,
						connectorShape: 'straight',
						distance: 1,
						enabled: true,
						style: {
							color: '#6c757d',
							fontFamily: 'CiscoSans, Arial, sans-serif',
							fontSize: '10px',
							fontWeight: '400',
						},
					},
					innerSize: '75%',
					tooltip: {
						pointFormat: '{point.percentage:.1f}%',
					},
				},
				series: {
					point: {
						events: {
							click: event => this.selectSubfilter(event),
						},
					},
				},
			},
			series: [{
				data,
				colorByPoint: true,
				enableMouseTracking: !this.loading,
				name: '',
				opacity: this.loading ? 0.5 : 1,
				type: undefined,
			}],
			title: {
				text: '',
			},
		});
	}

	/**
	 * Emits the subfilter selected
	 * @param event highcharts click event
	 */
	public selectSubfilter (event: any) {
		event.stopPropagation();
		const filter = _.find(this.seriesData, { label: event.point.name });
		this.subfilter.emit(filter);
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
		if (!this.chart || !seriesInfo.previousValue || !seriesInfo.previousValue.length) {
			this.buildGraph();
		} else {
			if (loadingInfo.currentValue !== loadingInfo.previousValue) {
				this.chart.ref.series[0].update(<any> {
					enableMouseTracking: !loadingInfo.currentValue,
					opacity: loadingInfo.currentValue ? 0.5 : 1,
				});
			}
			if (seriesInfo.currentValue !== seriesInfo.previousValue) {
				const data = _.map(seriesInfo.currentValue, (d, index) => ({
					color: _.get(seriesInfo.currentValue.length <= 5 ?
						filterColors5Max : filterColors8Max, index, '#fff'),
					id: d.label,
					name: d.label,
					y: d.value,
				}));
				this.chart.ref.series[0].setData(data);
			}
		}
	}
}
