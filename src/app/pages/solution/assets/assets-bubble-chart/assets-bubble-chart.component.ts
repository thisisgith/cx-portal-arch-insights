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
 * Main component for the Assets Bubble Chart
 */
@Component({
	selector: 'assets-bubble-chart',
	styleUrls: ['./assets-bubble-chart.component.scss'],
	templateUrl: './assets-bubble-chart.component.html',
})
export class AssetsBubbleChartComponent implements OnInit {

	@Output() public subfilter = new EventEmitter<string>();
	@ViewChild('chart', { static: true }) public chartEl: ElementRef;
	public chart: Chart;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetsBubbleChartComponent Created!');
	}

	/**
	 * Initializes the bubble chart
	 */
	public ngOnInit () {
		// TODO: replace fake data with API's
		this.chart = new Chart({
			chart: {
				height: 200,
				renderTo: this.chartEl.nativeElement,
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
			series: [
				{
					data: [
						{
							name: 'Access',
							value: 467.1,
						},
					],
					name: 'Access',
					type: undefined,
				},
				{
					data: [
						{
							name: 'Aggregation',
							value: 567.1,
						},
					],
					name: 'Aggregation',
					type: undefined,
				},
				{
					data: [
						{
							name: 'Edge',
							value: 477.1,
						},
					],
					name: 'Edge',
					type: undefined,
				},
				{
					data: [
						{
							name: 'Core',
							value: 477.1,
						},
					],
					name: 'Core',
					type: undefined,
				},
				{
					data: [
						{
							name: 'Branch',
							value: 452.16,
						},
					],
					name: 'Branch',
					type: undefined,
				},
			],
			title: {
				text: null,
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
