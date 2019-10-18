import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { IListdevice, CrashPreventionService, IProductFamily } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * FP-compare Component
 */
@Component({
	selector: 'app-fp-compare',
	templateUrl: './fp-compare.component.html',
})
export class FpCompareComponent implements OnChanges {
	public deviceId1 = '';
	public deviceId2 = '';
	public productId: string;
	public productFamily: string;
	public selectedProductFamily: any;
	public productFamilydetails: any;
	public deviceListDetails: any = [];
	public riskScore: number;
	public CpProductfamilyService: any;
	public CpListdeviceService: any;
	public productIds: any[];
	public listOfProductFamilies: any;
	public listdeviceData: any[];
	public listdeviceDataA: any[];
	public listdeviceDataB: any[];
	public assetBError = false;
	private destroy$ = new Subject();
	public customerId: string;
	public compareView: string;
	public listOfProductIds: any;
	public selectedproductId: any;
	public deviceA: any;
	public deviceB: any;

	@Input() public devices: any;
	@Output() public reqError: EventEmitter<any> = new EventEmitter<any>();

	public comparisonInfo = {
		customerId: this.customerId,
		deviceId1: ' ',
		deviceId2: ' ',
	};

	/**
	 * this will check all the compare parameters
	 * @returns a boolean
	 */
	public get compareDetailsExist (): boolean {
		if (this.selectedproductId
			&& this.deviceId1 && this.deviceId2) {

			return true;
		}

		return false;
	}

	constructor (
		private crashPreventionService: CrashPreventionService,
		private logger: LogService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.compareView = 'software';
		this.productIds = [];
		this.listdeviceData = [];
	}

	/**
	 * deviceId1
	 * @param changes simplechanges
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.devices.currentValue) {
			this.deviceId1 = _.get(changes, ['devices', 'currentValue', 'deviceId1']);
			this.selectedproductId = _.get(changes, ['devices', 'currentValue', 'productId1']);
			this.deviceId2 = _.get(changes, ['devices', 'currentValue', 'deviceId2']);
			this.productFamilydetails = {
				customerId: this.customerId,
			};
			/**
			 * API call for deviceList Information
			 */
			this.deviceListDetails = {
				customerId: this.customerId,
				productId: this.selectedproductId,
			};
			/**
			 * API call for productFamilies
			 */
			this.crashPreventionService
				.getProductFamily(this.productFamilydetails)
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IProductFamily) => {
					this.listOfProductFamilies = results.productFamilies;
					this.listOfProductFamilies.forEach(pfGroup => {
						pfGroup.productIds.forEach(pidGroup => {
							if (this.selectedproductId === pidGroup.productId) {
								this.selectedProductFamily = pfGroup.productFamily;
								this.listOfProductIds = pfGroup.productIds;
							}
						});
					});
				},
				err => {
					this.selectedProductFamily = null;
					this.selectedproductId = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});

			/**
			 * API call for Listdevice
			 */
			this.crashPreventionService
				.getListdevice(this.deviceListDetails)
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceData = results.deviceDetail;
					this.deviceA = this.listdeviceData
					.find(device => device.deviceId === this.deviceId1);
					this.deviceId1 = this.deviceA
						? this.deviceA.deviceId
						: this.deviceA;
				},
				err => {
					this.deviceId1 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
			this.crashPreventionService
				.getListdevice({
					customerId: this.customerId,
					productId: this.selectedproductId,
				})
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceData = results.deviceDetail;
					this.deviceB = this.listdeviceData
					.find(device => device.deviceId === this.deviceId2);
					this.deviceId2 = this.deviceB
						? this.deviceB.deviceId
						: this.deviceB;
				},
				err => {
					this.deviceId2 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
		}
	}

	/**
	 * productFamily
	 * @param selection listdevice
	 */
	public productFamilySelection (selection: any) {

		if (selection) {
			this.listOfProductIds = selection;
		} else {
			this.selectedProductFamily = null;
			this.selectedproductId = null;
			this.listOfProductIds = [];
		}
	}

	/**
	 * onSelection
	 * @param selection pids
	 */
	public pidsSelection (selection: any) {
		this.selectedproductId = selection;
		if (this.selectedproductId) {
			this.crashPreventionService
				.getListdevice({
					customerId: this.customerId,
					productId: selection,
				})
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceData = results.deviceDetail;
					this.deviceA = this.listdeviceData
					.find(device => device.deviceId === this.deviceId1);
					this.deviceId1 = this.deviceA
						? this.deviceA.deviceId
						: this.deviceA;
					this.deviceB = this.listdeviceData
						.find(device => device.deviceId === this.deviceId2);
					this.deviceId2 = this.deviceB
							? this.deviceB.deviceId
							: this.deviceB;
				},
				err => {
					this.deviceId1 = null;
					this.deviceId2 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
		} else {
			this.deviceId1 = null;
			this.deviceId2 = null;
			this.assetBError = true;
			this.listdeviceData = [];
		}
	}
	/**
	 * onSelection
	 * @param selection deviceId1
	 */
	public assetASelection (selection: any) {
		this.deviceId1 = selection;
		this.deviceA = this.listdeviceData.find(device => device.deviceId === this.deviceId1);
		this.logger.info(selection);
	}
	/**
	 * onSelection
	 * @param selection deviceId2
	 */
	public assetBSelection (selection: any) {
		this.deviceId2 = selection;
		if (this.deviceId2) {
			this.deviceB = this.listdeviceData.find(device => device.deviceId === this.deviceId2);
			this.assetBError = false;
			this.logger.info(selection);
		} else {
			this.assetBError = true;
		}
	}
	/**
	 * Destroys the component
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
	/**
	 * updateCompareView
	 * @param event tab click event
	 * @param selectedTab  compareview
	 */
	public updateCompareView (event, selectedTab) {
		if (selectedTab) {
			this.compareView = selectedTab;
			this.logger.info(event);
		}
	}

	/**
	 * On error event
	 * @param errorMsg Error Message
	 */
	public showError (errorMsg) {
		this.reqError.emit(errorMsg);
	}
}
