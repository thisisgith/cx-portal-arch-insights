import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';

/**
 * Main component for the Bubble Chart
 */
@Component({
	selector: 'bubble-chart',
	template: '<div [chart]="chart"></div>',
})
export class BubbleChartComponent implements OnInit {

	@Input() public seriesData;
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Initializes the bubble chart
	 */
	public ngOnInit () {
		if (this.seriesData) {
			this.buildGraph();
		}
	}

	/**
	 * Builds our bubble graph
	 */
	private buildGraph () {
		const series = _.map(this.seriesData, d => ({
			data: [
				{
					name: d.label,
					value: d.value,
				},
			],
			name: d.label,
			type: undefined,
		}));

		this.chart = new Chart({
			series,
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
				height: 200,
				type: 'packedbubble',
				width: 250,
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
							color: 'black',
							fontWeight: 'normal',
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
		const seriesInfo = _.get(changes, 'seriesData',
			{ currentValue: null, firstChange: false });
		if (seriesInfo.currentValue && !seriesInfo.firstChange) {
			this.buildGraph();
		}
	}
}
