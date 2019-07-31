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
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	ACCUserInfoSchema,
	RacetrackContentService,
	GroupTrainingRequestSchema,
	ContractsService,
	DeviceContractResponse,
} from '@sdp-api';
import { catchError, takeUntil, finalize } from 'rxjs/operators';
import { empty, Subject, of } from 'rxjs';

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
export class CgtRequestFormComponent implements OnDestroy, OnInit {

	@Input() public solution: string;
	@Input() public pitstop: string;
	@Input() public technology: string;
	@Output() public visibleComponent = new EventEmitter<boolean>();
	@Output() public submitted = new EventEmitter<boolean>();

	public customerId = '2431199';
	public contracts = [];
	private destroyed$: Subject<void> = new Subject<void>();
	public custData: ACCUserInfoSchema;
	public contractDetails: DeviceContractResponse;
	public contractOptions: SelectOption[];
	public maxLength = 512;
	public loading = false;
	public formSubmissionSucceeded = false;
	public formSubmissionFailed = false;

	public requestForm: FormGroup = this.fb.group({
		contract: ['', Validators.required],
		technologyArea: ['', Validators.required],
		trainingGoal: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
		language: ['', Validators.required],
		meetingTime: ['', Validators.required],
		timeZone: ['', Validators.required],
	});

	public timeZoneOptions: SelectOption[] = [
		{ key: I18n.get('_EasternTime/US_'), value: I18n.get('_EasternTime/US_') },
		{ key: I18n.get('_PacificTime/US_'), value: I18n.get('_PacificTime/US_') },
	];

	public languageOptions: SelectOption[] = [
		{ key: I18n.get('_English_'), value: I18n.get('_English_') },
	];

	public technologyOptions: SelectOption[] = [
		{ key: I18n.get('_Cloud_'), value: I18n.get('_Cloud_') },
		{ key: I18n.get('_Collaboration_'), value: I18n.get('_Collaboration_') },
		{ key: I18n.get('_DataCenter_'), value: I18n.get('_DataCenter_') },
		{ key: I18n.get('_IntentBasedNetworking_'), value: I18n.get('_IntentBasedNetworking_') },
		{ key: I18n.get('_NetworkManagement_'), value: I18n.get('_NetworkManagement_') },
		{ key: I18n.get('_NetworkProgrammability_'), value: I18n.get('_NetworkProgrammability_') },
		{ key: I18n.get('_OpticalNetworking_'), value: I18n.get('_OpticalNetworking_') },
		{ key: I18n.get('_RoutingAndSwitching_'), value: I18n.get('_RoutingAndSwitching_') },
		{ key: I18n.get('_Security_'), value: I18n.get('_Security_') },
		{ key: I18n.get('_ServiceProviderMobility_'), value: I18n.get('_ServiceProviderMobility_') },
		{ key: I18n.get('_ServiceProviderVideo_'), value: I18n.get('_ServiceProviderVideo_') },
		{ key: I18n.get('_SoftwareDefinedNetworking_'), value: I18n.get('_SoftwareDefinedNetworking_') },
		{ key: I18n.get('_Other_'), value: I18n.get('_Other_') },
	];

	constructor (
		private logger: LogService,
		private fb: FormBuilder,
		private contentService: RacetrackContentService,
		private contractsService: ContractsService,
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
				catchError(() => empty()),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.custData = response;
			});
		this.contractsService
		.getContractDetails({ customerId: this.customerId })
			.pipe(
				catchError(() => empty()),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.contractDetails = response;
				_.each(_.get(this.contractDetails, 'data'), contract => {
					this.contracts = _.union(this.contracts, [{ key: _.get(contract, 'contractNumber'), value: _.get(contract, 'contractNumber') }]);
				});
				this.contractOptions = this.contracts;
			});
	}

	/**
	 * Submit the completed ACC request form
	 */
	public onSubmit () {
		const groupTrainingRequestParams: GroupTrainingRequestSchema = {
			contract: this.requestForm.get('contract').value,
			technologyArea: this.requestForm.get('technologyArea').value,
			timezone: this.requestForm.get('timeZone').value,
			preferredSlot: this.requestForm.get('meetingTime').value,
			preferredLanguage: this.requestForm.get('language').value,
			trainingSessionGoal: this.requestForm.get('trainingGoal').value,
			pitstop: this.pitstop,
			solution: this.solution,
			usecase: this.technology,
		};
		this.contentService
		.requestGroupTraining(groupTrainingRequestParams)
			.pipe(
				catchError(err => {
					this.formSubmissionFailed = true;
	
					return of({ });
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.formSubmissionSucceeded = true;
				this.logger.debug('Submitted CGT response form');
				setTimeout(()=>{
					this.formSubmissionSucceeded = false;
					this.submitted.emit(true);
				}, 5000);
			});
	}
}
