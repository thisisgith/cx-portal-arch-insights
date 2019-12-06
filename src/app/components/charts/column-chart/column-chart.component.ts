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

/**
 * Main component for the Column Chart
 */
@Component({
	selector: 'column-chart',
	template: '<div [chart]="chart"></div>',
	styleUrls: ['../tooltip/tooltip.scss'],
})
export class ColumnChartComponent implements OnChanges {

	@Input() public loading;
	@Input() public seriesData;
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Builds our bar graph
	 */
	private buildGraph () {
		const data = [];
		const categories = [];
		let  previousPoint;
		_.each(this.seriesData, d => {
			data.push({
				color: '#92dde4',
				id: d.label,
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
					},
				},
				height: 125,
				type: 'column',
				width: 225,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				column: {
					pointWidth: 25,
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
					enableMouseTracking: !this.loading,
					minPointLength: 5,
					name: '',
					opacity: this.loading ? 0.5 : 1,
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
				text: null,
			},
			tooltip: { // Add data-auto-id to the default tooltip format
				footerFormat: '</div>',
				headerFormat: '<div data-auto-id="{point.key}Tooltip">' +
					'<span style="font-size: 10px">{point.key}</span><br/>',
				useHTML: true,
				backgroundColor: null,
				borderWidth: 0,
				followPointer: true,
			},
			xAxis: {
				categories,
				labels: {
					rotation: 0,
					style: {
						color: '#6c757d',
						fontFamily: 'CiscoSans, Arial, sans-serif',
						fontSize: '10px',
						fontWeight: '400',
					},
				},
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
				const data = [];
				const categories = [];
				_.each(seriesInfo.currentValue, d => {
					data.push({
						color: '#92dde4',
						id: d.label,
						name: d.label,
						y: d.value,
					});
					categories.push(d.label);
				});
				this.chart.ref.xAxis[0].update({ categories }, false);
				this.chart.ref.series[0].setData(data);
			}
		}
	}
}
