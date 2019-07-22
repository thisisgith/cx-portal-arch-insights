
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
	BasicRecommendationsResponse,
	BasicRecommendation,
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
	@Input() public data: BasicRecommendationsResponse;
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
			_.map(this.data, (value: BasicRecommendation) => {
				const releaseDate = new Date(value.releaseDate);
				return {
					description: value.versionSummary,
					label: value.version,
					name: value.versionSummary,
					x: Date.UTC(
						releaseDate.getFullYear(),
						releaseDate.getMonth(),
						releaseDate.getDate(),
					),
					releaseDate: datePipe.transform(new Date(value.releaseDate), 'dd MMM yyyy'),
				};
			}));

		this.chart = new Chart({
			chart: {
				styledMode: true,
				type: 'timeline',
				zoomType: 'x',
			},
			credits: {
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
							return `<span style='font-weight: bold;' > ${this['point'].name}</span>
							<br/>${this['point'].label}
							<br/>${this['point'].releaseDate}`;
						},
						style: {
							fontWeight: 'normal',
							textOutline: 'none',
						},
					},
					marker: {
						lineColor: 'blue',
						lineWidth: 10,
						radius: 0,
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

}
