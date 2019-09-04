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
 * Main component for the Assets Bar Chart
 */
@Component({
	selector: 'risk-mitigation-column-chart',
	styleUrls: ['./risk-mitigation-column-chart.component.scss'],
	templateUrl: './risk-mitigation-column-chart.component.html',
})

export class RiskMitigationColumnChartComponent implements OnInit {

	@Input() public seriesData;
	@Input() public resetChart;
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
	public buildGraph () {
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
						this.chart.ref.series[0].data[0].select();
					},
				},
				height: 120,
				marginBottom : 30,
				type: 'column',
				width: 160,
			},
			colors: [
				'#000000',
				'#696969',
				'#A9A9A9',
				'#C0C0C0',
			],
			credits: {
				enabled: false,
			},
			plotOptions: {
				column: {
					colorByPoint: true,
				},
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: event => {
								this.selectSubfilter(event);
							},
						},
					},
				},
			},
			series: [
				{
					data,
					allowPointSelect: true,
					name: '',
					showInLegend: false,
					states: {
						select: {
							borderColor: 'none',
							color: '#00bceb',
						},
					},
					type: undefined,
				},
			],
			title: {
				text: '',
			},
			tooltip: { // Add data-auto-id to the default tooltip format
				footerFormat: '</div>',
				headerFormat: '<div data-auto-id="{point.key}Tooltip">' +
					'<span style="font-size: 10px;">{point.key}</span><br/>',
				useHTML: true,
			},
			xAxis: {
				categories,
				labels: {
					rotation: 0,
				},
				lineColor: 'transparent',
				lineWidth: 0,
				minorGridLineWidth: 0,
				visible: true,
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
		const filterName =
		 _.get(_.find(this.seriesData, { label: _.get(event, ['point', 'name']) }), 'filter');
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
		if (_.get(changes, ['resetChart', 'currentValue'])) {
			this.buildGraph();
			changes.resetChart.previousValue = false;
		}
	}
}
