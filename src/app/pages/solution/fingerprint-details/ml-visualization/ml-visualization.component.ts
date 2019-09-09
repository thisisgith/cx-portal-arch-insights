import {
	Component,
	OnInit,
	OnDestroy,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
	Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
	CPProductFamily,
	MlVisualizationDevices,
	MlVisualizationService,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * ml-visualization component
 */
@Component({
	selector: 'ml-visualization',
	templateUrl: './ml-visualization.component.html',
})
export class MlVisualizationComponent implements OnInit, OnChanges, OnDestroy {
	public customerId: string;
	private destroyed$: Subject<void> = new Subject<void>();
	public selectedProductFamily: any;
	public selectedMode: any = 2;
	public productFamiliesList: CPProductFamily[];
	public loadingProductFamilies = false;
	public listOfModes: any[] = [
		{ name: 'Features', value: 1 },
		{ name: 'Full DNA', value: 2 },
		{ name: 'Lemma Feature', value: 3 },
	];
	public listOfDevices1: any[];
	public listOfDevices2: any[];
	public deviceSearchList: any[];
	public selectedDevice1: any;
	public selectedDevice2: any;
	public searchedDevice: any;
	public selectedDevice: any;
	public mlVisualizationDevices: MlVisualizationDevices;
	public scatterPlotDataPoints: any;
	public pointSize = 5;
	public windowWidth = 600;
	public windowHeight = 400;
	public seriesDataLoading = false;
	public noData = false;
	@Input() public asset: any;
	@Output() public devicesSelected: EventEmitter<any> = new EventEmitter<any>();
	@Output() public reqError: EventEmitter<any> = new EventEmitter<any>();
	public requestForm: FormGroup = this.fb.group({
		selectedGroup: ['group1', Validators.required],
	});

	constructor (
		public mlVisualizationService: MlVisualizationService,
		private logger: LogService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.selectedProductFamily = '';
	}
	/**
	 * productFamiliesList
	 */
	public ngOnInit (): void {
		this.logger.debug('ML loaded');
	}

	/**
	 * simlarDevicedata
	 * @param changes asset
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		this.resetFilterForm();
		this.selectedDevice = _.get(
			changes,
			['asset', 'currentValue', 'deviceId'],
			null,
		);
		this.selectedProductFamily = _.get(
			changes,
			['asset', 'currentValue', 'productFamily'],
			null,
		);
		this.selectedProductFamily = _.replace(
			this.selectedProductFamily,
			/\s/g,
			'_',
		);
		this.loadProductFamiliesList();
		this.fetchScatterPlotDataPoints(this.selectedProductFamily);
	}

	/**
	 * Loads the list of product families from the MlVisualization service
	 */
	private loadProductFamiliesList (): void {
		this.mlVisualizationService
			.getProductFamilies({
				customerId: this.customerId,
			})
			.subscribe(response => {
				this.productFamiliesList = response.mlProductFamily;
			});
	}
	/**
	 * ScatterPlotDataPoints
	 * @param selectedVal selectedVal
	 */
	public fetchScatterPlotDataPoints (selectedVal) {
		this.seriesDataLoading = true;
		if (selectedVal) {
			this.mlVisualizationService
				.getMlVisualizationDevices({
					customerId: this.customerId,
					productId: this.selectedProductFamily,
				})
				.subscribe(
					mlVisualizationDevices => {
						this.mlVisualizationDevices = mlVisualizationDevices;
						this.deviceSearchList =
							mlVisualizationDevices.scatterPlotDevices;
						this.noData = false;
						this.reqError.emit();
					},
					err => {
						this.seriesDataLoading = false;
						this.reqError.emit(
							I18n.get('_CP_MLVisualizationError_'),
						);
						this.logger
							.error(` I18n.get('_CP_MLVisualizationError_')
						:: Error : (${err.status}) ${err.message}`);
						this.noData = true;
					},
					() => {
						this.seriesDataLoading = false;
						this.updateScatterPlotDataPoints();
					},
				);
		}
	}

	/**
	 * Resets Filter values and loads data for selected product family
	 * @param selectedProductFamily the product family for which device list has to be loaded
	 */
	public updateMlVisualizationDevices (selectedProductFamily: string) {
		this.resetFilterForm();
		this.fetchScatterPlotDataPoints(selectedProductFamily);
	}

	/**
	 * scatterPlotdatapoint
	 * @param selectedMode Scatterplot
	 */
	public updateScatterPlotDataPoints () {
		if (this.mlVisualizationDevices) {
			this.scatterPlotDataPoints = this.loadData(
				this.mlVisualizationDevices.scatterPlotDevices,
				this.selectedMode,
			);
			this.scatterPlotDataPoints.forEach(dataPoint => {
				dataPoint.radius = _.get(dataPoint.devices, 'length', 1);
				_.each(dataPoint.devices, device => {
					if (device.deviceInfo.deviceId === this.selectedDevice) {
						this.updateSelectedDeviceGroup(device.deviceInfo);
						this.updateDeviceList(dataPoint.devices);
					}
				});
			});
			this.logger.info(JSON.stringify(this.scatterPlotDataPoints));
		}
	}

	/**
	 * listdevice2
	 * @param deviceList deviceList
	 */
	public updateDeviceList (deviceList: any[]) {
		if (this.requestForm.get('selectedGroup').value === 'group1') {
			this.listOfDevices1 = deviceList;
		}
		if (this.requestForm.get('selectedGroup').value === 'group2') {
			this.listOfDevices2 = deviceList;
		}
	}

	/**
	 * Select the searched device in the scatter plot.
	 * @param deviceId Device to be searched in the dataset.
	 */
	public updateSelectedDeviceBySearch (deviceId: string) {
		this.selectedDevice = deviceId;
		this.scatterPlotDataPoints = _.each(
			this.scatterPlotDataPoints,
			dataPoint => {
				_.each(dataPoint.devices, device => {
					if (device.deviceInfo.deviceId === deviceId) {
						this.updateDeviceList(dataPoint.devices);
						this.updateSelectedDeviceGroup(device.deviceInfo);
					}
				});
			},
		);
	}

	/**
	 * selectedDevice
	 * @param event slecetedDevice
	 */
	public updateSelectedDeviceGroup (event) {
		if (this.requestForm.get('selectedGroup').value === 'group1') {
			this.selectedDevice1 = event;
		}
		if (this.requestForm.get('selectedGroup').value === 'group2') {
			this.selectedDevice2 = event;
		}
	}

	/**
	 * resetFilterForm
	 */
	public resetFilterForm () {
		this.searchedDevice = '';
		this.selectedDevice1 = '';
		this.selectedDevice2 = '';
		this.listOfDevices1 = [];
		this.listOfDevices2 = [];
	}

	/**
	 * deviceId
	 * @param event deviceComparison
	 */
	public showDeviceComparison (event) {
		if (this.selectedDevice1 && this.selectedDevice2) {
			this.devicesSelected.emit({
				deviceId1: _.get(
					this.selectedDevice1,
					['deviceInfo', 'deviceId'],
					this.selectedDevice1.deviceId,
				),
				deviceId2: this.selectedDevice2.deviceId,
				productId1: _.get(
					this.selectedDevice1,
					['deviceInfo', 'productId'],
					this.selectedDevice1.productId,
				),
				productId2: this.selectedDevice2.productId,
			});
		}
		this.logger.info(event);
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {Array} out the receiving vector
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {Array} out
	 */
	public lerp (out, a, b, t) {
		out.x = a.x + t * (b.x - a.x);
		out.y = a.y + t * (b.y - a.y);
		out.z = a.z + t * (b.z - a.z);

		return out;
	}

	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @returns {Number} distance between a and b
	 */
	public distance (a, b) {
		const x = b.x - a.x;
		const y = b.y - a.y;
		const z = b.z - a.z;

		return Math.hypot(x, y, z);
	}

	/**
	 * Get Field name positions
	 * @param mode any
	 * @returns indexes
	 */
	public getFieldNamePositions (mode) {
		let pca1FieldName;
		let pca2FieldName;
		let pca3FieldName;
		let kClusterFieldName;
		let kClusterCrashRateFieldName;
		switch (mode) {
			case 1: // Full DNA.
				pca1FieldName = 'lemmaFeaturePCA1';
				pca2FieldName = 'fingerprintPCA2';
				pca3FieldName = 'fingerprintPCA3';
				kClusterFieldName = 'fingerprintKcluster';
				kClusterCrashRateFieldName = 'fingerprintKclusterCrashrate';
				break;
			case 2: // Features only.
				pca1FieldName = 'featureProfilePCA1';
				pca2FieldName = 'featureProfilePCA2';
				pca3FieldName = 'featureProfilePCA3';
				kClusterFieldName = 'featureProfileKcluster';
				kClusterCrashRateFieldName = 'featureProfileKclusterCrashrate';
				break;
			case 3: // Lemma features.
				pca1FieldName = 'lemmaFeaturePCA1';
				pca2FieldName = 'lemmaFeaturePCA2';
				pca3FieldName = 'lemmaFeaturePCA3';
				kClusterFieldName = 'lemmaFeatureKcluster';
				kClusterCrashRateFieldName = 'lemmaFeatureKclusterCrashrate';
		}

		return {
			crashRate: kClusterCrashRateFieldName,
			deviceId: 'deviceId',
			deviceName: 'deviceName',
			productId: 'productId',
			kCluster: kClusterFieldName,
			pca1: pca1FieldName,
			pca2: pca2FieldName,
			pca3: pca3FieldName,
		};
	}

	/**
	 * Load data
	 * @param rows any
	 * @param mode any
	 * @returns coalescePoints()
	 */
	public loadData (rows, mode) {
		// Get index of relevant fields.
		const fieldNameIndexes = this.getFieldNamePositions(parseInt(mode, 10));
		// Extract and transform points.
		const dataPoints = { }; // [cluster: [points]]
		_.each(rows, row => {
			const point = {
				clusterIndex: parseInt(row[fieldNameIndexes.kCluster], 10),
				crashRate: parseFloat(row[fieldNameIndexes.crashRate]),
				deviceId: row[fieldNameIndexes.deviceId],
				deviceName: row[fieldNameIndexes.deviceName],
				productId: row[fieldNameIndexes.productId],
				position: {
					x: parseFloat(row[fieldNameIndexes.pca1]),
					y: parseFloat(row[fieldNameIndexes.pca2]),
					z: parseFloat(row[fieldNameIndexes.pca3]),
				},
			};
			const cluster = point.clusterIndex;
			if (!dataPoints[cluster]) {
				dataPoints[cluster] = [];
			}
			dataPoints[cluster].push(point);
		});

		/**
		 * Get coalesced points.
		 */
		return this.coalescePoints(dataPoints);
	}

	/**
	 * getCoalescedNearIndex
	 * @param clusterPoints any
	 * @param position any
	 * @returns coalescePoints()
	 */
	public getCoalescedNearIndex (clusterPoints, position) {
		const coalescingDistance = 2 * this.pointSize;
		_.each(clusterPoints, (cdp, i) => {
			const distance =
				this.distance(cdp.position, position) * this.pointSize;
			if (distance <= coalescingDistance) {
				return i;
			}
		});

		return -1;
	}

	/**
	 * coalescePoints
	 * @param dataPointSeries any
	 * @returns data.coalescedDataPoints
	 */
	public coalescePoints (dataPointSeries) {
		const data = {
			clusterInfo: { },
			coalescedDataPoints: [],
		};
		let cdp;
		let cdpId = 0;
		_.forIn(dataPointSeries, (dataPoints, key) => {
			if (key) {
				const clusterPoints = [];
				const length = dataPoints.length;
				const info = {
					count: length,
					center: null,
					crash: 0.0,
				};
				_.each(dataPoints, dataPoint => {
					const position = dataPoint.position;
					info.crash = dataPoint.crashRate;
					// If point near a coalesced point, coalesce.
					const nearIndex = this.getCoalescedNearIndex(
						clusterPoints,
						position,
					);
					if (nearIndex >= 0) {
						cdp = clusterPoints[nearIndex];
						this.lerp(
							cdp.position,
							cdp.position,
							position,
							1 / (cdp.mass + 1),
						);
						cdp.mass += 1;
						if (cdp.devices.length < 10) {
							cdp.devices.push({
								deviceInfo: {
									deviceId: dataPoint.deviceId,
									productId: dataPoint.productId,
								},
								deviceName: dataPoint.deviceName,
							});
							cdp.radius += 1;
						}
						clusterPoints[nearIndex] = cdp;
					} else {
						// Add new point.
						cdp = {
							position,
							cluster: dataPoint.clusterIndex,
							devices: [
								{
									deviceInfo: {
										deviceId: dataPoint.deviceId,
										productId: dataPoint.productId,
									},
									deviceName: dataPoint.deviceName,
								},
							],
							id: cdpId,
							mass: 1.0,
							radius: 1,
							x: position.x,
							y: position.y,
							z: position.z,
						};
					}
					clusterPoints.push(cdp);
					cdpId += 1;
				});
				// $.merge(data.coalescedDataPoints, clusterPoints);
				data.coalescedDataPoints = data.coalescedDataPoints.concat(
					clusterPoints,
				);
				// Calculate cluster centroid.
				const centroidAdditionWeigth = 1 / clusterPoints.length;
				clusterPoints.forEach(point => {
					if (info.center) {
						this.lerp(
							info.center,
							info.center,
							point.position,
							centroidAdditionWeigth,
						);
					} else {
						info.center = JSON.parse(
							JSON.stringify(point.position),
						);
					}
				});
				data.clusterInfo[key] = info;
			}
		});

		return data.coalescedDataPoints;
	}
}
