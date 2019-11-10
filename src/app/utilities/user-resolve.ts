
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EntitlementWrapperService, UserEntitlement, OrgUserService, OrgUserResponse } from '@sdp-api';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { User, SmartAccount } from '@interfaces';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import {
	UnauthorizedUserComponent,
} from '../components/unauthorized-user/unauthorized-user.component';
/**
 * Resolver to fetch our user
 */
@Injectable({
	providedIn: 'root',
})
export class UserResolve implements Resolve<any> {

	private cachedUser: User;
	private customerId = new ReplaySubject<string>(1);
	private user = new ReplaySubject<User>(1);
	private smartAccount: SmartAccount;
	private cxLevel = new ReplaySubject<number>(1);
	private solution = new ReplaySubject<string>(1);
	private useCase = new ReplaySubject<string>(1);
	private role = new ReplaySubject<string>(1);

	constructor (
		private cuiModalService: CuiModalService,
		private entitlementWrapperService: EntitlementWrapperService,
		private orgUserService: OrgUserService,
		private logger: LogService,
	) { }

	/**
	 * Returns the current customerId
	 * @returns the observable representing the customerId
	 */
	public getCustomerId (): Observable<string> {
		return this.customerId.asObservable();
	}

	/**
	 * Returns the current user object
	 * @returns the observable representing the user
	 */
	public getUser (): Observable<User> {
		return this.user.asObservable();
	}

	/**
	 * Returns the current cx level
	 * @returns the observable representing the cx level
	 */
	public getCXLevel (): Observable<number> {
		return this.cxLevel.asObservable();
	}

	/**
	 * Returns the current solution
	 * @returns the observable representing the solution
	 */
	public getSolution (): Observable<string> {
		return this.solution.asObservable();
	}

	/**
	 * Returns the current use case
	 * @returns the observable representing the use case
	 */
	public getUseCase (): Observable<string> {
		return this.useCase.asObservable();
	}

	/**
	 * Returns the current user role
	 * @returns the observable representing the user role
	 */
	public getRole (): Observable<string> {
		return this.role.asObservable();
	}

	/**
	 * Function used to resolve a user
	 * @returns the user
	 */
	public resolve (): Observable<User> {
		if (this.cachedUser) {
			return of(this.cachedUser);
		}

		return this.entitlementWrapperService.userAccounts({ accountType: 'CUSTOMER' })
		.pipe(
			mergeMap((account: UserEntitlement) => {
				this.customerId.next(_.get(account, 'customerId'));
				const activeSmartAccountId = window.localStorage.getItem('activeSmartAccount');
				if (activeSmartAccountId) {
					this.smartAccount = _.find(_.get('account', 'companyList', []), {
						companyId: activeSmartAccountId,
					});
				} else {
					this.smartAccount = _.get(account, ['companyList', 0]);
				}

				return this.getAccountInfo(account);
			}),
			catchError(err => {
				this.logger.error('user-resolve : loadUser() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.cuiModalService.showComponent(UnauthorizedUserComponent, { });

				return of(null);
			}),
		);
	}

	/**
	 * Fetches additional user info for the account
	 * @param account the user account to fetch additional info for
	 * @returns the user
	 */
	private getAccountInfo (account: UserEntitlement):
		Observable<User> {
		return this.orgUserService.getUserV2({
			customerId: `${this.smartAccount.companyId}:0`,
			saId: `${this.smartAccount.companyId}`,
			vaId: 0,
		})
		.pipe(
			map((response: OrgUserResponse) => {
				this.cachedUser = {
					info: {
						...account,
						...response,
					},
					service: _.get(response, 'subscribedServiceLevel'),
				};

				this.user.next(this.cachedUser);
				const { cxLevel, useCase, solution } = _.get(this.cachedUser, 'service');

				this.cxLevel.next(cxLevel);
				this.useCase.next(useCase);
				this.solution.next(solution);
				this.role.next(_.get(response, ['individualAccount', 'role']));

				return this.cachedUser;
			}),
			catchError(err => {
				this.logger.error('user-resolve : getAccountInfo() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}
}
