import { Component, OnDestroy } from '@angular/core';
import { interval, Subject, of, empty } from 'rxjs';
import { catchError, exhaustMap, map, takeUntil, takeWhile } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SetupIEService } from '../../setup-ie/setup-ie.service';
import * as _ from 'lodash-es';
import {  Router } from '@angular/router';
import { RegisterCollectorService, ChangePasswordParams } from '../../setup-ie/register-collector/register-collector.service';
import { I18n } from '@cisco-ngx/cui-utils';
import { validateIpAddress, passwordValidator, passwordsMatchValidator, passwordsOldNewValidator } from '../../../utilities/index';

/**
 * Change Password component
 */

@Component({
	selector: 'change-password',
	styleUrls: ['./change-password.component.scss'],
	templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnDestroy {
	public isLoading = false;
	public changePas = false;
	public instruct = false;
	public reachedIP = false;
	public clickedProceed = false;
	public isChangingPass = false;
	public ipAddressLink: string;
	public ipAddress: '';
	public alert: any = { };
	public errors: any = { };
	public ipAddressForm = new FormGroup({
		ipaddress : new FormControl('', [Validators.required, validateIpAddress]),
	});
	private destroyed$: Subject<void> = new Subject<void>();

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
	}, { validators: passwordsMatchValidator });

	constructor (
		private router: Router,
		private setupService: SetupIEService,
		private registerCollectorService: RegisterCollectorService,
		) { }

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

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Checks IP Connection (resolves to false unless 200 is returned)
	 * @returns Observable
	 */
	public checkIPConnection () {
		return this.setupService.ping(this.ipAddressLink)
			.pipe(
				map(() => {
					this.reachedIP = true;

					return this.reachedIP;
				}),
				catchError(() => of(false)),
			);
	}

	/**
	 * Continue Button Handler
	 */
	public onContinue () {

		this.isLoading = true;
		this.alert.visible = true;
		this.ipAddress =  this.ipAddressForm.value.ipaddress;
		this.ipAddressLink = `https://${_.trim(this.ipAddress)}`;
		this.checkIPConnection()
				.pipe(takeUntil(this.destroyed$))
				.subscribe(hasCert => {
					if (hasCert) {
						this.changePas = true;
					} else {
						this.instruct = true;
					}
				});
	}

	/**
	 * Opens the given IP Address in a new tab
	 */
	public openIpAddressInNewTab () {
		this.clickedProceed = true;
		this.pollIP();
		window.open(`${this.ipAddressLink}/verified`, '_blank');
	}

	/**
	 * Pings the provided IP until a 200 comes back
	 * @returns Observable
	 */
	private pollIP () {
		interval(2000)
			.pipe(
				exhaustMap(() => this.checkIPConnection()),
				takeWhile(connected => {
					if (connected) {
						this.changePas = true;
					}

					return !connected;
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe();
	}

	/**
	 * Submit Button Handler
	 */
	public onSubmit () {
		this.isChangingPass = true;
		const pass: ChangePasswordParams = {
			new_password: this.accountForm.value.password,
			old_password: this.accountForm.value.oldPassword,
		};
		this.accountForm.reset();
		this.registerCollectorService.changePassword(pass, this.ipAddress)
		.pipe(
			catchError(err => {
				this.errors = err;
				if (this.errors.status === 400) {
					this.isChangingPass = false;
					_.invoke(
						this.alert,
						'show',
						I18n.get('_InvalidOldPassword_'),
						'danger');
				}

				return empty();
			}),
		)
		.subscribe(response => {
			if (/Credential changed/.test(response)) {
				this.router.navigate(['/admin']);
			}
		});
	}
}
