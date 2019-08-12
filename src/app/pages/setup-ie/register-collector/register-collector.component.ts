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

enum RegistrationError {
	FILE_DOWNLOAD,
	REGISTRATION,
}

/**
 * Map of error messages
 */
const registrationErrorMap = {
	[RegistrationError.FILE_DOWNLOAD]: I18n.get('_ErrorDownloadingRegistrationFile_'),
	[RegistrationError.REGISTRATION]: I18n.get('_RegistrationError_'),
};

/**
 * Validator for password criteria
 * @param control - FormControl
 * @returns validity
 */
function passwordValidator (control: FormControl) {
	const currentValue = control.value;
	if (!currentValue) { return null; }
	const errors: {
		needsLength?: { value: string },
		needsLowercase?: { value: string },
		needsNumber?: { value: string },
		needsSpecialChar?: { value: string },
		needsUppercase?: { value: string },
	} = { };
	if (currentValue.length < 8) {
		errors.needsLength = { value: currentValue };
	}
	if (!/[A-Z]/.test(currentValue)) {
		errors.needsUppercase = { value: currentValue };
	}
	if (!/[a-z]/.test(currentValue)) {
		errors.needsLowercase = { value: currentValue };
	}
	if (!/\d/.test(currentValue)) {
		errors.needsNumber = { value: currentValue };
	}
	if (!/\W/.test(currentValue)) {
		errors.needsSpecialChar = { value: currentValue };
	}
	if (Object.entries((errors || { })).length) {
		// if errors isn't empty, return it
		return errors;
	}

	return null;
}

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
	public error: string;
	public hasVirtualAccount = false;
	public loading = false;
	public showProxyForm: boolean;
	public virtualAccounts = [
		{ name: 'test', value: 'test' },
		{ name: 'values', value: 'values' },
	];
	public errorDetails: string;

	public accountForm = new FormGroup({
		password: new FormControl(null, [
			Validators.required,
			passwordValidator,
		]),
		passwordConf: new FormControl(null, [
			Validators.required,
			this.confirmValidator.bind(this),
		]),
		proxyHost: new FormControl(null),
		proxyPassword: new FormControl(null),
		proxyPort: new FormControl(null),
		proxyUser: new FormControl(null),
		// virtualAccount: new FormControl(null, [Validators.required]),
	});
	public get pwErrors () {
		return this.accountForm.get('password').errors;
	}
	public get pwControl () {
		return this.accountForm.get('password');
	}

	private destroyed$: Subject<void> = new Subject<void>();
	private registrationFileUrl: string;
	private registrationFile: Blob;
	private user: UserResponse['data'];
	private customerId: string;

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
				this.router.navigate([], {
					queryParams: { compKey: '5' },
					queryParamsHandling: 'merge',
				});
			}
		}
		// get the user info on init (need customerId for download post)
		this.loading = true;
		this.cpService.getIERegistrationUsingGET(this.customerId)
			.pipe(
				finalize(() => this.loading = false),
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
	 * Custom Validator for ensuring password and confirm fields are in sync
	 * @param control - FormControl passed to method
	 * @returns error | null
	 */
	private confirmValidator (control: FormControl) {
		if (this.accountForm) {
			const password = this.accountForm.get('password').value;
			if (password !== control.value) {
				return { passwordMismatch: { value: control.value } };
			}
		}

		return null;
	}

	/**
	 * Submit the completed form
	 */
	public onSubmit () {
		// this.onContinue();
		const formValues = this.accountForm.value;
		this.loading = true;
		this.registerService
			.registerOnline(
			{
				password: formValues.password,
				proxyHost: formValues.proxyHost,
				proxyPassword: formValues.proxyPassword,
				proxyPort: formValues.proxyPort,
				proxyUser: formValues.proxyUser,
			},
				this.registrationFile,
			)
			.pipe(
				finalize(() => this.loading = false),
				catchError(err => {
					this.error = registrationErrorMap[RegistrationError.REGISTRATION];
					this.errorDetails = err.error;
					this.loading = false;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
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
			&& !this.loading
		) {
			this.onSubmit();
		}
	}

	/**
	 * Start polling for status
	 */
	private startPolling () {
		this.loading = true;

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
				finalize(() => this.loading = false),
				exhaustMap(() => this.registerService.getStatus()
					.pipe(
						catchError(() => this.getAuthToken()),
					),
				),
				takeWhile(status => {
					if ((<any> status).status === 'Registration Failed') {
						this.error = registrationErrorMap[RegistrationError.REGISTRATION];
						this.errorDetails = (<any> status).stages;

						return false;
					}
					if ((<any> status).status === 'Registered') {
						this.onStepComplete.emit();

						return false;
					}

					return true;
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
					this.loading = false;

					return empty();
				}),
			);
	}
}
