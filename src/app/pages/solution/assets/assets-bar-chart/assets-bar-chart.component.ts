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
	selector: 'assets-bar-chart',
	styleUrls: ['./assets-bar-chart.component.scss'],
	templateUrl: './assets-bar-chart.component.html',
})
export class AssetsBarChartComponent implements OnInit {

	@Input() public seriesData;
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
	private buildGraph () {
		const data = [];
		const categories = [];
		_.each(this.seriesData, d => {
			data.push({
				name: d.label,
				y: d.y,
			});

			categories.push(d.label);
		});
		this.chart = new Chart({
			chart: {
				height: 100,
				type: 'bar',
				width: 300,
			},
			credits: {
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
			},
			series: [
				{
					data,
					name: '',
					showInLegend: false,
					type: undefined,
				},
			],
			title: {
				text: null,
			},
			xAxis: {
				categories,
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
