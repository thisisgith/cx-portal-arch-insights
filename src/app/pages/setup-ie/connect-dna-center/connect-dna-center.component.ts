import { Component, HostListener, Inject, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, from, Subject } from 'rxjs';
import { catchError, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { SetupComponent, SetupStep } from '@interfaces';
import { KEY_CODES, SETUP_STATES } from '@classes';
import { SetupIEStateService } from '../setup-ie-state.service';
import { RegisterCollectorService } from '../register-collector/register-collector.service';
import { CuiModalService } from '@cisco-ngx/cui-components';
import {
	CollectorCredsModalComponent,
} from '../collector-creds-modal/collector-creds-modal.component';
import { SetupIEService } from '../setup-ie.service';
import { NoDNACComponent } from '../no-dnac/no-dnac.component';
import { UtilsService } from '@services';

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
	public hasVirtualAccount = false;
	public virtualAccounts = [];
	public error: boolean;
	public loading: boolean;

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

	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		@Inject('ENVIRONMENT') private env,
		private cuiModalService: CuiModalService,
		private route: ActivatedRoute,
		private router: Router,
		private registerService: RegisterCollectorService,
		private setupService: SetupIEService,
		private state: SetupIEStateService,
		private utils: UtilsService,
	) { }

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
							state: SETUP_STATES.COLLECTOR,
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
		this.loading = true;
		this.register()
			.pipe(
				finalize(() => this.loading = false),
				catchError(() => {
					// CX Collector token may have expired, so prompt for credentials
					const modalPromise = this.cuiModalService
						.showComponent(CollectorCredsModalComponent, { });

					// try again with refreshed token
					return from(modalPromise)
						.pipe(
							mergeMap(() => this.register()),
							catchError(() => {
								this.error = true;
								this.loading = false;

								return empty();
							}),
							takeUntil(this.destroyed$),
						);
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				// finished last step so hide the setup banner on the home page
				this.utils.setLocalStorage(
					this.env.ieSetup.CX_Coll_Reg_LS_KEY,
					{ registered: true },
				);
				this.onStepComplete.emit();
			});
	}

	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	@HostListener('window:keyup', ['$event'])
	public keyEvent (event: KeyboardEvent) {
		if (event.keyCode === KEY_CODES.ENTER && this.accountForm.valid) {
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
}
