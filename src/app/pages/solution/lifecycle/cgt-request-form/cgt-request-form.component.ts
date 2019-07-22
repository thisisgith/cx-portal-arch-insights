import {
	Component,
	Output,
	EventEmitter,
	OnInit,
 } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
} from '@angular/forms';
import { LogService } from '@cisco-ngx/cui-services';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Placeholder customer info until API is used
 */
interface CustInfo {
	companyName: string;
	userName: string;
	jobTitle: string;
	email: string;
	phoneNumber: string;
	ciscoContact: string;
	ccoId: string;
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
 * Component for the CGT Request form
 */
@Component({
	selector: 'cgt-request-form',
	styleUrls: ['./cgt-request-form.component.scss'],
	templateUrl: './cgt-request-form.component.html',
})
export class CgtRequestFormComponent implements OnInit {

	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();
	public custData: CustInfo;
	public maxLength = 512;
	public loading = false;

	public requestForm: FormGroup = this.fb.group({
		contract: ['', Validators.required],
		technologyArea: ['', Validators.required],
		trainingGoal: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
		language: ['', Validators.required],
		meetingTime: ['', Validators.required],
		timeZone: ['', Validators.required],
	});

	public timeZoneOptions: SelectOption[] = [
		{ key: I18n.get('_PacificTime/US_'), value: I18n.get('_PacificTime/US_') },
		{ key: I18n.get('_EasternTime/US_'), value: I18n.get('_EasternTime/US_') },
	];

	public languageOptions: SelectOption[] = [
		{ key: I18n.get('_English_'), value: I18n.get('_English_') },
	];

	public contractOptions: SelectOption[] = [
		{ key: '123456789', value: '123456789' },
	];

	public technologyOptions: SelectOption[] = [
		{ key: I18n.get('_Security_'), value: I18n.get('_Security_') },
	];

	constructor (
		private logger: LogService,
		private fb: FormBuilder,
	) {
		this.logger.debug('CgtRequestFormComponent Created!');
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
			companyName: 'Company',
			userName: 'John Doe',
			jobTitle: 'Title',
			email: 'johnDoe@cisco.com',
			phoneNumber: '1-818-555-5555',
			ciscoContact: 'CSE Name',
			ccoId: '12345678',
			country: 'USA',
		};
	}

	/**
	 * Submit the completed ACC request form
	 */
	public onSubmit () {
		this.logger.debug('Submitted CGT response form');
		this.submitted.emit(true);
	}
}
