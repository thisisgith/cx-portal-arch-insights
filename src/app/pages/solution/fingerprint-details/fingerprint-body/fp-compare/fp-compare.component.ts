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
	public productId1: string;
	public productId2: string;
	public assetsAactive = true;
	public assetsBactive = true;
	public productFamilyA: any;
	public productFamilyB: any;
	public productFamilydetails: any;
	public deviceListDetails: any = [];
	public productData: any = [];
	public riskScore: number;
	public CpProductfamilyService: any;
	public CpListdeviceService: any;
	public listdeviceDataA: any[];
	public listdeviceDataB: any[];
	private destroy$ = new Subject();
	public customerId: string;
	public compareView: string;
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
		if (this.productId1 && this.productId2
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
		this.compareView = 'hardware';
		this.listdeviceDataA = [];
		this.listdeviceDataB = [];
	}

	/**
	 * deviceId1
	 * @param changes simplechanges
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.devices.currentValue) {
			this.deviceId1 = changes.devices.currentValue.deviceId1;
			this.productId1 = changes.devices.currentValue.productId1;
			this.deviceId2 = changes.devices.currentValue.deviceId2;
			this.productId2 = changes.devices.currentValue.productId2;
			this.assetsAactive = this.deviceId1 === '';
			this.assetsBactive = this.deviceId1 === '';
			this.productFamilydetails = {
				customerId: this.customerId,
			};
			/**
			 * API call for deviceList Information
			 */
			this.deviceListDetails = {
				customerId: this.customerId,
				deviceId: this.deviceId1,
				productId: this.productId1,
			};
			this.crashPreventionService
				.getProductFamily(this.productFamilydetails)
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IProductFamily) => {
					this.productData = results.productFamily;
				});
			/**
			 * API call for Listdevice
			 */
			this.crashPreventionService
				.getListdevice(this.deviceListDetails)
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceDataA = results.deviceDetail;
					const deviceFound = this.listdeviceDataA
					.find(device => device.deviceId === this.deviceId1);
					this.deviceId1 = deviceFound
						? deviceFound.deviceId
						: deviceFound;
				},
				err => {
					this.deviceId1 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
			this.crashPreventionService
				.getListdevice({
					customerId: this.customerId,
					productId: this.productId2,
				})
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceDataB = results.deviceDetail;
					const deviceFound = this.listdeviceDataB
					.find(device => device.deviceId === this.deviceId2);
					this.deviceId2 = deviceFound
						? deviceFound.deviceId
						: deviceFound;
				},
				err => {
					this.deviceId2 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
		}
	}

	/**
	 * productFamilyA
	 * @param selection listdevice
	 */
	public onSelection (selection: any) {
		this.productFamilyA = selection;
		if (this.productFamilyA) {
			/*Asset A is disabled  */
			this.assetsAactive = false;
			this.crashPreventionService
				.getListdevice({
					customerId: this.customerId,
					productId: selection,
				})
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceDataA = results.deviceDetail;
					const deviceFound = this.listdeviceDataA
					.find(device => device.deviceId === this.deviceId1);
					this.deviceId1 = deviceFound
						? deviceFound.deviceId
						: deviceFound;
				},
				err => {
					this.deviceId1 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
		} else {
			this.deviceId1 = null;
		}
	}
	/**
	 * productfamilyB
	 * @param selection listdevice
	 */
	public onSelection3 (selection: any) {
		this.productFamilyB = selection;
		if (this.productFamilyB) {
			/*Asset B is disabled  */
			this.assetsBactive = false;
			this.crashPreventionService
				.getListdevice({
					customerId: this.customerId,
					productId: selection,
				})
				.pipe(takeUntil(this.destroy$))
				.subscribe((results: IListdevice) => {
					this.listdeviceDataB = results.deviceDetail;
					const deviceFound = this.listdeviceDataB
					.find(device => device.deviceId === this.deviceId2);
					this.deviceId2 = deviceFound
						? deviceFound.deviceId
						: deviceFound;
				},
				err => {
					this.deviceId2 = null;
					this.logger.error(`:: Error : (${err.status}) ${err.message}`);
				});
		} else {
			this.deviceId2 = null;
		}
	}
	/**
	 * onSelection
	 * @param selection deviceId1
	 */
	public onSelection1 (selection: any) {
		this.deviceId1 = selection;
		this.logger.info(selection);
	}
	/**
	 * onSelection
	 * @param selection deviceId2
	 */
	public onSelection2 (selection: any) {
		this.deviceId2 = selection;
		this.logger.info(selection);
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
