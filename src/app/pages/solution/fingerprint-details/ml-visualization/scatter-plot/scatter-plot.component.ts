import {
	Component,
	Renderer2,
	ViewChild,
	ElementRef,
	Input,
	AfterViewInit,
	OnChanges,
	SimpleChanges,
	Output,
	EventEmitter,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts/highcharts';
import { LogService } from '@cisco-ngx/cui-services';
import { fromEvent } from 'rxjs';
import { skipUntil, takeUntil, map } from 'rxjs/operators';
import { ChartDragMapper } from 'src/app/interfaces/chartmap';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * ChartDragMap Mapper to locate chart position and view angle
 */
class ChartDragMap implements ChartDragMapper {
	public posX: number;
	public posY: number;
	public alpha = 10;
	public beta = 30;
	public newAlpha: number;
	public newBeta: number;
	public sensitivity = 5;
	constructor (
		posX?,
		posY?,
		alpha?,
		beta?,
		newAlpha?,
		newBeta?,
		sensitivity?,
	) {
		this.posX = posX;
		this.posY = posY;
		this.alpha = alpha;
		this.beta = beta;
		this.newAlpha = newAlpha;
		this.newBeta = newBeta;
		this.sensitivity = sensitivity;
	}
}

/**
 * Draws scatter plot 3D
 */
@Component({
	selector: 'app-scatter-plot',
	templateUrl: './scatter-plot.component.html',
})
export class ScatterPlotComponent implements OnChanges, AfterViewInit {
	public sub: any;
	public box: any;
	public mousedown$;
	public mouseup$;
	public chart: Chart;
	public chartDragMap: ChartDragMapper = new ChartDragMap();
	public Highcharts = Highcharts;
	@Input() public dataPoints: any;
	@Input() public selectedDevice: any;
	@Output() public groupSelected: EventEmitter<any[]> = new EventEmitter<any[]>();
	public enableZoom = false;

	public windowWidth = 600;
	public windowHeight = 400;
	public pointSize = 3;
	@ViewChild('box', { static: false }) public plotContainer;

	constructor (
		private logger: LogService,
		public renderer: Renderer2,
		private elRef: ElementRef,
	) {
		this.logger.debug('ScatterPlot component Created!');
		this.chartDragMap = new ChartDragMap(null, null, 10, 30, null, null, 5);
	}

	/**
	 * Detect changes to load chart with updated values
	 * @param changes updated values
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.dataPoints) {
			this.dataPoints = changes.dataPoints.currentValue;
			this.buildGraph();
			const newSeries: Highcharts.SeriesScatter3dOptions = {
				type: 'scatter3d',
				allowPointSelect: true,
				point: {
					events: {
						select: function (event: any) {
							this.groupSelected.emit(
								event.target.options.devices,
							);
						}.bind(this),
					},
				},
				boostThreshold: 1,
				name: 'MlVisualization',
				data: this.dataPoints,
			};
			this.chart.ref$.subscribe(chartRef => {
				_.invoke(chartRef.series, '[0].remove');
				chartRef.addSeries(newSeries);
				chartRef.redraw(false);
				this.updateSelectedDeviceBySearch(
					this.selectedDevice,
					chartRef.series[0].data,
				);
			});
		}
		if (changes.selectedDevice && !changes.dataPoints) {
			this.chart.ref$.subscribe(chartRef => {
				this.updateSelectedDeviceBySearch(
					changes.selectedDevice.currentValue,
					chartRef.series[0].data,
				);
			});
		}
	}

	/**
	 * Select the searched device in the scatter plot.
	 * @param deviceId Device to be searched in the dataset.
	 * @param dataPoints list of points on the scatter plot
	 */
	public updateSelectedDeviceBySearch (deviceId: string, dataPoints) {
		_.each(dataPoints, dataPoint => {
			_.each(dataPoint.devices, device => {
				if (device.deviceInfo.deviceId === deviceId) {
					dataPoint.select(true, false);
				}
			});
		});
	}
	/**
	 * Load mouse event onAfterViewInit
	 */
	public ngAfterViewInit (): void {
		this.box = this.elRef.nativeElement.querySelector('#box');
		this.mousedown$ = fromEvent(this.box, 'mousedown');
		this.mouseup$ = fromEvent(this.box, 'mouseup');
		this.mouseup$.subscribe(() => {
			this.register();
		});
		this.mousedown$.subscribe((pointerEvent: PointerEvent) => {
			const event = this.chart.ref.pointer.normalize(pointerEvent);
			this.chartDragMap.posX = event.pageX;
			this.chartDragMap.posY = event.pageY;
			this.chartDragMap.alpha = _.get(
				this.chart,
				'ref.options.chart.options3d.alpha',
			);
			this.chartDragMap.beta = _.get(
				this.chart,
				'ref.options.chart.options3d.beta',
			);
		});
		this.register();
	}

	/**
	 * Scatter Chart 3D configuration options
	 */
	public buildGraph () {
		this.chart = new Chart({
			boost: {
				enabled: true,
				allowForce: true,
				useGPUTranslations: true,
			},
			chart: {
				animation: false,
				type: 'scatter3d',
				renderTo: 'box',
				width: this.windowWidth,
				height: this.windowHeight,
				margin: 5,
				zoomKey: 'alt',
				resetZoomButton: {
					theme: {
						zIndex: 6,
					},
					position: {
						align: 'right',
						x: -10,
						y: 10,
					},
				},
				options3d: {
					enabled: true,
					alpha: 10,
					beta: 30,
					depth: 250,
					viewDistance: 5,
					fitToPlot: true,
					frame: {
						bottom: {
							size: 0,
							color: 'rgba(0,0,0,0.02)',
							visible: false,
						},
						back: {
							size: 0,
							color: 'rgba(0,0,0,0.04)',
							visible: false,
						},
						left: { visible: false },
						right: { visible: false },
						front: { visible: false },
						top: { visible: false },
					},
				},
			},
			tooltip: {
				enabled: false,
			},
			title: {
				align: 'left',
				floating: true,
				style: {
					fontSize: '14px',
				},
				text: I18n.get('_CP_MLVisualizationTitle'),
				verticalAlign: 'top',
			},
			mapNavigation: {
				enabled: true,
				enableButtons: true,
				enableMouseWheelZoom: true,
			},
			plotOptions: {
				scatter3d: {
					boostThreshold: 1,
					animation: false,
				},
			},
			credits: {
				enabled: false,
			},
			yAxis: {
				allowDecimals: true,
				title: null,
				gridLineWidth: 0,
				labels: {
					enabled: false,
				},
			},
			xAxis: {
				gridLineWidth: 0,
				allowDecimals: true,
				labels: {
					enabled: false,
				},
			},
			zAxis: {
				allowDecimals: true,
				showFirstLabel: false,
				labels: {
					enabled: false,
				},
			},
			legend: {
				enabled: false,
			},
			series: [
				{
					type: 'scatter3d',
					allowPointSelect: true,
					point: {
						events: {
							select: function (event: any) {
								this.groupSelected.emit(
									event.target.options.devices,
								);
							}.bind(this),
						},
					},
					boostThreshold: 1,
					name: 'MlVisualization',
					colorByPoint: true,
					data: this.dataPoints,
				},
			],
			exporting: {
				enabled: false,
			},
		});
	}

	/**
	 * triggered when a point is selected in the chart
	 * @param event point selected in the chart
	 */
	public pointSelected (event: any) {
		this.groupSelected.emit(event.target.options.devices);

		return;
	}

	/**
	 * Register mouse events on chart
	 */
	public register () {
		try {
			_.invoke(this.sub, 'unsubscribe');
		} catch (err) {
			this.logger.error(err);
		}

		let mousemove$ = fromEvent(this.box, 'mousemove');
		mousemove$ = mousemove$.pipe(skipUntil(this.mousedown$));
		mousemove$ = mousemove$.pipe(takeUntil(this.mouseup$));
		this.sub = mousemove$
			.pipe(
				map((event: MouseEvent) => {
					// Run beta
					this.chartDragMap.newBeta =
						this.chartDragMap.beta +
						(this.chartDragMap.posX - event.pageX) /
							this.chartDragMap.sensitivity;
					this.chart.ref.options.chart.options3d.beta = this.chartDragMap.newBeta;

					// Run alpha
					this.chartDragMap.newAlpha =
						this.chartDragMap.alpha +
						(event.pageY - this.chartDragMap.posY) /
							this.chartDragMap.sensitivity;
					this.chart.ref.options.chart.options3d.alpha = this.chartDragMap.newAlpha;

					if (!this.enableZoom) {
						this.chart.ref.redraw(false);
					}
				}),
			)
			.subscribe(() =>
				this.logger.info('Register event of Scatter Chart 3D'),
			);
	}

	/**
	 * Toggles mouse interaction from zoom to rotate
	 * @param enableZoom toggle between zoom and rotate
	 */
	public changeChartNavigation (enableZoom: boolean = false) {
		this.enableZoom = enableZoom;
		if (enableZoom) {
			_.invoke(this.chart, 'ref.update', {
				chart: {
					zoomType: 'xy',
				},
			});
		} else {
			delete this.chart.ref.options.chart.zoomType;
			this.chart.ref.redraw(false);
		}
	}
}
