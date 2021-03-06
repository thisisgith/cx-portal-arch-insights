
import {
	Component,
	Input,
	SimpleChanges,
	OnInit,
	Output,
	EventEmitter,
	OnChanges,
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
	selector: 'app-asset-timeline-chart',
	styleUrls: ['./asset-timeline-chart.component.scss'],
	template: '<div id="timeline-chart" [chart]="chart"></div>',
})
export class AssetTimelineChartComponent implements OnInit, OnChanges {
	@Input() public data: AssetRecommendationsResponse;
	@Input() public fullscreen;
	@Output() public selectedPoint = new EventEmitter<any>();
	public chart: Chart;
	constructor (
		private logger: LogService,
	) { }

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
	public buildGraph () {
		const seriesData = this.formatGraphData();
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
				styledMode: false,
				type: 'timeline',
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
				series: {
					point: {
						events: {
							click: event => this.selectSubfilter(event),
						},
					},
				},
				timeline: {
					className: 'timeline',
					dataLabels: {
						allowOverlap: false,
						borderWidth: 0,
						connectorColor: '#049fd9',
						distance: 50,
						enabled: true,
						/* tslint:disable:no-string-literal object-literal-shorthand */
						formatter: function () {
							let format = '';
							const name = this['point'].groupedLabels ?
								this['point'].groupedLabels : this['point'].name;
							format += '<span style="cursor:pointer;">';
							const versionLabels = name.split('/');
							_.map(versionLabels, (versionName, index) => {
								format += `<span
									style='cursor:pointer;font-weight: bold;font-size:1.4rem'>
									${versionName}`;
								if (index !== versionLabels.length - 1) {
									format += ',';
								}
								format += '</span><br/>';
							});
							format += `
								<span style='cursor:pointer;font-weight: normal;;font-size:1.1rem'>
									${this['point'].label}
								</span>
								<br/>
								<span style='cursor:pointer;font-weight: normal;;font-size:1.1rem'>
									${this['point'].releaseDate}
								</span>
									<br/>
							</span>`;
							if (this['point'].accepted) {
								format += '<span style=";font-size:1.2rem;font-weight:bold';
								format += 'color:#6ebe4a">Accepted</span>';
							}
							/* tslint:enable:no-string-literal object-literal-shorthand */

							return format;
						},
						style: {
							fontWeight: 'normal',
						},
					},
					marker: {
						fillColor: '#049fd9',
						lineColor: '#049fd9',
						lineWidth: 1,
						radius: 3,
						symbol: '',
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
				backgroundColor: '#39393b',
				borderColor: '#39393b',
				enabled: true,
				/* tslint:disable-next-line:ter-max-len */
				headerFormat: '<span style="font-size:1.2rem;font-weight:bold;">{point.key}</span><br/>',
				pointFormat: '{point.info}',
				style: {
					color: '#fff',
					width: 300,
				},
				useHTML: true,
			},
			xAxis: {
				lineColor: '#dfdfdf',
				lineWidth: 1,
				reversed: false,
				tickColor: '#dfdfdf',
				tickInterval: (365 * 24 * 3600 * 1000) / 2,
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
	 * format data for timeline graph
	 * @returns formatted data
	 */
	public formatGraphData () {
		const datePipe = new DatePipe('en-US');

		return _.compact(
			_.map(this.data, (value: AssetRecommendations) => {
				const releaseDate = new Date(value.postDate);
				if (!value.error && !_.isNull(value.postDate)) {
					return {
						accepted: value.accepted,
						description: value.name,
						info: value.info,
						groupedLabels: value.groupedLabels,
						label: value.swVersion,
						name: _.capitalize(value.name),
						releaseDate: datePipe.transform(new Date(value.postDate), 'MMM d, y'),
						swVersion: value.swVersion,
						x: Date.UTC(
							releaseDate.getFullYear(),
							releaseDate.getMonth(),
							releaseDate.getDate(),
						),
					};
				}
			}));
	}

	/**
	 * OnChanges Functionality
	 * @param changes change found
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const fullscreen = _.get(changes, 'fullscreen',
			{ currentValue: null, firstChange: false });
		const assetDetails = _.get(changes, 'fullscreen');
		if (!fullscreen.firstChange || !assetDetails.firstChange) {
			setTimeout(() => {
				this.buildGraph();
			}, 250);
		}
	}

	/**
	 * Emits the subfilter selected
	 * @param event highcharts click event
	 */
	public selectSubfilter (event: any) {
		event.stopPropagation();
		_.set(event, 'point.selected', true);
		this.selectedPoint.emit(event.point);
	}

}
