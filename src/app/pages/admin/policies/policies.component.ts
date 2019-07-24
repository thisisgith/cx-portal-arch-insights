import { Component, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import {
	ControlPointDevicePolicyAPIService,
	PolicyResponseModel,
	UserService,
} from '@sdp-api';

import { empty, Subject } from 'rxjs';
import { catchError, finalize, takeUntil, mergeMap } from 'rxjs/operators';

import cronstrue from 'cronstrue';
import * as _ from 'lodash-es';

/**
 * Main Policies component
 */
@Component({
	selector: 'app-policies',
	styleUrls: ['./policies.component.scss'],
	templateUrl: './policies.component.html',
})
export class PoliciesComponent implements OnInit {
	private destroyed$: Subject<void> = new Subject<void>();
	public policyData: PolicyResponseModel[];
	public loading = true;
	public error = false;
	public errorMessage: string;
	public scans: PolicyResponseModel[];
	public collections: PolicyResponseModel[];

	constructor (
		private logger: LogService,
		private controlPointDevicePolicyAPIService: ControlPointDevicePolicyAPIService,
		private userService: UserService,
	) {
		this.logger.debug('PoliciesComponent Created!');
	}

	/**
	 * Get policy info given customerID
	 * @param {String} customerId - Customer ID string
	 * @returns observable
	 */
	public getPoliciesData (customerId: string) {
		return this.controlPointDevicePolicyAPIService.getAllPolicyUsingGET(customerId)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			);
	}

	/**
	 * Handles seperates policyData into scan and colleciton lists
	 */
	public handleData () {
		this.scans = [];
		this.collections = [];
		_.forEach(this.policyData, element => {
			const schedule = _.get(element, 'schedule');
			const humanReadableCron = cronstrue.toString(schedule);
			_.set(element, 'formattedSchedule', humanReadableCron);

			const ptype = _.get(element, 'policyType');
			if (ptype === 'SCAN') {
				this.scans.push(element);
			} else if (ptype === 'COLLECTION') {
				this.collections.push(element);
			}
		});
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Function which instanstiates the settings page to the initial view
	 */
	public ngOnInit () {
		this.loading = true;
		this.userService.getUser()
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.pipe(
				mergeMap(userResponse =>
					this.getPoliciesData(String(_.get(userResponse, 'data.customerId')))),
			)
			.subscribe(response => {
				this.policyData = response;
				this.handleData();
			});
	}
}
