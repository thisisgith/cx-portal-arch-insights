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
 * Main component for the Pie Chart
 */
@Component({
	selector: 'pie-chart',
	template: '<div [chart]="chart"></div>',
})
export class PieChartComponent implements OnInit {

	@Input() public loading;
	@Input() public seriesData;
	@Input() public width = 250;
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
		const data = _.map(this.seriesData, d => ({
			color: d.color,
			name: d.label,
			y: d.value,
		}));

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
				width: this.width,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				pie: {
					cursor: 'pointer',
					dataLabels: {
						allowOverlap: false,
						distance: 15,
						enabled: true,
					},
					innerSize: '80%',
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
		const seriesInfo = _.get(changes, 'seriesData',
			{ currentValue: null, firstChange: false });
		if (seriesInfo.currentValue && !seriesInfo.firstChange) {
			this.buildGraph();
		}
	}
}
