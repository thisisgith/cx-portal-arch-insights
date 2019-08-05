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
 * Main component for the Bar Chart
 */
@Component({
	selector: 'bar-chart',
	template: '<div [chart]="chart"></div>',
})
export class BarChartComponent implements OnInit {

	@Input() public seriesData;
	@Input() public width;
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Initializes the bar chart
	 */
	public ngOnInit () {
		if (this.seriesData) {
			this.buildGraph();
		}
	}

	/**
	 * Builds our bar graph
	 */
	private buildGraph () {
		const data = [];
		const categories = [];
		_.each(this.seriesData, d => {
			data.push({
				name: d.label,
				y: d.value,
			});

			categories.push(d.label);
		});

		this.chart = new Chart({
			chart: {
				events: {
					load: () => {
						if (window.Cypress) {
							// Hack to allow Cypress to click on highcharts series
							_.each(this.chart.ref.series, chartSeries => {
								_.each(chartSeries.points, point => {
									if (point.graphic) {
										point.graphic.element
											.setAttribute('data-auto-id', `${point.name}Point`);
										point.graphic.element
											.setAttribute('data-auto-value', point.y);
										// When a "normal" click event fires,
										// turn it into a highcharts point event instead
										point.graphic.element.addEventListener('click', () => {
											const event = Object.assign(
												new MouseEvent('click'), { point },
											);
											point.firePointEvent('click', event);
										});
									}
								});
							});
						}
					},
				},
				height: 100,
				type: 'bar',
				width: this.width,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				series: {
					point: {
						events: {
							click: event => this.selectSubfilter(event),
						},
					},
				},
			},
			series: [
				{
					data,
					name: '',
					showInLegend: false,
					type: undefined,
				},
			],
			title: {
				text: null,
			},
			tooltip: { // Add data-auto-id to the default tooltip format
				footerFormat: '</div>',
				headerFormat: '<div data-auto-id="{point.key}Tooltip">' +
					'<span style="font-size: 10px">{point.key}</span><br/>',
				useHTML: true,
			},
			xAxis: {
				categories,
			},
			yAxis: {
				visible: false,
			},
		});
	}

	/**
	 * Emits the subfilter selected
	 * @param event highcharts click event
	 */
	public selectSubfilter (event: any) {
		event.stopPropagation();
		const filterName = _.find(this.seriesData, { label: event.point.name }).filter;
		this.subfilter.emit(filterName);
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
