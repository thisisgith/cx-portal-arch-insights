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
 * Main component for the Assets Pie Chart
 */
@Component({
	selector: 'assets-pie-chart',
	styleUrls: ['./assets-pie-chart.component.scss'],
	templateUrl: './assets-pie-chart.component.html',
})
export class AssetsPieChartComponent implements OnInit {

	@Output() public subfilter = new EventEmitter<string>();
	@ViewChild('chart', { static: true }) public chartEl: ElementRef;
	public chart: Chart;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetsPieChartComponent Created!');
	}

	/**
	 * Initializes the pie chart
	 */
	public ngOnInit () {
		// fake data until the API's are complete
		this.chart = new Chart({
			chart: {
				height: 200,
				renderTo: this.chartEl.nativeElement,
				type: 'pie',
				width: 250,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				pie: {
					innerSize: 95,
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
					data: [
						{
							name: 'P1',
							y: 20,
						},
						{
							name: 'P2',
							y: 40,
						},
						{
							name: 'P3',
							y: 15,
						},
						{
							name: 'P4',
							y: 25,
						},
					],
					name: 'Placeholder',
					type: undefined,
				},
			],
			title: {
				text: '',
			},
		});
	}

	/**
	 * Emits the subfilter selected
	 * @param event highcharts click event
	 */
	public selectSubfilter (event: SeriesPointClickEventObject) {
		event.stopPropagation();
		this.subfilter.emit(event.point.name);
	}
}
