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
 * Main component for the Assets Bubble Chart
 */
@Component({
	selector: 'assets-bubble-chart',
	styleUrls: ['./assets-bubble-chart.component.scss'],
	templateUrl: './assets-bubble-chart.component.html',
})
export class AssetsBubbleChartComponent implements OnInit {

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
