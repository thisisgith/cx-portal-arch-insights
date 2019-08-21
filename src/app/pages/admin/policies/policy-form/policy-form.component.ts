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
interface DeviceListRow extends DeviceInfo {
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
 * Component for the ACC Request form
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
	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();

	private destroyed$: Subject<void> = new Subject<void>();
	public timePeriod = '';
	public title = '';
	public deviceListRight: DeviceListRow[] = [];
	public deviceListLeft: DeviceListRow[] = [];
	public allDevicesSelectedRight = false;
	public allDevicesSelectedLeft = false;
	public selectedRowsRight = { };
	public selectedRowsLeft = { };
	public loadingListLeft = false;
	public loadingListRight = false;
	public error = false;
	public errorMessage: string;

	public getParams: Function;
	public submitCall: Function;

	public loading = false;

	public requestForm: FormGroup = this.fb.group({
		dates: [''],
		days: [''],
		hourmins: [''],
		timePeriod: ['', Validators.required],
	});

	public monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];

	public dayNames = ['Sunday', 'Monday', 'Tuesday',
		'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	public timePeriods: SelectOptions = {
		options: [
			{ key: 'Monthly', value: 'monthly' },
			{ key: 'Weekly', value: 'weekly' },
			{ key: 'Daily', value: 'daily' },
			{ key: 'Never', value: 'never' },
		],
		selected: '',
	};

	public days: SelectOptions = {
		options: [
			{ key: 'Sunday', value: '0' },
			{ key: 'Monday', value: '1' },
			{ key: 'Tuesday', value: '2' },
			{ key: 'Wednesday', value: '3' },
			{ key: 'Thursday', value: '4' },
			{ key: 'Friday', value: '5' },
			{ key: 'Saturday', value: '6'  },
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
		const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		for (const amPm of amPms) {
			for (const hour of hours) {
				for (const minute of minutes) {
					let militaryHour = hour;
					if (amPm === 'pm') {
						militaryHour += 12;
					}
					times.push({
						key: `${hour}:${minute}${amPm}`,
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
		private collectionService: ControlPointModifyCollectionPolicyAPIService,
		private devicePolicyService: ControlPointDevicePolicyAPIService,
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
				this.newPolicy();
				break;
			}
			case ModalTypes.editPolicy: {
				this.setSelectors();

				this.editPolicy();
				break;
			}
			case ModalTypes.editIgnorePolicy: {
				this.editIgnorePolicy();
				break;
			}
		}
	}

	/**
	 * Called from init given editCollection
	 */
	public editCollection () {
		this.title = I18n.get('_ScheduledCollectionDetails_');

		const dateTime = new Date(_.get(this.policy, 'createdDate'));
		const formattedTime =
`${this.monthNames[dateTime.getMonth()]} ${dateTime.getDate()}, ${dateTime.getFullYear()}`;

		_.set(this.policy, 'createdDate', formattedTime);

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

		const params: ControlPointDevicePolicyAPIService
		.GetDevicesForPolicyCreationUsingGETParams = {
			customerId: this.customerId,
			pageNumber: '1',
			rowsPerPage: '9999',
		};

		this.devicePolicyService.getDevicesForPolicyCreationUsingGET1(params)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loadingListLeft = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListLeft = this.jsonCopy(_.get(response, 'data'));
			});

		this.submitCall = function () {
			const devices = _.map(this.deviceListRight, item => {
				const copy = this.jsonCopy(item);
				delete copy.selected;

				return copy;
			});

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

		const params: ControlPointDevicePolicyAPIService
		.GetDevicesForPolicyCreationUsingGETParams = {
			customerId: this.customerId,
			pageNumber: '1',
			rowsPerPage: '9999',
		};

		this.devicePolicyService.getDevicesForIgnorePolicyCreationUsingGET(params)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loadingListLeft = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListLeft = this.jsonCopy(_.get(response, 'data'));
			});

		this.submitCall = function () {
			const devices = _.map(this.deviceListRight, item => {
				const copy = this.jsonCopy(item);
				delete copy.selected;

				return copy;
			});

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

		const params: ControlPointDevicePolicyAPIService
		.GetDevicesForPolicyCreationUsingGETParams = {
			customerId: this.customerId,
			pageNumber: '1',
			rowsPerPage: '9999',
		};

		this.devicePolicyService.getDevicesForPolicyCreationUsingGET1(params)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loadingListLeft = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListLeft = this.jsonCopy(_.get(response, 'data'));
			});

		const currentPolicyParams: ControlPointDevicePolicyAPIService
			.GetDevicesForGivenPolicyUsingGETParams = {
				customerId: this.customerId,
				pageNumber: '1',
				policyId: _.get(this.policy, 'policyId'),
				rowsPerPage: '9999',
			};

		this.devicePolicyService.getDevicesForGivenPolicyUsingGET1(currentPolicyParams)
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
			});

		this.submitCall = function () {
			const devices = _.map(this.deviceListRight, item => {
				const copy = this.jsonCopy(item);
				delete copy.selected;

				return copy;
			});

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

		this.requestForm.setValue({
			dates: this.dates.selected,
			days: this.days.selected,
			hourmins: this.hourmins.selected,
			timePeriod: 'never',
		});

		const params: ControlPointDevicePolicyAPIService
		.GetEligibleDevicesForGivenIgnorePolicyUsingGETParams = {
			customerId: this.customerId,
			pageNumber: '1',
			policyId: _.get(this.policy, 'policyId'),
			rowsPerPage: '9999',
		};

		this.devicePolicyService.getEligibleDevicesForGivenIgnorePolicyUsingGET(params)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loadingListLeft = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListLeft = this.jsonCopy(_.get(response, 'data'));
			});

		const currentPolicyParams: ControlPointDevicePolicyAPIService
			.GetDevicesForGivenIgnorePolicyUsingGETParams = {
				customerId: this.customerId,
				pageNumber: '1',
				policyId: _.get(this.policy, 'policyId'),
				rowsPerPage: '9999',
			};

		this.devicePolicyService.getDevicesForGivenIgnorePolicyUsingGET(currentPolicyParams)
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
			});

		this.submitCall = function () {
			const devices = _.map(this.deviceListRight, item => {
				const copy = this.jsonCopy(item);
				delete copy.selected;

				return copy;
			});

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
		} else if (this.timePeriod !== 'never' && this.type === ModalTypes.newIgnorePolicy) {
			this.newPolicy();
		}

		// toggle between editIgnorePolicy and editPolicy when never is changed
		if (this.timePeriod === 'never' && this.type === ModalTypes.editPolicy) {
			this.editIgnorePolicy();
		} else if (this.timePeriod !== 'never' && this.type === ModalTypes.editIgnorePolicy) {
			this.editPolicy();
		}

		if (this.timePeriod === 'never') {
			this.requestForm.get('dates')
				.clearValidators();
			this.requestForm.get('days')
				.clearValidators();
			this.requestForm.get('hourmins')
				.clearValidators();

		} else if (this.timePeriod === 'monthly') {
			this.requestForm.get('dates')
				.setValidators(Validators.required);
			this.requestForm.get('days')
				.clearValidators();
			this.requestForm.get('hourmins')
				.setValidators(Validators.required);

		} else if (this.timePeriod === 'weekly') {
			this.requestForm.get('dates')
				.clearValidators();
			this.requestForm.get('days')
				.setValidators(Validators.required);
			this.requestForm.get('hourmins')
				.setValidators(Validators.required);

		} else if (this.timePeriod === 'daily') {
			this.requestForm.get('dates')
				.clearValidators();
			this.requestForm.get('days')
				.clearValidators();
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
	 * Toggles is device row is selected
	 * @param device device row
	 */
	public toggleDeviceSelected (device: DeviceListRow) {
		device.selected = !device.selected;
	}

	/**
	 * Toggles is device row is selected
	 * @param allDevicesSelected checkbox event
	 * @param devices device row
	 *
	 * @returns if device header is selected or not
	 */
	public toggleAllDevicesSelected (allDevicesSelected: boolean, devices: DeviceListRow[]) {
		const checked = !allDevicesSelected;

		for (let devNum = 0; devNum < devices.length; devNum += 1) {
			devices[devNum].selected = checked;
		}

		return checked;
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

		const milHour = amPm === 'pm' ? hour + 12 : hour;

		if (!date && !dayOfWeek) {
			this.timePeriods.selected = 'daily';

		} else if (date) {
			this.timePeriods.selected = 'monthly';

			this.dates.selected = date;
		} else {
			this.timePeriods.selected = 'weekly';

			const dayOfWeekNum = this.days.options.findIndex(element =>
				element.key.toLowerCase() === dayOfWeek.toLowerCase());

			this.days.selected = String(dayOfWeekNum);
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
	 * Creates 6 field cron expression
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
				schedule = `0 ${hourmin} ${date} * *`;
				break;
			}
			case 'weekly' : {
				schedule = `0 ${hourmin} * * ${day}`;
				break;
			}
			case 'daily' : {
				schedule = `0 ${hourmin} * * *`;
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
}
