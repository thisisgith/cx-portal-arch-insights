import {
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import {
	Chart,
	SeriesPointClickEventObject,
} from 'highcharts';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main component for the Assets Bar Chart
 */
@Component({
	selector: 'assets-bar-chart',
	styleUrls: ['./assets-bar-chart.component.scss'],
	templateUrl: './assets-bar-chart.component.html',
})
export class AssetsBarChartComponent implements OnInit {

	@Output() public subfilter = new EventEmitter<string>();
	@ViewChild('chart', { static: true }) public chartEl: ElementRef;
	public chart: Chart;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetsBarChartComponent Created!');
	}

	/**
	 * Initializes the bar chart
	 */
	public ngOnInit () {
		// all placeholder until the API's are finalized
		this.chart = new Chart({
			chart: {
				height: 100,
				renderTo: this.chartEl. nativeElement,
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
					data: [
						{
							y: 20,
						},
						{
							y: 40,
						},
						{
							y: 15,
						},
					],
					name: 'Placeholder',
					showInLegend: false,
					type: undefined,
				},
			],
			title: {
				text: null,
			},
			xAxis: {
				categories: ['Security Advisories', 'Field Notices', 'Bugs'],
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
	public selectSubfilter (event: SeriesPointClickEventObject) {
		event.stopPropagation();
		this.subfilter.emit(event.point.category.toString());
	}
}
