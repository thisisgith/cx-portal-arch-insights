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
} from '@sdp-api';
import { catchError, takeUntil } from 'rxjs/operators';
import { empty, Subject } from 'rxjs';

import * as _ from 'lodash-es';

/**
 * interface representing the key/value of a select input option
 */
interface SelectOption {
	key: string;
	value: string;
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

	@Input() public policy: string;
	@Input() public type: string;
	@Input() public customerId: string;
	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();

	private destroyed$: Subject<void> = new Subject<void>();
	public timePeriod = '';
	public title = '';

	public loading = false;

	public requestForm: FormGroup = this.fb.group({
		dates: [''],
		days: [''],
		hourmins: ['', Validators.required],
		timePeriod: ['', Validators.required],
	});

	public timePeriods: SelectOption[] = [
		{ key: 'Monthly', value: 'monthly' },
		{ key: 'Weekly', value: 'weekly' },
		{ key: 'Daily', value: 'daily' },
	];

	public days = [
		{ key: 'Sunday', value: '0' },
		{ key: 'Monday', value: '1' },
		{ key: 'Tuesday', value: '2' },
		{ key: 'Wednesday', value: '3' },
		{ key: 'Thursday', value: '4' },
		{ key: 'Friday', value: '5' },
		{ key: 'Saturday', value: '6' },
	];

	public dates = function () {
		const dates: SelectOption[] = [];
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

		return dates;
	}();

	public hourmins = function () {
		const times: SelectOption[] = [];
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
						value: `${minute} ${militaryHour}`,
					});
				}
			}
		}

		return times;
	}();

	constructor (
		private logger: LogService,
		private fb: FormBuilder,
		private collectionService: ControlPointModifyCollectionPolicyAPIService,
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
		this.loading = false;
		console.log(this.type)
		switch (this.type) {
			case 'editCollection': {
				this.title = I18n.get('_ScheduledCollectionDetails_');
				break;
			}
			case 'newPolicy': {
				this.title = I18n.get('_NewScheduledScan_');
				break;
			}
			case 'editPolicy': {
				this.title = I18n.get('_ScheduledScanDetails_');
				break;
			}
		}
	}

	/**
	 * Called when time period is changed
	 */
	public timePeriodChange () {
		this.timePeriod = this.requestForm.get('timePeriod').value;
	}

	/**
	 * Creates cron expression
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
			schedule = `${schedule} ${date} * *`;
		} else if (timePeriod === 'weekly') {
			schedule = `${schedule} * * ${day}`;
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

		const params: CollectionPolicyUpdateRequestModel = {
			schedule,
			customerId: this.customerId,
			policyId: _.get(this.policy, 'policyID'),
			policyName: 'test',
		};

		this.collectionService
		.updateCollectionPolicyUsingPATCH(params)
			.pipe(
				catchError(() => empty()),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.logger.debug('Submitted Update Collection Policy Form');
				this.submitted.emit(true);
			});
	}
}
