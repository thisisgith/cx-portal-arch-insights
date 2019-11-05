import {
	Component,
	EventEmitter,
	Input,
	Output,
	SimpleChanges,
	OnChanges,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';

/**
 * Main component for the Bar Chart
 */
@Component({
	selector: 'bar-chart',
	styleUrls: ['./bar-chart.component.scss', '../tooltip/tooltip.scss'],
	template: `
		<div>
			<div [chart]="chart"></div>
			<div class="hbar__divider"></div>
		</div>
	`,
})
export class BarChartComponent implements OnChanges {

	@Input() public width;
	@Input() public loading;
	@Input() public seriesData;
	@Input() public dataLabels = false;
	@Input() public backgroundColor = '#ffffff';
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Builds our bar graph
	 */
	private buildGraph () {
		const data = [];
		const categories = [];
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
				backgroundColor: this.backgroundColor,
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
				height: (this.seriesData.length + 1) * 25,
				type: 'bar',
				width: this.width || 225,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				bar: {
					pointWidth: 12,
				},
				series: {
					cursor: 'pointer',
					dataLabels: {
						enabled: this.dataLabels,
					},
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
					enableMouseTracking: !this.loading,
					minPointLength: 5,
					name: '',
					opacity: this.loading ? 0.5 : 1,
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
				backgroundColor: null,
				borderWidth: 0,
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
						width: 80,
					},
				},
				lineColor: 'transparent',
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
