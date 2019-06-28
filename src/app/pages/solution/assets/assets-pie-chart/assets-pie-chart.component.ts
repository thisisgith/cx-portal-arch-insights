import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	Input,
	SimpleChanges,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';

/**
 * Main component for the Assets Pie Chart
 */
@Component({
	selector: 'assets-pie-chart',
	styleUrls: ['./assets-pie-chart.component.scss'],
	templateUrl: './assets-pie-chart.component.html',
})
export class AssetsPieChartComponent implements OnInit {

	@Input() public seriesData;
	@Output() public subfilter = new EventEmitter<string>();
	public chart: Chart;

	/**
	 * Component initialization
	 */
	public ngOnInit () {
		if (this.seriesData) {
			this.buildGraph();
		}
	}

	/**
	 * Initializes the pie chart
	 */
	private buildGraph () {
		this.chart = new Chart({
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
				height: 200,
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				width: 250,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				pie: {
					cursor: 'pointer',
					dataLabels: {
						allowOverlap: false,
						enabled: true,
					},
					innerSize: 60,
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
				colorByPoint: true,
				data: this.seriesData,
				name: '',
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
		this.subfilter.emit(event.point.name);
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
