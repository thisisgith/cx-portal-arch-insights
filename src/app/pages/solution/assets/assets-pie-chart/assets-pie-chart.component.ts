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
		const data = _.map(this.seriesData, d => ({
			name: d.label,
			y: d.value,
		}));

		this.chart = new Chart({
			chart: {
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
				data,
				colorByPoint: true,
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
