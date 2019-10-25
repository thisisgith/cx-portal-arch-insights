import { Component, HostListener, Inject, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, Subject } from 'rxjs';
import { catchError, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { SetupComponent, SetupStep } from '@interfaces';
import { KEY_CODES, SETUP_STATES } from '@classes';
import { SetupIEStateService } from '../setup-ie-state.service';
import { RegisterCollectorService } from '../register-collector/register-collector.service';
import { SetupIEService } from '../setup-ie.service';
import { NoDNACComponent } from '../no-dnac/no-dnac.component';
import { UtilsService } from '@services';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import * as _ from 'lodash-es';

/**
 * Component for creating Intelligence Engine Account
 */
@Component({
	selector: 'app-connect-dna-center',
	styleUrls: ['./connect-dna-center.component.scss'],
	templateUrl: './connect-dna-center.component.html',
})
export class ConnectDNACenterComponent implements OnInit, SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<SetupComponent[]>();
	@Output() public goBack = new EventEmitter<number>();
	public hasVirtualAccount = false;
	public virtualAccounts = [];
	public error: boolean;
	public passwordError: boolean;
	public loading: boolean;
	public promptForCreds: boolean;
	private customerId: string;

	public accountForm = new FormGroup({
		ipAddress: new FormControl(null, [
			Validators.required,
		]),
		password: new FormControl(null, [
			Validators.required,
		]),
		username: new FormControl(null, [
			Validators.required,
		]),
	});
	public credsForm: FormGroup = new FormGroup({
		password: new FormControl(null, Validators.required),
	});

	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		@Inject('ENVIRONMENT') private env,
		private cpService: ControlPointIERegistrationAPIService,
		private route: ActivatedRoute,
		private router: Router,
		private registerService: RegisterCollectorService,
		private setupService: SetupIEService,
		private state: SetupIEStateService,
		private utils: UtilsService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
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
				this.goBack.emit(3);
			}
		}
		this.loading = true;
		this.setupService.checkForDNAC()
			.pipe(
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(hasDNAC => {
				if (!hasDNAC) {
					this.onStepComplete.emit([
						{
							state: SETUP_STATES.CONNECT_DNAC,
							type: NoDNACComponent,
						},
					]);
				}
			});
	}

	/**
	 * Handle user clicking Add another Cisco DNA Center deployment
	 */
	// public addAnotherDeployment () {
		// TODO: this method
	// }

	/**
	 * Submit the completed form
	 */
	public onSubmit () {
		this.error = false;
		this.passwordError = false;
		this.loading = true;
		if (_.get(this.credsForm.get('password'), 'value')) {
			// try to get a new auth token
			this.reAuthorize()
				.pipe(
					mergeMap(() => this.register()
						.pipe(
							catchError(() => {
								this.error = true;
								this.loading = false;

								return empty();
							}),
						)),
					mergeMap(() => this.cpService
						.updateRegistrationCompletionUsingPOST({
							completed: true,
							customerId: this.customerId,
						})
						.pipe(
							catchError(() => {
								this.onStepComplete.emit(); // continue even if an error occurs

								return empty();
							}),
						)),
					takeUntil(this.destroyed$),
				)
				.subscribe(() => {
					this.onStepComplete.emit();
				});
		} else {
			this.register()
				.pipe(
					catchError(() => {
						// CX Collector token may have expired, so prompt for credentials
						this.promptForCreds = true;
						this.loading = false;

						return empty();
					}),
					mergeMap(() => this.cpService
						.updateRegistrationCompletionUsingPOST({
							completed: true,
							customerId: this.customerId,
						})
						.pipe(
							catchError(() => {
								this.onStepComplete.emit(); // continue even if an error occurs

								return empty();
							}),
						)),
					takeUntil(this.destroyed$),
				)
				.subscribe(() => {
					this.onStepComplete.emit();
				});
		}
	}

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
	 * Make API Call to register DNAC
	 * @returns Observable
	 */
	public register () {
		return this.registerService
			.installAndRegisterDNAC({
				dnacIP: this.accountForm.get('ipAddress').value,
				password: this.accountForm.get('password').value,
				username: this.accountForm.get('username').value,
			});
	}

	/**
	 * Gets a new Auth Token
	 * @returns Observable
	 */
	public reAuthorize () {
		return this.registerService
			.getAuthToken({
				password: this.credsForm.get('password').value,
				userId: 'cxcadmin',
			})
			.pipe(
				mergeMap(response => {
					const state = this.state.getState() || { };
					state.collectorToken = response;
					this.state.setState(state);

					return response;
				}),
				catchError(() => {
					this.passwordError = true;
					this.loading = false;

					return empty();
				}),
				takeUntil(this.destroyed$),
			);
	}
}
