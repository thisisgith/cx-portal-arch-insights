import {
	Component,
	EventEmitter,
	HostListener,
	Inject,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, Subject, timer } from 'rxjs';
import {
	catchError, exhaustMap, finalize, mergeMap, tap, takeWhile, takeUntil,
} from 'rxjs/operators';

import { LogService } from '@cisco-ngx/cui-services';
import { SetupIEStateService } from '../setup-ie-state.service';
import { SetupIEService } from '../setup-ie.service';

import { SetupStep } from '@interfaces';
import { KEY_CODES } from '@classes';

import { ControlPointIERegistrationAPIService, UserResponse } from '@sdp-api';
import {
	RegisterCollectorService,
} from './register-collector.service';
import { I18n } from '@cisco-ngx/cui-utils';

import * as _ from 'lodash-es';
import { passwordValidator, passwordsMatchValidator, proxyHostValidator, passwordsOldNewValidator } from '@utilities';

enum RegistrationError {
	ADVANCED,
	FILE_DOWNLOAD,
	REGISTRATION,
}

/**
 * Map of error messages
 */
const registrationErrorMap = {
	[RegistrationError.FILE_DOWNLOAD]: I18n.get('_ErrorDownloadingRegistrationFile_'),
	[RegistrationError.REGISTRATION]: I18n.get('_RegistrationError_'),
	[RegistrationError.ADVANCED]: I18n.get('_RegistrationErrorAdvanced_'),
};

/**
 * Component for creating Intelligence Engine Account
 */
@Component({
	selector: 'app-register-collector',
	styleUrls: ['./register-collector.component.scss'],
	templateUrl: './register-collector.component.html',
})
export class RegisterCollectorComponent implements OnDestroy, OnInit, SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();
	@Output() public goBack = new EventEmitter<number>();
	public error: string;
	public hasVirtualAccount = false;
	public loading = false;
	public registering = false;
	public showProxyForm: boolean;
	public virtualAccounts = [
		{ name: 'test', value: 'test' },
		{ name: 'values', value: 'values' },
	];
	public errorDetails: string;
	public registerSteps = [
		I18n.get('_InputValidationRunning_'),
		I18n.get('_InputValidationCompleted_'),
		I18n.get('_PasswordSet_'),
		I18n.get('_HostTimezoneAndTimeSet_'),
		I18n.get('_ConnectionWithCiscoEstablished_'),
	];
	public currentStep = 0;
	public isFromAdmin = false;

	public accountForm = new FormGroup({
		oldPassword: new FormControl(null, [
			Validators.required,
			passwordValidator,
			passwordsOldNewValidator.bind(this),
		]),
		password: new FormControl(null, [
			Validators.required,
			passwordValidator,
			passwordsOldNewValidator.bind(this),
		]),
		passwordConf: new FormControl(null, [
			Validators.required,
		]),
		proxyHost: new FormControl(null,
			proxyHostValidator,
		),
		proxyPassword: new FormControl(null),
		proxyPort: new FormControl(null, [
			Validators.min(1),
			Validators.max(65535),
		]),
		proxyUser: new FormControl(null),
		// virtualAccount: new FormControl(null, [Validators.required]),
	}, { validators: passwordsMatchValidator });

	private destroyed$: Subject<void> = new Subject<void>();
	private registrationFileUrl: string;
	private registrationFile: Blob;
	private user: UserResponse['data'];
	private customerId: string;

	public get pwErrors () {
		return this.accountForm.get('password').errors;
	}
	public get pwControl () {
		return this.accountForm.get('password');
	}
	public get oldPwErrors () {
		return this.accountForm.get('oldPassword').errors;
	}
	public get oldPwControl () {
		return this.accountForm.get('oldPassword');
	}
	public get confErrors () {
		return this.accountForm.getError('doesNotMatch');
	}
	public get confControl () {
		return this.accountForm.get('passwordConf');
	}

	constructor (
		@Inject('ENVIRONMENT') private env,
		private cpService: ControlPointIERegistrationAPIService,
		private logger: LogService,
		private registerService: RegisterCollectorService,
		private route: ActivatedRoute,
		private router: Router,
		private setupService: SetupIEService,
		private state: SetupIEStateService,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		const state = this.state.getState() || { };
		if (!state.collectorIP) {
			// if no ip, check the queryParams
			const collectorIP = this.route.snapshot.queryParams.collectorIP;
			if (collectorIP) {
				state.collectorIP = collectorIP;
				this.state.setState(state);
			} else {
				// if no ip in queryParams, go to previous page
				this.state.clearState();
				this.goBack.emit(2);
			}
		}
		// get the user info on init (need customerId for download post)
		this.loading = true;
		this.cpService.getIERegistrationUsingGET(this.customerId)
			.pipe(
				finalize(() => {
					this.loading = false;
				}),
				mergeMap(response => {
					// response should contain the registration download
					// try to download the registration file
					this.registrationFileUrl =  _.get(response, '[0].registrationFileUrl');
					if (this.env.ieSetup.mockRegistration) {
						this.registrationFileUrl = 'assets/img/setup-ie/registration.zip';
					}

					return this.setupService.downloadFromUrl(this.registrationFileUrl);
				}),
				catchError(() => {
					this.error = registrationErrorMap[RegistrationError.FILE_DOWNLOAD];
					this.loading = false;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(file => {
				this.registrationFile = file;
			});
	}

	/**
	 * Submit the completed form
	 */
	public onSubmit () {
		// this.onContinue();
		this.route.queryParams.subscribe(params => {
			if (params.fromAdmin) {
				this.isFromAdmin = true;
			}
		});
		const formValues = this.accountForm.value;
		this.registering = true;
		this.registerService
			.registerOnline(
			{
				oldPassword: formValues.oldPassword,
				password: formValues.password,
				proxyHost: formValues.proxyHost,
				proxyPassword: formValues.proxyPassword,
				proxyPort: formValues.proxyPort,
				proxyUser: formValues.proxyUser,
			},
				this.registrationFile,
			)
			.pipe(
				catchError(err => {
					if (err.status === 500 || this.shouldHideError(err.error)) {
						this.error = registrationErrorMap[RegistrationError.ADVANCED];
					} else {
						this.error = registrationErrorMap[RegistrationError.REGISTRATION];
						this.errorDetails = err.error;
					}
					this.registering = false;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.registering = false;
				if (!/Device is already register/.test(response)) {
					const state = this.state.getState() || { };
					state.collectorToken = response;
					this.state.setState(state);
					this.startPolling();
				} else {
					this.getAuthToken()
						.pipe(takeUntil(this.destroyed$))
						.subscribe(() => {
							this.startPolling();
						});
				}
			});
	}

	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	@HostListener('window:keyup', ['$event'])
	public keyEvent (event: KeyboardEvent) {
		if (
			event.keyCode === KEY_CODES.ENTER
			&& this.accountForm.valid
			&& !this.registering
			&& !this.loading
		) {
			this.onSubmit();
		}
	}

	/**
	 * Start polling for status
	 */
	private startPolling () {
		this.registering = true;

		this.pollStatus()
			.subscribe();
	}

	/**
	 * Polls the collector for status until registration is complete
	 * @returns Observable
	 */
	public pollStatus () {
		return timer(0, 5000)
			.pipe(
				exhaustMap(() => this.registerService.getStatus()
					.pipe(
						catchError(() => this.getAuthToken()),
					),
				),
				takeWhile((status: any) => {
					const stages = status.stages;
					if (status.status === 'Registration Failed') {
						this.error = registrationErrorMap[RegistrationError.REGISTRATION];
						this.errorDetails = stages;
						this.registering = false;

						return false;
					}
					if (status.status === 'Registered') {
						this.getCurrentRegistrationStep(stages);
						timer(1500)
							.pipe(takeUntil(this.destroyed$))
							.subscribe(() => {
								// continue to next screen after a second
								if (this.isFromAdmin) {
									this.router.navigate(['/admin/settings']);
								} else {
									this.onStepComplete.emit();
								}
							});

						return false;
					}
					this.getCurrentRegistrationStep(stages);

					return true;
				}),
				catchError(() => {
					this.registering = false;

					return empty();
				}),
				takeUntil(this.destroyed$),
			);
	}

	/**
	 * Get an auth token
	 * @returns Observable
	 */
	private getAuthToken () {
		return this.registerService
			// if an error comes up, try to get a new auth token
			.getAuthToken({
				password: this.accountForm.get('password').value,
				userId: 'cxcadmin',
			})
			.pipe(
				tap(response => {
					const state = this.state.getState() || { };
					state.collectorToken = response;
					this.state.setState(state);
				}),
				catchError(err => {
					this.error = registrationErrorMap[RegistrationError.REGISTRATION];
					this.errorDetails = err.error;
					this.registering = false;

					return empty();
				}),
			);
	}

	/**
	 * Get Current Registration Step given API response
	 * @param stages - string
	 */
	private getCurrentRegistrationStep (stages: string) {
		if (/Core components are deployed and registration is successful/.test(stages)) {
			this.currentStep = 5;
		} else if (/Connection with Cisco established/.test(stages)) {
			this.currentStep = 4;
		} else if (/Host Timezone and Time set/.test(stages)) {
			this.currentStep = 3;
		} else if (/Password set/.test(stages)) {
			this.currentStep = 2;
		} else if (/Input Validation Completed/.test(stages)) {
			this.currentStep = 1;
		} else {
			this.currentStep = 0;
		}
	}

	/**
	 * Some errors should be shown to the user. This method determines whether or not the errors
	 * should be shown.
	 * @param error - string
	 * @returns boolean
	 */
	private shouldHideError (error: string) {
		return /Please provide valid registration file./.test(error)
			|| /Only zip files can be attached./.test(error)
			|| /Corrupt file. Please provide valid registration file./.test(error);
	}
}
