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

	private destroyed$: Subject<void> = new Subject<void>();
	public reachedIP = false;

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
		this.onStepComplete.emit();
	}
}
