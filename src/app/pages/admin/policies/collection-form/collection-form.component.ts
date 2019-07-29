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
	selector: 'collection-form',
	styleUrls: ['./collection-form.component.scss'],
	templateUrl: './collection-form.component.html',
})
export class EditCollectionFormComponent implements OnDestroy, OnInit {

	@Input() public policyId: string;
	@Input() public customerId: string;
	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();

	private destroyed$: Subject<void> = new Subject<void>();
	public timePeriodMonthly = false;

	public loading = false;

	public requestForm: FormGroup = this.fb.group({
		days: ['', Validators.required],
		hourmins: ['', Validators.required],
		timePeriod: ['', Validators.required],
	});

	public timePeriods: SelectOption[] = [
		{ key: 'Monthly', value: 'monthly' },
		{ key: 'Daily', value: 'daily' },
	];

	public days = function () {
		const days: SelectOption[] = [];
		for (let day = 1; day < 32; day += 1) {
			let suffix = 'th';
			if (day % 10 === 1) { suffix = 'st'; }
			if (day % 10 === 2) { suffix = 'nd'; }
			if (day % 10 === 3) { suffix = 'rd'; }
			const text = `${day}${suffix}`;
			days.push({
				key: text, value: `${day}`,
			});
		}

		return days;
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
	}

	public timePeriodChange () {
		this.timePeriodMonthly = this.requestForm.get('timePeriod').value === 'monthly';
		console.log(this.requestForm.get('timePeriod').value === 'monthly')
	}

	public getSchedule (timePeriod: string, day: string, hourmin: string) {
		let schedule = `${hourmin}`;
		if (timePeriod === 'monthly') {
			schedule = `${schedule} ${day} * *`;
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
		const day = this.requestForm.get('days').value;

		const schedule = this.getSchedule(timePeriod, day, hourmin);

		const params: CollectionPolicyUpdateRequestModel = {
			schedule,
			customerId: this.customerId,
			policyId: this.policyId,
			policyName: 'test',
		};
		console.log(params);

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
