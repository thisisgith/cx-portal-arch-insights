import {
	Component,
	Output,
	EventEmitter,
	OnInit,
 } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	FormArray,
	Validators,
} from '@angular/forms';
import { LogService } from '@cisco-ngx/cui-services';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Placeholder customer info interface until API is defined
 */
interface CustInfo {
	companyName: string;
	userName: string;
	jobTitle: string;
	email: string;
	phoneNumber: string;
	ciscoContact: string;
	ccoID: string;
	country: string;
}

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
export class AccRequestFormComponent implements OnInit {

	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();
	public custData: CustInfo;
	public maxLength = 512;

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
	) {
		this.logger.debug('AccRequestFormComponent Created!');
	}

	/**
	 * Adds additional info form fields based on number of attendees
	 * @param attendees number of ACC attendees
	 */
	public addAdditionalAttendeeForms (attendees: number) {
		const attendeeArray = <FormArray> this.requestForm.get('additionalAttendees');

		if (attendees > 1) {
			const attendeeGroup = this.fb.group({
				name: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
			});

			attendeeArray.clear();
			for (let i = 1; i < attendees; i = i + 1) {
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
	 * Initialization of the ACC request form and customer info
	 */
	public ngOnInit () {
		this.custData = {
			ccoID: '12345678',
			ciscoContact: 'CSE Name',
			companyName: 'Company',
			country: 'USA',
			email: 'Breadf23@company.com',
			jobTitle: 'Title',
			phoneNumber: '1-818-555-5555',
			userName: 'User',
		};
	}

	/**
	 * Submit the completed ACC request form
	 */
	public onSubmit () {
		this.submitted.emit(true);
	}
}
