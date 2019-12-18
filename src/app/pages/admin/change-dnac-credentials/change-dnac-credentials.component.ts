import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { interval, Subject, of, empty } from 'rxjs';
import { catchError, exhaustMap, map, takeUntil, takeWhile } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SetupIEService } from '../../setup-ie/setup-ie.service';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';
import { RegisterCollectorService, ChangeDNACCredentialsParams } from '../../setup-ie/register-collector/register-collector.service';
import { I18n } from '@cisco-ngx/cui-utils';
import { validateIpAddress, passwordValidator } from '@utilities';
import { CuiModalService } from '@cisco-ngx/cui-components';

/**
 * Change DNAC Credentials component
 */

@Component({
	selector: 'change-dnac-credentials',
	styleUrls: ['./change-dnac-credentials.component.scss'],
	templateUrl: './change-dnac-credentials.component.html',
})
export class ChangeDNACCredentialsComponent implements OnDestroy {
	@ViewChild('showConfirmationModal',
		{ static: true }) private showConfirmationModal: TemplateRef<string>;

	public isLoading = false;
	public authToken = '';
	public ipNotConnected = false;
	public changeCred = false;
	public instruct = false;
	public reachedIP = false;
	public clickedProceed = false;
	public isChangingCred = false;
	public ipAddressLink: string;
	public ipAddress: '';
	public alert: any = { };
	public errors: any = { };
	public credentials: ChangeDNACCredentialsParams;
	public ipAddressForm = new FormGroup({
		ipaddress: new FormControl('', [Validators.required, validateIpAddress]),
	});
	private destroyed$: Subject<void> = new Subject<void>();
	public count = 0;

	public credentialsForm = new FormGroup({
		collectorPassword: new FormControl(null, [
			Validators.required,
			passwordValidator,
		]),
		DNACIpAddress: new FormControl(null, [
			Validators.required,
			validateIpAddress,
		]),
		username: new FormControl(null, [
			Validators.required,
		]),
		password: new FormControl(null, [
			Validators.required,
		]),
	});

	constructor (
		private router: Router,
		private setupService: SetupIEService,
		private registerCollectorService: RegisterCollectorService,
		private cuiModalService: CuiModalService,
	) { }

	public get CollPwErrors () {
		return this.credentialsForm.get('collectorPassword').errors;
	}
	public get CollpwControl () {
		return this.credentialsForm.get('collectorPassword');
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
	 * Focus Collector IP Address Handler
	 */
	public focusIP () {
		document.getElementById('collector-password')
			.focus();
	}

	/**
	 * Continue Button Handler
	 */
	public onContinue () {
		this.isLoading = true;
		this.ipNotConnected = false;
		this.alert.visible = true;
		this.changeCred = false;
		this.ipAddress = this.ipAddressForm.value.ipaddress;
		this.ipAddressLink = `https://${_.trim(this.ipAddress)}`;
		this.checkIPConnection()
			.pipe(takeUntil(this.destroyed$))
			.subscribe(hasCert => {
				if (hasCert) {
					this.isLoading = false;
					this.changeCred = true;
					const inter = interval(0)
					.pipe(
						map(() => {
							this.focusIP();
							inter.unsubscribe();
						}),
					)
					.subscribe();
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
		this.count = 0;
		const inter = interval(2000)
			.pipe(
				exhaustMap(() => this.checkIPConnection()),
				takeWhile(connected => {
					if (connected) {
						this.changeCred = true;
						this.focusIP();
					}
					this.count = this.count + 1;
					if (this.count === 3) {
						this.instruct = false;
						this.ipNotConnected = true;
						this.isLoading = false;
						this.count = 0;
						inter.unsubscribe();
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
		_.invoke(this.alert, 'hide');
		this.credentials = {
			type: 'dnac',
			ipAddress: this.credentialsForm.value.DNACIpAddress,
			username: this.credentialsForm.value.username,
			password: this.credentialsForm.value.password,
		};
		this.isLoading = true;
		this.registerCollectorService.getAuthTokenDayN(this.ipAddress, this.credentialsForm.value.collectorPassword)
			.pipe(
				catchError(() => {
					_.invoke(
						this.alert,
						'show',
						I18n.get('_InvalidCXCollectorPassword_'),
						'danger');
					this.isLoading = false;
					this.focusIP();

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.authToken = response;
				this.changeCredentials();
			});
		this.credentialsForm.reset();
	}

	/**
	 * Change the DNAC Credentials
	 */
	public changeCredentials () {
		this.registerCollectorService.changeDNACCredentials([this.credentials], this.ipAddress, this.authToken)
			.pipe(
				catchError(err => {
					this.errors = err;
					this.isChangingCred = false;
					_.invoke(
						this.alert,
						'show',
						this.errors.message,
						'danger');
					this.isLoading = false;
					this.focusIP();

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(updateResponse => {
				if (updateResponse === 'Configurations updated.') {
					this.isLoading = false;
					this.isChangingCred = true;
					this.cuiModalService.show(this.showConfirmationModal, 'normal');
				} else {
					const responseData = JSON.parse(updateResponse.toString());
					this.isChangingCred = false;
					_.invoke(
						this.alert,
						'show',
						responseData[0].message,
						'danger');
					this.isLoading = false;
					this.focusIP();
				}
			});
	}

	/**
	 * Continue Button Handler in Success Modal
	 */
	public onConfirm () {
		this.cuiModalService.hide();
		this.router.navigate(['/admin']);
	}
}
