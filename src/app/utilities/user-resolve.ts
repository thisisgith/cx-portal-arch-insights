
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
	private smartAccount: SmartAccount;
	private customerId = new ReplaySubject<string>(1);
	private user = new ReplaySubject<User>(1);
	private saId = new ReplaySubject<number>(1);
	private vaId = new ReplaySubject<number>(1);
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

	public getCustomerId (): Observable<string> {
		return this.customerId.asObservable();
	}

	public getUser (): Observable<User> {
		return this.user.asObservable();
	}

	public getCXLevel (): Observable<number> {
		return this.cxLevel.asObservable();
	}

	public getSolution (): Observable<string> {
		return this.solution.asObservable();
	}

	public getUseCase (): Observable<string> {
		return this.useCase.asObservable();
	}

	public getRole (): Observable<string> {
		return this.role.asObservable();
	}

	public getSaId (): Observable<number> {
		return this.saId.asObservable();
	}

	public getVaId (): Observable<number> {
		return this.vaId.asObservable();
	}

	public setSaId (saId: number) {
		const smartAccount = _.find(_.get(this.cachedUser, ['info', 'companyList'], []), {
			companyId: saId,
		});

		if (smartAccount) {
			this.saId.next(saId);
			this.customerId.next(`${saId}:0`);
			window.localStorage.setItem('activeSmartAccount', `${saId}`);
		}
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
				const activeSmartAccountId = window.localStorage.getItem('activeSmartAccount');
				if (activeSmartAccountId) {
					this.smartAccount = _.find(_.get('account', 'companyList', []), {
						companyId: activeSmartAccountId,
					});
				} else {
					this.smartAccount = _.get(account, ['companyList', 0]);
				}
				const saId = _.get(this.smartAccount, 'companyId');
				this.saId.next(saId);
				this.vaId.next(0);
				this.customerId.next(`${saId}:0`);

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
	 * @param accountResponse the user account to fetch additional info for
	 * @returns the user
	 */
	private getAccountInfo (accountResponse: UserEntitlement):
		Observable<User> {
		const saId = _.get(this.smartAccount, 'companyId');

		return this.orgUserService.getUserV2({
			saId,
			customerId: `${saId}:0`,
			vaId: 0,
		})
		.pipe(
			map((userResponse: OrgUserResponse) => {
				this.cachedUser = {
					info: this.mapUserResponse(accountResponse, userResponse),
					service: _.get(userResponse, 'subscribedServiceLevel'),
				};

				this.user.next(this.cachedUser);
				const { cxLevel, useCase, solution } = _.get(this.cachedUser, 'service');

				this.cxLevel.next(cxLevel);
				this.useCase.next(useCase);
				this.solution.next(solution);
				this.role.next(_.get(userResponse, ['individualAccount', 'role']));

				return this.cachedUser;
			}),
			catchError(err => {
				this.logger.error('user-resolve : getAccountInfo() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Temporary method to keep user response backward-compatible.
	 * Maps data from `accounts` and `v2/user` APIs to match the old user obj.
	 * @param accountResponse the response from `/accounts`
	 * @param userResponse the response from `v2/user`
	 * @returns the user
	 */
	private mapUserResponse (accountResponse: UserEntitlement, userResponse: OrgUserResponse) {
		const smartAccount = this.smartAccount;
		const accountUser = _.get(accountResponse, 'user', { });

		return {
			...accountResponse,
			...userResponse,
			name: smartAccount.companyName,
			customerId: `${smartAccount.companyId}`,
			individual: {
				name: accountUser.firstName,
				familyName: accountUser.lastName,
				emailAddress: accountUser.emailId,
				ccoId: userResponse.individualAccount.ccoId,
				cxBUId: userResponse.individualAccount.cxBUId,
				role: userResponse.individualAccount.role,
			},
			account: userResponse.account,
			subscribedSolutions: {
				cxLevel: _.get(userResponse, ['subscribedServiceLevel', 'cxLevel']),
			},
		};
	}
}
