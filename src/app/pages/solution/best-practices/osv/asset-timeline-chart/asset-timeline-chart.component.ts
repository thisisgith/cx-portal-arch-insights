
import {
	Component,
	Input,
	ViewEncapsulation,
	SimpleChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash-es';
import {
	AssetRecommendationsResponse,
	AssetRecommendations,
} from '@sdp-api';
import { DatePipe } from '@angular/common';
/**
 * AssetTimelineChart Component
 */
@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'app-asset-timeline-chart',
	styleUrls: ['./asset-timeline-chart.component.scss'],
	templateUrl: './asset-timeline-chart.component.html',
})
export class AssetTimelineChartComponent {
	@Input() public data: AssetRecommendationsResponse;
	@Input() public fullscreen;
	public chart: Chart;
	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetTimelineChartComponent Created!');
	}

	/**
	 * Initializes the bubble chart
	 */
	public ngOnInit () {
		if (this.data) {
			this.buildGraph();
		}
	}

	/**
	 * Builds our bubble graph
	 */
	private buildGraph () {
		const datePipe = new DatePipe('en-US');
		const seriesData = _.compact(
			_.map(this.data, (value: AssetRecommendations) => {
				const releaseDate = new Date(value.postDate);
				return {
					color: 'blue',
					description: value.name,
					label: value.swVersion,
					name: _.capitalize(value.name),
					x: Date.UTC(
						releaseDate.getFullYear(),
						releaseDate.getMonth(),
						releaseDate.getDate(),
					),
					releaseDate: datePipe.transform(new Date(value.postDate), 'dd MMM yyyy'),
				};
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
				styledMode: true,
				type: 'timeline',
				zoomType: 'x',
			},
			credits: {
				enabled: false,
			},
			exporting: {
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				timeline: {
					dataLabels: {
						borderWidth: 0,
						connectorColor: 'blue',
						distance: 50,
						enabled: true,
						/* tslint:disable:object-literal-shorthand*/
						/* tslint:disable:no-string-literal */
						formatter: function () {
							return `<span class="title" style='font-weight: bold;' > ${this['point'].name}</span>
							<br/><span>${this['point'].label}</span>
							<br/><span>${this['point'].releaseDate}</span>`;
						},
						style: {
							fontWeight: 'normal',
							textOutline: 'none',
						},
					},
					marker: {
						lineWidth: 10,
						radius: 6,
						symbol: '',
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
			series: [
				{
					data: seriesData,
					type: 'timeline',
				},
			],
			title: {
				text: null,
			},
			tooltip: {
				enabled: false,
			},
			xAxis: {
				lineColor: 'blue',
				lineWidth: 1,
				reversed: true,
				tickColor: 'blue',
				tickInterval: 365 * 24 * 3600 * 1000,
				tickLength: 10,
				type: 'datetime',
				visible: true,
			},
			yAxis: {
				gridLineWidth: 0,
				labels: {
					enabled: false,
				},
				title: null,
			},
		});
	}

	/**
	 * OnChanges Functionality
	 * @param changes change found
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const fullscreen = _.get(changes, 'fullscreen',
			{ currentValue: null, firstChange: false });
		if (!fullscreen.firstChange) {
			this.buildGraph();
		}
	}

	/**
	 * Emits the subfilter selected
	 * @param event highcharts click event
	 */
	public selectSubfilter (event: any) {
		event.stopPropagation();
		this.logger.debug(event.point.name);
	}

}
