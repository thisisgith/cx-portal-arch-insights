import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { FpIntelligenceService, SimilarDevicesDistribution } from '@sdp-api';
import { debounceTime } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import {
	FormGroup,
	FormBuilder,
	Validators,
	AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * type seriesData
 */
interface SeriesData {
	label: string;
	value: number;
}

/**
 * fp-intelligence component
 */
@Component({
	selector: 'fp-intelligence',
	styleUrls: ['./fp-intelligence.component.scss'],
	templateUrl: './fp-intelligence.component.html',
})
export class FpIntelligenceComponent implements OnChanges {
	@Input() public asset: any;
	public deviceId: string;
	public customerId: string;
	private destroyed$: Subject<void> = new Subject<void>();
	public similarityCriteria = 'fingerprint';
	public similarDevicesDistribution: SimilarDevicesDistribution;
	public softwareSeriesData: SeriesData[];
	public productSeriesData: SeriesData[];
	public productFamilySeriesData: SeriesData[];
	public seriesDataLoading = false;
	public noData = false;
	public requestForm: FormGroup = this.fb.group({
		deviceCount: [
			1000,
			[
				Validators.required,
				Validators.min(1),
				Validators.max(1000),
				Validators.pattern('[0-9]*'),
			],
		],
		minMatch: [
			50,
			[
				Validators.required,
				Validators.min(0),
				Validators.max(100),
				Validators.pattern('[0-9]*'),
			],
		],
		similarityCriteria: ['fingerprint', Validators.required],
	});
	@Output() public reqError: EventEmitter<any> = new EventEmitter<any>();

	public get deviceCount (): AbstractControl {
		return this.requestForm.get('deviceCount');
	}
	public get minMatch (): AbstractControl {
		return this.requestForm.get('minMatch');
	}

	constructor (
		private fpIntelligenceService: FpIntelligenceService,
		private logger: LogService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}
	/**
	 * component init
	 */
	public ngOnInit (): void {
		this.logger.info('Similar Device Distribution Loaded');
		this.requestForm.valueChanges
			.pipe(debounceTime(1000))
			.subscribe(val => {
				this.logger.info(val);
				if (this.requestForm.valid) {
					this.loadSimilarDevicesDistribution();
				}
			});
	}
	/**
	 * asset
	 * @param changes simplechange
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		this.deviceId = _.get(changes, ['asset', 'currentValue', 'deviceId'], null);
		if (!_.get(changes, ['asset', 'firstChange'], false) && this.deviceId) {
			this.loadSimilarDevicesDistribution();
		}
	}
	/**
	 * similarDevicesDisteribution
	 */
	public loadSimilarDevicesDistribution () {
		this.seriesDataLoading = true;
		const similarDeviceParams = this.getSimilarDeviceParams(this.requestForm.value);
		this.fpIntelligenceService
			.getSimilarDevicesDistribution(similarDeviceParams)
			.subscribe(
				similarDeviceDistribution => {
					const similarDeviceDistributionDataCount =
					_.get(similarDeviceDistribution, ['softwares', 'length'], 0) +
					_.get(similarDeviceDistribution, ['productFamilies', 'length'], 0) +
					_.get(similarDeviceDistribution, ['products', 'length'], 0);
					if (similarDeviceDistributionDataCount > 0) {
						this.updateSeriesData(similarDeviceDistribution);
						this.noData = false;
						this.reqError.emit();
					} else {
						this.seriesDataLoading = false;
						this.noData = true;
						this.reqError.emit();
					}
				},
				err => {
					this.seriesDataLoading = false;
					this.noData = true;
					this.reqError.emit(I18n.get('_CP_FingerprintIntelligence_Error_'));
					this.logger.error(err);
				},
				() => {
					this.seriesDataLoading = false;
				});
	}
	/**
	 * SeriesData
	 * @param similarDevieDistribution similarDeviceDistribution
	 */
	public updateSeriesData (similarDevieDistribution: SimilarDevicesDistribution): void {
		this.softwareSeriesData = similarDevieDistribution.softwares.map(
			item => {
				const serData: SeriesData = { label: '', value: 0 };
				serData.label = item.softwareVersion;
				serData.value = parseInt(item.deviceCount, 10);

				return serData;
			});
		this.productSeriesData = similarDevieDistribution.products.map(item => {
			const serData: SeriesData = { label: '', value: 0 };
			serData.label = item.productId;
			serData.value = parseInt(item.deviceCount, 10);

			return serData;
		});
		this.productFamilySeriesData = similarDevieDistribution.productFamilies.map(
			item => {
				const serData: SeriesData = { label: '', value: 0 };
				serData.label = item.productFamily;
				serData.value = parseInt(item.deviceCount, 10);

				return serData;
			});
	}
	/**
	 * similarDeviceparams
	 * @param filterValues customerId
	 * @returns deviceId
	 */
	public getSimilarDeviceParams (filterValues): FpIntelligenceService.GetSimilarDevicesParams {
		return _.merge(
			{
				deviceId: this.deviceId,
				customerId: this.customerId,
			},
			filterValues,
		);
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
