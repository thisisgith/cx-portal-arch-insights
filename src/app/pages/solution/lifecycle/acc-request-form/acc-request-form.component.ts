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
	FormArray,
	Validators,
} from '@angular/forms';
import { LogService } from '@cisco-ngx/cui-services';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	ACCUserInfoSchema,
	RacetrackContentService,
	ACCRequestSessionSchema,
} from '@sdp-api';
import { catchError, takeUntil, finalize } from 'rxjs/operators';
import { empty, Subject } from 'rxjs';
import { UserResolve } from '@utilities';

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
	selector: 'acc-request-form',
	styleUrls: ['./acc-request-form.component.scss'],
	templateUrl: './acc-request-form.component.html',
})
export class AccRequestFormComponent implements OnDestroy, OnInit, OnDestroy {

	@Input() public accId: string;
	@Input() public accTitle: string;
	@Input() public solution: string;
	@Input() public technology: string;
	@Input() public pitstop: string;
	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();

	private timeout = 5000;
	public customerId: string;
	private destroyed$: Subject<void> = new Subject<void>();
	public custData: ACCUserInfoSchema;
	public maxLength = 512;
	public loading = false;
	public status = {
		submitting: false,
		success: false,
		submitError: false,
		infoError: false,
	};

	public get invalidSubmit () {
		return !this.requestForm.valid || this.status.infoError ||
			this.status.submitting || this.status.success;
	}

	public requestForm: FormGroup = this.fb.group({
		acceleratorInterest: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
		additionalAttendees: this.fb.array([]),
		attendees: ['', Validators.required],
		desiredOutcome: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
		dnacVersion: ['', Validators.required],
		environment: ['', Validators.required],
		language: ['', Validators.required],
		meetingTime: ['', Validators.required],
		timeZone: ['', Validators.required],
	});

	public attendeeOptions: SelectOption[] = [
		{ key: '1', value: '1' },
		{ key: '2', value: '2' },
		{ key: '3', value: '3' },
		{ key: '4', value: '4' },
		{ key: '5', value: '5' },
	];

	public timeZoneOptions: SelectOption[] = [
		{ key: I18n.get('_PacificTime/US_'), value: I18n.get('_PacificTime/US_') },
		{ key: I18n.get('_EasternTime/US_'), value: I18n.get('_EasternTime/US_') },
	];

	public languageOptions: SelectOption[] = [
		{ key: I18n.get('_English_'), value: I18n.get('_English_') },
	];

	public dnacOptions: SelectOption[] = [
		{ key: '1.20', value: '1.20' },
	];

	constructor (
		private logger: LogService,
		private fb: FormBuilder,
		private contentService: RacetrackContentService,
		private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	/**
	 * Adds additional info form fields based on number of attendees
	 * @param attendees number of ACC attendees
	 */
	public addAdditionalAttendeeForms (attendees: number) {
		const attendeeArray = <FormArray> this.requestForm.get('additionalAttendees');

		if (attendees > 1) {
			attendeeArray.clear();
			for (let i = 1; i < attendees; i = i + 1) {
				const attendeeGroup = this.fb.group({
					attendeeEmail: ['', [Validators.required, Validators.email]],
					attendeeName: ['', Validators.required],
				});
				attendeeArray.push(attendeeGroup);
			}
		} else {
			attendeeArray.clear();
		}
	}

	/**
	 * Closes the ACC Request Form component
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
	 * Initialization of the ACC request form and customer info
	 */
	public ngOnInit () {
		this.loading = true;
		this.contentService.getACCUserInfo()
			.pipe(
				catchError(err =>  {
					this.status.infoError = true;
					this.logger.error('acc-request-form.component : getACCUserInfo() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return empty();
				}),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.custData = response;
			});
	}

	/**
	 * Submit the completed ACC request form
	 */
	public onSubmit () {
		this.status.submitting = true;
		const requestSessionParams: ACCRequestSessionSchema = {
			accTitle: this.accTitle,
			additionalAttendees: this.requestForm.get('additionalAttendees').value,
			businessOutcome: this.requestForm.get('desiredOutcome').value,
			ccoId: this.custData.ccoId,
			ciscoContact: this.custData.ciscoContact,
			companyName: this.custData.companyName,
			country: this.custData.country,
			customerId: this.customerId,
			dnacVersion: this.requestForm.get('dnacVersion').value,
			environment: this.requestForm.get('environment').value,
			jobTitle: this.custData.jobTitle,
			pitstop: this.pitstop,
			preferredLanguage: this.requestForm.get('language').value,
			preferredSlot: this.requestForm.get('meetingTime').value,
			reasonForInterest: this.requestForm.get('acceleratorInterest').value,
			solution: this.solution,
			timezone: this.requestForm.get('timeZone').value,
			usecase: this.technology,
			userEmail: this.custData.userEmail,
			userPhoneNumber: this.custData.userPhoneNumber,
		};

		const params: RacetrackContentService.RequestACCParams = {
			accId: this.accId,
			request: requestSessionParams,
		};

		this.contentService
		.requestACC(params)
			.pipe(
				catchError(() => {
					this.status.submitError = true;
					this.status.submitting = false;
					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.logger.debug('acc-request-form.component :: Submitted ACC response form');
				this.status.success = true;
				this.status.submitting = false;
				setTimeout(() => {
					this.submitted.emit(true);
				}, this.timeout);
			});
	}
}
