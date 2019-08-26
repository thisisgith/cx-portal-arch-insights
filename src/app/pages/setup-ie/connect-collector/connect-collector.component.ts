import {
	Component, EventEmitter, HostListener, Inject, OnDestroy, OnInit, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, of, Subject } from 'rxjs';
import { catchError, exhaustMap, map, takeUntil, takeWhile } from 'rxjs/operators';
import { SetupIEStateService } from '../setup-ie-state.service';
import { KEY_CODES } from '@classes';

import { SetupStep } from '@interfaces';

import { SetupIEService } from '../setup-ie.service';

import * as _ from 'lodash-es';

/**
 * Custom Validator for IP Address
 * @param control {AbstractControl}
 * @returns function
 */
function validateIpAddress (control: AbstractControl) {
	const error = { value: 'Invalid IP Address Error' };
	const regexMatch = control.value
		&& control.value.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/);
	if (!regexMatch) { return error; }
	let hasError = false;
	regexMatch.slice(1, 5)
		.forEach(elem => {
			const num = parseInt(elem, 10);
			if (isNaN(num) || num > 255) { hasError = true; }
		});
	if (hasError) { return error; }

	return null;
}

/**
 * Component for connecting to CX Collector
 */
@Component({
	selector: 'app-connect-collector',
	styleUrls: ['./connect-collector.component.scss'],
	templateUrl: './connect-collector.component.html',
})
export class ConnectCollectorComponent implements OnDestroy, OnInit, SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();
	public hasVirtualAccount = false;
	public virtualAccounts = [];
	public DNACStep = false;
	public ipFieldHidden = false;
	public ipAddressLink: string;
	public view: 'input' | 'connecting' | 'instruct' = 'input';

	public accountForm = new FormGroup({
		ipAddress: new FormControl(null, [
			Validators.required,
			validateIpAddress,
		]),
	});

	private destroyed$: Subject<void> = new Subject<void>();
	public reachedIP = false;
	public get ipAddress () {
		return this.accountForm.get('ipAddress').value;
	}

	constructor (
		@Inject('ENVIRONMENT') private env,
		private route: ActivatedRoute,
		private router: Router,
		private setupService: SetupIEService,
		private state: SetupIEStateService,
	) { }

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
		this.route.queryParams
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe(params => {
				if (!params.collectorIP) {
					this.view = 'input';
				}
			});
	}

	/**
	 * Submits the user input IP Address
	 */
	public async onSubmit () {
		const url = `https://${_.trim(this.ipAddress)}`;
		this.ipAddressLink = url;
		this.view = 'connecting';
		await this.router.navigate([], {
			queryParams: {
				collectorIP: this.ipAddress,
			},
			queryParamsHandling: 'merge',
		});
		this.checkIPConnection()
				.pipe(takeUntil(this.destroyed$))
				.subscribe(hasCert => {
					if (!hasCert) {
						// this.openIpAddressInNewTab();
						this.view = 'instruct';
						this.pollIP();
					} else {
						this.onConnect();
					}
				});
	}

	/**
	 * Opens the given IP Address in a new tab
	 */
	private openIpAddressInNewTab () {
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
						this.onConnect();
					}

					return !connected;
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe();
	}

	/**
	 * Checks IP Connection (resolves to false unless 200 is returned)
	 * @returns Observable
	 */
	private checkIPConnection () {
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
	 * Handles saving state after secure connection is established
	 */
	private async onConnect () {
		const state = this.state.getState() || { };
		state.collectorIP = this.ipAddress;
		this.state.setState(state);

		this.onStepComplete.emit();
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

}
