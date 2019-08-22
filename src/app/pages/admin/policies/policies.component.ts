import {
	Component,
	OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
	ControlPointDevicePolicyAPIService,
	PolicyResponseModel,
} from '@sdp-api';

import { empty, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { User } from '@interfaces';

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
	public modalVisible = false;
	public loadedPolicy: PolicyResponseModel;
	public customerId: string;

	private destroyed$: Subject<void> = new Subject<void>();
	public policyData: PolicyResponseModel[];
	public loading = true;
	public error = false;
	public errorMessage: string;
	public modalType: string;
	public scans: PolicyResponseModel[];
	public collections: PolicyResponseModel[];

	private user: User;

	constructor (
		private controlPointDevicePolicyAPIService: ControlPointDevicePolicyAPIService,
		private route: ActivatedRoute,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
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
			if (schedule) {
				try {
					const humanReadableCron = cronstrue.toString(schedule);
					_.set(element, 'formattedSchedule', `${_.toLower(humanReadableCron)} UTC`);
				} catch (e) {
					// TODO
				}
			}

			const ptype = _.get(element, 'policyType');
			if (ptype === 'SCAN' || ptype === 'IGNORE') {
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
	 * Select/deselect the polices / colleciton modal
	 * @param selected whether the component is visible or not
	 * @param modalType what modal to pull up
	 * @param policy? policy of collection to modify
	 */
	public startModal (selected: boolean, modalType: string, policy?: PolicyResponseModel) {
		if (selected) {
			if (policy) {
				this.loadedPolicy = policy;
			}
			this.modalType = modalType;
		}

		this.modalVisible = selected;
	}

	/**
	 * Trigger the submitted acc success text.  Currently placeholder and will be removed
	 * because this info will come from the API
	 * @param submitted if the request was submitted
	 */
	public collectionRequestSubmit (submitted: boolean) {
		if (submitted) {
			this.modalVisible = false;
			this.loading = true;
			this.getPoliciesData(this.customerId)
				.subscribe(response => {
					this.policyData = response;
					this.handleData();
				});
		}
	}

	/**
	 * Function which instanstiates the settings page to the initial view
	 */
	public ngOnInit () {
		this.loading = true;
		this.getPoliciesData(this.customerId)
			.subscribe(response => {
				this.policyData = response;
				this.handleData();
			});
	}
}
