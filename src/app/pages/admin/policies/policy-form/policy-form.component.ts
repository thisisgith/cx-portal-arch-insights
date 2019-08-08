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
	ControlPointDeviceDiscoveryAPIService,
	ControlPointDevicePolicyAPIService,
	DeviceInfo,
	DevicePolicyRequestModel,
	DevicePolicyUpdateRequestModel,
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
	public error = false;
	public errorMessage: string;

	public getParams: Function;
	public submitCall: Function;

	public loading = false;

	public requestForm: FormGroup = this.fb.group({
		dates: [''],
		days: [''],
		hourmins: ['', Validators.required],
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
		private deviceService: ControlPointDeviceDiscoveryAPIService,
		private devicePolicyService: ControlPointDevicePolicyAPIService,
	) {
		this.logger.debug('AccRequestFormComponent Created!');
	}

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
			case 'editCollection': {
				this.editCollection();
				break;
			}
			case 'newPolicy': {
				this.newPolicy();
				break;
			}
			case 'editPolicy': {
				this.editPolicy();
				break;
			}
		}
	}

	/**
	 * Called from init given editCollection
	 */
	public editCollection () {
		this.title = I18n.get('_ScheduledCollectionDetails_');

		const date = new Date(_.get(this.policy, 'createdDate'));
		const formattedTime =
`${this.monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

		_.set(this.policy, 'createdDate', formattedTime);

		this.setSelectors();

		this.getParams = function (schedule: string) {
			return {
				schedule,
				customerId: this.customerId,
				policyId: _.get(this.policy, 'policyId'),
				policyName: 'test',
			};
		};

		this.submitCall = function (params: CollectionPolicyUpdateRequestModel) {
			return this.collectionService.updateCollectionPolicyUsingPATCH(params);
		};
	}

	/**
	 * Called from init given newPolicy
	 */
	public newPolicy () {
		this.title = I18n.get('_NewScheduledScan_');

		this.loading = true;

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
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListLeft = this.jsonCopy(_.get(response, 'data'));
			});

		this.getParams = function (schedule: string) {
			const devices = _.map(this.deviceListRight, item => {
				const copy = this.jsonCopy(item);
				delete copy.selected;

				return copy;
			});

			return {
				devices,
				schedule,
				customerId: this.customerId,
			};
		};

		this.submitCall = function (parameters: DevicePolicyRequestModel) {
			return this.devicePolicyService.createDevicePolicyUsingPOST(parameters);
		};
	}

	/**
	 * Called from init given editPolicy
	 */
	public editPolicy () {
		this.title = I18n.get('_ScheduledScanDetails_');

		this.loading = true;

		const params: ControlPointDevicePolicyAPIService
		.GetDevicesForPolicyCreationUsingGETParams = {
			customerId: this.customerId,
			pageNumber: '1',
			rowsPerPage: '9999',
		};

		this.setSelectors();

		this.devicePolicyService.getDevicesForPolicyCreationUsingGET1(params)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loading = false),
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
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.deviceListRight = this.jsonCopy(_.get(response, 'data'));
			});

		this.getParams = function (schedule: string) {
			const devices = _.map(this.deviceListRight, item => {
				const copy = this.jsonCopy(item);
				delete copy.selected;

				return copy;
			});

			return {
				devices,
				schedule,
				customerId: this.customerId,
				policyId: _.get(this.policy, 'policyId'),
			};
		};

		this.submitCall = function (parameters: DevicePolicyUpdateRequestModel) {
			return this.devicePolicyService.updateDevicePolicyUsingPATCH(parameters);
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
	 * Creates cron expression using quartz format
	 * @param timePeriod "monthly", "weekly" or "daily"
	 * @param day numbered day of the week "0-6"
	 * @param date date in a month "1-31"
	 * @param hourmin: hours and min at front of cron expression
	 *
	 * @returns cron expression string
	 */
	public getSchedule (timePeriod: string, day: string, date: string, hourmin: string) {
		let schedule = `${hourmin}`;
		if (timePeriod === 'monthly') {
			schedule = `${schedule} ${date} * ?`;
		} else if (timePeriod === 'weekly') {
			schedule = `${schedule} ? * ${day}`;
		} else {
			schedule = `${schedule} * * *`;
		}

		return schedule;
	}

	/**
	 * Submit the completed Collection Form
	 */
	public onSubmit () {
		const hourmin = this.requestForm.get('hourmins').value;
		const timePeriod = this.requestForm.get('timePeriod').value;
		const date = this.requestForm.get('dates').value;
		const day = this.requestForm.get('days').value;

		const schedule = this.getSchedule(timePeriod, day, date, hourmin);

		const params = this.getParams(schedule);

		this.submitCall(params)
			.pipe(
				catchError(() => empty()),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.logger.debug('Submitted Policy Form');
				this.submitted.emit(true);
			});
	}
}
