import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
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
 * Main component for the Bubble Chart
 */
@Component({
	selector: 'bubble-chart',
	template: '<div [chart]="chart"></div>',
	styleUrls: ['../tooltip/tooltip.scss'],
})
export class BubbleChartComponent implements OnChanges {

	@Input() public loading;
	@Input() public seriesData;
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Builds our bubble graph
	 */
	private buildGraph () {
		const data = _.map(this.seriesData, (d, index) => ({
			color: _.get(this.seriesData.length <= 5 ?
				filterColors5Max : filterColors8Max, index, '#fff'),
			id: d.label,
			name: d.label,
			value: d.value,
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
							_.each(this.chart.ref.series, chartSeries => {
								_.each(chartSeries.points, point => {
									point.graphic.element.setAttribute(
										'data-auto-id', `${point.name}Point`,
									);
									// When a "normal" click event fires,
									// turn it into a highcharts point event instead
									point.graphic.element.addEventListener('click', () => {
										const event = Object.assign(
											new MouseEvent('click'), { point },
										);
										point.firePointEvent('click', event);
									});
								});
							});
						}
					},
				},
				height: 125,
				type: 'packedbubble',
				width: 225,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				packedbubble: {
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						style: {
							color: '#6c757d',
							fontFamily: 'CiscoSans, Arial, sans-serif',
							fontSize: '10px',
							fontWeight: '400',
							textOutline: 'none',
						},
						textPath: undefined,
					},
					layoutAlgorithm: {
						enableSimulation: false,
						gravitationalConstant: 0.02,
					},
					maxSize: '120%',
					minSize: '30%',
				},
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: event => this.selectSubfilter(event),
						},
					},
					showInLegend: false,
				},
			},
			series: [{
				data,
				type: undefined,
			}],
			title: {
				text: null,
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
					value: d.value,
				}));
				this.chart.ref.series[0].setData(data);
			}
		}
	}
}
