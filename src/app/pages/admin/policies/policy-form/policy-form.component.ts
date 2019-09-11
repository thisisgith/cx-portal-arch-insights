import {
	Component,
	Output,
	EventEmitter,
	OnInit,
	OnDestroy,
	Input,
 } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
} from '@angular/forms';
import { LogService } from '@cisco-ngx/cui-services';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	CollectionPolicyUpdateRequestModel,
	ControlPointModifyCollectionPolicyAPIService,
	ControlPointDevicePolicyAPIService,
	DeviceInfo,
	DevicePolicyRequestModel,
	DevicePolicyUpdateRequestModel,
	IgnorePolicyUpdateRequestModel,
	IgnorePolicyRequestModel,
	DeviceDetailsByPage,
} from '@sdp-api';
import { catchError, takeUntil, finalize } from 'rxjs/operators';
import { empty, Subject } from 'rxjs';

import * as _ from 'lodash-es';

/**
 * interface representing the key/value of a select input option
 */
interface SelectOptions {
	selected: string;
	options: {
		key: string;
		value: string;
	}[];
}

/**
 * interface that represents row in device list tables
 */
export interface DeviceListRow extends DeviceInfo {
	selected: boolean;
}

/**
 * stores possible types for modal
 */
enum ModalTypes {
	editCollection = 'editCollection',
	editPolicy = 'editPolicy',
	editIgnorePolicy = 'editIgnorePolicy',
	newPolicy = 'newPolicy',
	newIgnorePolicy = 'newIgnorePolicy',
}

/**
 * Component for the Policy form
 */
@Component({
	selector: 'policy-form',
	styleUrls: ['./policy-form.component.scss'],
	templateUrl: './policy-form.component.html',
})
export class PolicyFormComponent implements OnDestroy, OnInit {

	@Input() public policy: { };
	@Input() public type: string;
	@Input() public customerId: string;
	@Input() public ignorePolicyExists: boolean;
	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();

	public leftDevices = 'left';
	public rightDevices = 'right';

	private destroyed$: Subject<void> = new Subject<void>();
	public timePeriod = '';
	public title = '';
	public deviceListRight: DeviceListRow[] = [];
	public deviceListLeft: DeviceListRow[] = [];
	public paginationData = { };
	public pageNumber = 1;
	public totalRows = undefined;
	public rowsPerPage = 10;
	public allDevicesSelectedRight = false;
	public allDevicesSelectedLeft = false;
	public selectedRowsRight = { };
	public selectedRowsLeft = { };
	public selectedRowsLeftCount = 0;
	public selectedRowsRightCount = 0;
	public loadingListLeft = false;
	public loadingListRight = false;
	public error = false;
	public errorMessage: string;

	public submitCall: Function;
	public leftListCall: Function;
	public rightListCall: Function;

	public loading = false;

	public requestForm: FormGroup = this.fb.group({
		dates: [''],
		days: [''],
		hourmins: [''],
		timePeriod: ['', Validators.required],
	});

	public timePeriods: SelectOptions = {
		options: [
			{ key: I18n.get('_Monthly_'), value: 'monthly' },
			{ key: I18n.get('_Weekly_'), value: 'weekly' },
			{ key: I18n.get('_Daily_'), value: 'daily' },
			{ key: I18n.get('_Never_'), value: 'never' },
		],
		selected: '',
	};

	public days: SelectOptions = {
		options: [
			{ key: I18n.get('_Sunday_'), value: 'SUN' },
			{ key: I18n.get('_Monday_'), value: 'MON' },
			{ key: I18n.get('_Tuesday_'), value: 'TUE' },
			{ key: I18n.get('_Wednesday_'), value: 'WED' },
			{ key: I18n.get('_Thursday_'), value: 'THU' },
			{ key: I18n.get('_Friday_'), value: 'FRI' },
			{ key: I18n.get('_Saturday_'), value: 'SAT'  },
		],
		selected: '',
	};

	public dates = function () {
		const dates = [];
		for (let date = 1; date < 32; date += 1) {
			let suffix = 'th';
			if (date % 10 === 1) { suffix = 'st'; }
			if (date % 10 === 2) { suffix = 'nd'; }
			if (date % 10 === 3) { suffix = 'rd'; }

			// All dates in teens end in th
			if (date > 10 && date < 20) {
				suffix = 'th';
			}

			const text = `${date}${suffix}`;
			dates.push({
				key: text, value: `${date}`,
			});
		}

		return {
			options: dates,
			selected: '',
		};
	}();

	public hourmins = function () {
		const times = [];
		const amPms = ['am', 'pm'];
		const minutes = ['00', '30'];
		const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		for (const amPm of amPms) {
			for (const hour of hours) {
				for (const minute of minutes) {
					let militaryHour = hour;
					if (amPm === 'pm') {
						militaryHour += 12;
					}
					times.push({
						// 00 in military time is 12 civilian
						key: `${hour === 0 ? 12 : hour}:${minute}${amPm}`,
						value: `${Number(minute)} ${Number(militaryHour)}`,
					});
				}
			}
		}

		return {
			options: times,
			selected: '',
		};
	}();

	constructor (
		private logger: LogService,
		private fb: FormBuilder,
		public collectionService: ControlPointModifyCollectionPolicyAPIService,
		public devicePolicyService: ControlPointDevicePolicyAPIService,
	) { }

	/**
	 * Closes the Collection Form component
	 */
	public closeRequestForm () {
		this.visibleComponent.emit(false);
	}

	/**
	 * ngOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Initialization of the Collection Form  and customer info
	 */
	public ngOnInit () {
		switch (this.type) {
			case ModalTypes.editCollection: {
				this.timePeriods.options.pop();
				this.setSelectors();

				this.editCollection();
				break;
			}
			case ModalTypes.newPolicy: {
				if (this.ignorePolicyExists) {
					this.timePeriods.options.pop();
				}

				this.newPolicy();
				break;
			}
			case ModalTypes.editPolicy: {
				if (this.ignorePolicyExists) {
					this.timePeriods.options.pop();
				}

				this.setSelectors();

				this.editPolicy();
				break;
			}
			case ModalTypes.editIgnorePolicy: {
				this.editIgnorePolicy();
				break;
			}
		}
		this.runListCalls();
	}

	/**
	 * Called from init given editCollection
	 */
	public editCollection () {
		this.title = I18n.get('_ScheduledCollectionDetails_');

		this.leftListCall = undefined;
		this.rightListCall = undefined;

		this.leftListCall = undefined;
		this.rightListCall = undefined;

		this.submitCall = function () {
			const hourmin = this.requestForm.get('hourmins').value;
			const timePeriod = this.requestForm.get('timePeriod').value;
			const date = this.requestForm.get('dates').value;
			const day = this.requestForm.get('days').value;

			const params: CollectionPolicyUpdateRequestModel = {
				customerId: this.customerId,
				policyId: _.get(this.policy, 'policyId'),
				policyName: 'placeholder',
				schedule: this.getSchedule(timePeriod, day, date, hourmin),
			};

			return this.collectionService.updateCollectionPolicyUsingPATCH(params);
		};
	}

	/**
	 * Called from init given newPolicy
	 */
	public newPolicy () {
		this.type = ModalTypes.newPolicy;
		this.title = I18n.get('_NewScheduledScan_');

		this.loadingListLeft = true;
		this.loadingListRight = false;

		this.leftListCall = function () {
			const params: ControlPointDevicePolicyAPIService
			.GetDevicesForPolicyCreationUsingGETParams = {
				customerId: this.customerId,
				pageNumber: String(this.pageNumber),
				rowsPerPage: String(this.rowsPerPage),
			};

			return this.devicePolicyService.getDevicesForPolicyCreationUsingGET1(params);
		};

		this.rightListCall = undefined;

		this.submitCall = function () {
			const devices = this.getDeviceListNoSelect();

			const hourmin = this.requestForm.get('hourmins').value;
			const timePeriod = this.requestForm.get('timePeriod').value;
			const date = this.requestForm.get('dates').value;
			const day = this.requestForm.get('days').value;

			const parameters: DevicePolicyRequestModel = {
				devices,
				customerId: this.customerId,
				schedule: this.getSchedule(timePeriod, day, date, hourmin),
			};

			return this.devicePolicyService.createDevicePolicyUsingPOST(parameters);
		};
	}

	/**
	 * Called from init given newIgnorePolicy
	 */
	public newIgnorePolicy () {
		this.type = ModalTypes.newIgnorePolicy;
		this.title = I18n.get('_NewScheduledScan_');

		this.loadingListLeft = true;
		this.loadingListRight = false;

		this.leftListCall = function () {
			const params: ControlPointDevicePolicyAPIService
			.GetDevicesForPolicyCreationUsingGETParams = {
				customerId: this.customerId,
				pageNumber: String(this.pageNumber),
				rowsPerPage: String(this.rowsPerPage),
			};

			return this.devicePolicyService.getDevicesForIgnorePolicyCreationUsingGET(params);
		};

		this.rightListCall = undefined;

		this.submitCall = function () {
			const devices = this.getDeviceListNoSelect();

			const parameters: IgnorePolicyRequestModel = {
				devices,
				customerId: this.customerId,
			};

			return this.devicePolicyService.createIgnoreScanPolicyUsingPOST(parameters);
		};
	}

	/**
	 * Called from init given editPolicy
	 */
	public editPolicy () {
		this.type = ModalTypes.editPolicy;
		this.title = I18n.get('_ScheduledScanDetails_');

		this.loadingListLeft = true;
		this.loadingListRight = true;

		this.leftListCall = function () {
			const params: ControlPointDevicePolicyAPIService
			.GetDevicesForPolicyCreationUsingGETParams = {
				customerId: this.customerId,
				pageNumber: String(this.pageNumber),
				rowsPerPage: String(this.rowsPerPage),
			};

			return this.devicePolicyService.getDevicesForPolicyCreationUsingGET1(params);
		};

		this.rightListCall = function () {
			const params: ControlPointDevicePolicyAPIService
			.GetDevicesForGivenPolicyUsingGETParams = {
				customerId: this.customerId,
				pageNumber: '1',
				policyId: _.get(this.policy, 'policyId'),
				rowsPerPage: '9999',
			};

			return this.devicePolicyService.getDevicesForGivenPolicyUsingGET1(params);
		};

		this.submitCall = function () {
			const devices = this.getDeviceListNoSelect();

			const hourmin = this.requestForm.get('hourmins').value;
			const timePeriod = this.requestForm.get('timePeriod').value;
			const date = this.requestForm.get('dates').value;
			const day = this.requestForm.get('days').value;

			const parameters: DevicePolicyUpdateRequestModel = {
				devices,
				customerId: this.customerId,
				policyId: _.get(this.policy, 'policyId'),
				schedule: this.getSchedule(timePeriod, day, date, hourmin),
			};

			return this.devicePolicyService.updateDevicePolicyUsingPATCH(parameters);
		};
	}

	/**
	 * Called from init given editIgnorePolicy
	 */
	public editIgnorePolicy () {
		this.type = ModalTypes.editIgnorePolicy;
		this.title = I18n.get('_ScheduledScanDetails_');

		this.loadingListLeft = true;
		this.loadingListRight = true;

		this.timePeriods.selected = 'never';
		this.timePeriod = this.timePeriods.selected;

		this.requestForm.get('timePeriod')
			.setValue('never');

		this.leftListCall = function () {
			const params: ControlPointDevicePolicyAPIService
			.GetEligibleDevicesForGivenIgnorePolicyUsingGETParams = {
				customerId: this.customerId,
				pageNumber: String(this.pageNumber),
				policyId: _.get(this.policy, 'policyId'),
				rowsPerPage: String(this.rowsPerPage),
			};

			return this.devicePolicyService.getEligibleDevicesForGivenIgnorePolicyUsingGET(params);
		};

		this.rightListCall = function () {
			const params: ControlPointDevicePolicyAPIService
			.GetDevicesForGivenIgnorePolicyUsingGETParams = {
				customerId: this.customerId,
				pageNumber: '1',
				policyId: _.get(this.policy, 'policyId'),
				rowsPerPage: '9999',
			};

			return this.devicePolicyService.getDevicesForGivenIgnorePolicyUsingGET(params);
		};

		this.submitCall = function () {
			const devices = this.getDeviceListNoSelect();

			const parameters: IgnorePolicyUpdateRequestModel = {
				devices,
				customerId: this.customerId,
				policyId: _.get(this.policy, 'policyId'),
			};

			return this.devicePolicyService.updateIgnoreScanPolicyUsingPATCH(parameters);
		};
	}

	/**
	 * Deletes policy
	 */
	public deletePolicy () {
		const params = {
			customerId: this.customerId,
			policyId: _.get(this.policy, 'policyId'),
		};

		this.devicePolicyService.deletePolicyUsingDELETE(params)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.logger.debug('Deleted Policy');
				this.submitted.emit(true);
			});
	}

	/**
	 * Called when time period is changed
	 */
	public timePeriodChange () {
		this.timePeriod = this.requestForm.get('timePeriod').value;

		// toggle between newIgnorePolicy and newPolicy when never is changed
		if (this.timePeriod === 'never' && this.type === ModalTypes.newPolicy) {
			this.newIgnorePolicy();
			this.runListCalls();
		} else if (this.timePeriod !== 'never' && this.type === ModalTypes.newIgnorePolicy) {
			this.newPolicy();
			this.runListCalls();
		}

		// toggle between editIgnorePolicy and editPolicy when never is changed
		if (this.timePeriod === 'never' && this.type === ModalTypes.editPolicy) {
			this.editIgnorePolicy();
			this.runListCalls();
		} else if (this.timePeriod !== 'never' && this.type === ModalTypes.editIgnorePolicy) {
			this.editPolicy();
			this.runListCalls();
		}

		this.requestForm.get('dates')
			.clearValidators();
		this.requestForm.get('days')
			.clearValidators();
		this.requestForm.get('hourmins')
			.clearValidators();

		if (this.timePeriod === 'monthly') {
			this.requestForm.get('dates')
				.setValidators(Validators.required);
			this.requestForm.get('hourmins')
				.setValidators(Validators.required);

		} else if (this.timePeriod === 'weekly') {
			this.requestForm.get('days')
				.setValidators(Validators.required);
			this.requestForm.get('hourmins')
				.setValidators(Validators.required);

		} else if (this.timePeriod === 'daily') {
			this.requestForm.get('hourmins')
				.setValidators(Validators.required);

		}

		this.requestForm.get('days')
			.updateValueAndValidity();
		this.requestForm.get('dates')
			.updateValueAndValidity();
		this.requestForm.get('hourmins')
			.updateValueAndValidity();
	}

	/**
	 * Toggles whether or not all devices are selected
	 * @param devices device row
	 * @param selectorName The designated name of the device selector
	 * firing this function off
	 */
	public toggleAllDevicesSelected (
		devices: DeviceListRow[],
		selectorName: string) {

		if (devices.length === 0) {
			return;
		}

		let selected = false;

		if (selectorName === this.leftDevices) {
			this.allDevicesSelectedLeft = !this.allDevicesSelectedLeft;
			selected = this.allDevicesSelectedLeft;
		} else if (selectorName === this.rightDevices) {
			this.allDevicesSelectedRight = !this.allDevicesSelectedRight;
			selected = this.allDevicesSelectedRight;
		}

		for (let devNum = 0; devNum < devices.length; devNum += 1) {
			devices[devNum].selected = selected;
		}

		this.handleDeviceSelectionChanged(selectorName);
	}

	/**
	 * Copies object using json stringify and json parse
	 * @param obj dict object
	 * @returns copied object
	 */
	private jsonCopy (obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

	/**
	 * Code for add button
	 * Moves selected list items from left list to right list
	 */
	public add () {
		for (let devNum = this.deviceListLeft.length - 1; devNum >= 0; devNum -= 1) {
			if (this.deviceListLeft[devNum].selected) {
				const deviceCopy = this.jsonCopy(this.deviceListLeft[devNum]);
				deviceCopy.selected = false;

				this.deviceListRight.push(deviceCopy);
				this.deviceListLeft.splice(devNum, 1);
			}
		}

		if (this.deviceListLeft.length === 0) {
			this.allDevicesSelectedLeft = false;
		}

		this.handleLeftDeviceSelectionChanged();
	}

	/**
	 * Code for remove button
	 * Moves selected list items from right list to left list
	 */
	public remove () {
		for (let devNum = this.deviceListRight.length - 1; devNum >= 0; devNum -= 1) {
			if (this.deviceListRight[devNum].selected) {
				const deviceCopy = this.jsonCopy(this.deviceListRight[devNum]);
				deviceCopy.selected = false;

				this.deviceListLeft.push(deviceCopy);
				this.deviceListRight.splice(devNum, 1);
			}
		}

		if (this.deviceListRight.length === 0) {
			this.allDevicesSelectedRight = false;
		}

		this.handleRightDeviceSelectionChanged();
	}

	/**
	 * returns device list w/o the select attribute
	 * @returns DeviceInfo[]
	 */
	public getDeviceListNoSelect () {
		return  _.map(this.deviceListRight, item => {
			const copy = this.jsonCopy(item);
			delete copy.selected;

			return copy;
		});
	}

	/**
	 * Autopopulates selectors for time when editing a policy
	 */
	public setSelectors () {
		const re = /((\d\d)\:(\d\d)) (am|pm)\,* (on day (\d+)|only on (\w+)){0,1}/g;

		const matches = re.exec(_.get(this.policy, 'formattedSchedule'));

		const min = Number(matches[3]);
		const hour = Number(matches[2]);
		const amPm = matches[4];
		const date = matches[6];
		const dayOfWeek = matches[7];

		let milHour = amPm === 'pm' ? hour + 12 : hour;

		// handle special case with 12 hours
		milHour = (amPm === 'am' && hour === 12) ? 0 : milHour;
		milHour = (amPm === 'pm' && hour === 12) ? 12 : milHour;

		if (!date && !dayOfWeek) {
			this.timePeriods.selected = 'daily';

		} else if (date) {
			this.timePeriods.selected = 'monthly';

			this.dates.selected = date;
		} else {
			this.timePeriods.selected = 'weekly';

			const dayOfWeekNum = this.days.options.findIndex(element =>
				element.key.toLowerCase() === dayOfWeek.toLowerCase());

			this.days.selected = _.get(this, ['days', 'options', dayOfWeekNum, 'value']);
		}

		this.hourmins.selected = `${min} ${milHour}`;

		this.timePeriod = this.timePeriods.selected;
		this.requestForm.setValue({
			dates: this.dates.selected,
			days: this.days.selected,
			hourmins: this.hourmins.selected,
			timePeriod: this.timePeriod,
		});
	}

	/**
	 * Creates 6 field quartz cron expression
	 * @param timePeriod "monthly", "weekly" or "daily"
	 * @param day numbered day of the week "0-6"
	 * @param date date in a month "1-31"
	 * @param hourmin: hours and min at front of cron expression
	 *
	 * @returns cron expression string or false
	 */
	public getSchedule (timePeriod: string, day: string, date: string, hourmin: string) {
		let schedule: String = '';
		switch (timePeriod) {
			case 'monthly' : {
				schedule = `0 ${hourmin} ${date} * ?`;
				break;
			}
			case 'weekly' : {
				schedule = `0 ${hourmin} ? * ${day}`;
				break;
			}
			case 'daily' : {
				schedule = `0 ${hourmin} ? * *`;
				break;
			}
		}

		return schedule ? schedule : false;
	}

	/**
	 * Submit the completed Collection Form
	 */
	public onSubmit () {
		this.submitCall()
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.logger.debug('Submitted Policy Form');
				this.submitted.emit(true);
			});
	}

	/**
	 * Calls for both lists
	 */
	public runListCalls () {
		this.onLeftListCall();
		this.onRightListCall();
	}

	/**
	 * Calls api for getting left list data
	 */
	public onLeftListCall () {
		if (!this.leftListCall) { return; }
		this.loadingListLeft = true;

		this.leftListCall()
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loadingListLeft = false),
				takeUntil(this.destroyed$),
			)
			.subscribe((response: DeviceDetailsByPage) => {
				this.totalRows = _.get(response, ['pagination', 'totalRows']);

				this.deviceListLeft = this.jsonCopy(_.get(response, 'data'));

				const rightHwIds = _.map(this.deviceListRight, item =>
					_.get(item, 'hwId'));

				for (let index = this.deviceListLeft.length - 1; index >= 0; index -= 1) {
					const leftHwIds = _.get(this.deviceListLeft[index], 'hwId');

					if (rightHwIds.includes(leftHwIds)) {
						this.logger.debug(`already have hwId ${leftHwIds}`);
						this.deviceListLeft.splice(index, 1);
					}

				}

				this.handleLeftDeviceSelectionChanged();
			});
	}

	/**
	 * Calls api for getting right list data
	 */
	public onRightListCall () {
		if (!this.rightListCall) { return; }
		this.loadingListRight = true;

		this.rightListCall()
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loadingListRight = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListRight = this.jsonCopy(_.get(response, 'data'));
				this.handleRightDeviceSelectionChanged();
			});
	}

	/**
	 * Called when page is changed in paginator
	 * @param pageInfo: used to get info from paginator
	 */
	public onPageChanged (pageInfo: any) {
		this.pageNumber = (pageInfo.page + 1);

		this.onLeftListCall();
	}

	/**
	 * Handles when a device list selection change has been detected.
	 * Delegates to the correct function based on a selection made on the
	 * left or the right.
	 * @param selectorName The designated name of the device selector firing
	 * the event
	 */
	public handleDeviceSelectionChanged (selectorName: string) {
		switch (selectorName) {
			case this.leftDevices:
				this.handleLeftDeviceSelectionChanged();
				break;
			case this.rightDevices:
				this.handleRightDeviceSelectionChanged();
				break;
		}
	}

	/**
	 * Handles all left device selection changes
	 */
	public handleLeftDeviceSelectionChanged () {
		this.selectedRowsLeftCount = _.filter(this.deviceListLeft, ['selected', true]).length;
	}

	/**
	 * Handles all right device selection changes
	 */
	public handleRightDeviceSelectionChanged () {
		this.selectedRowsRightCount = _.filter(this.deviceListRight, ['selected', true]).length;
	}
}
