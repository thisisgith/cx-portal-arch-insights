
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EntitlementWrapperService, UserEntitlement, OrgUserService, OrgUserResponse, Company, Role } from '@sdp-api';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { User } from '@interfaces';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import {
	UnauthorizedUserComponent,
} from '../components/unauthorized-user/unauthorized-user.component';
import { INTERIM_VA_ID, DEFAULT_DATACENTER, UserRoles } from '@constants';

/**
 * Resolver to fetch our user
 */
@Injectable({
	providedIn: 'root',
})
export class UserResolve implements Resolve<any> {

	private cachedUser: User;
	private companyList: Company[];
	private smartAccount: Company;
	private customerId = new ReplaySubject<string>(1);
	private user = new ReplaySubject<User>(1);
	private saId = new ReplaySubject<number>(1);
	private vaId = new ReplaySubject<number>(1);
	private cxLevel = new ReplaySubject<number>(1);
	private role = new ReplaySubject<string>(1);
	private dataCenter = new ReplaySubject<string>(1);
	// TODO: Remove `roleList` when `mapUserResponse` logic is deprecated
	private roleList = new ReplaySubject<Role[]>(1);

	constructor (
		private cuiModalService: CuiModalService,
		private entitlementWrapperService: EntitlementWrapperService,
		private orgUserService: OrgUserService,
		private logger: LogService,
	) {
		this.dataCenter.next(DEFAULT_DATACENTER);
	}

	public getCustomerId (): Observable<string> {
		return this.customerId.asObservable();
	}

	public getUser (): Observable<User> {
		return this.user.asObservable();
	}

	public getCXLevel (): Observable<number> {
		return this.cxLevel.asObservable();
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

	public getDataCenter (): Observable<string> {
		return this.dataCenter.asObservable();
	}

	/**
	 * Update the currently active smart account, set it to local storage
	 * and refresh the page
	 * @param saId the new smart asccount id to be set
	 */
	public setSaId (saId: number) {
		if (this.smartAccount.companyId === saId) {
			return;
		}

		const smartAccount = _.find(_.get(this.cachedUser, ['info', 'companyList'], []), {
			companyId: saId,
		});

		if (smartAccount) {
			this.saId.next(saId);
			this.customerId.next(`${saId}_${INTERIM_VA_ID}`);
			window.localStorage.setItem('activeSmartAccount', `${saId}`);
			window.location.reload();
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
				this.companyList = _.sortBy(account.companyList, 'companyName');

				const activeSmartAccountId = window.localStorage.getItem('activeSmartAccount');
				if (activeSmartAccountId) {
					this.smartAccount = _.find(this.companyList, {
						companyId: Number(activeSmartAccountId),
					}) || _.get(this.companyList, 0, { });
				} else {
					this.smartAccount = _.get(this.companyList, 0, { });
				}
				const saId = _.get(this.smartAccount, 'companyId');
				this.saId.next(saId);
				this.vaId.next(0);
				this.customerId.next(`${saId}_${INTERIM_VA_ID}`);

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
			customerId: `${saId}_${INTERIM_VA_ID}`,
			vaId: 0,
		})
		.pipe(
			map((userResponse: OrgUserResponse) => {
				this.dataCenter.next(_.get(userResponse, ['dataCenter', 'dataCenter'], DEFAULT_DATACENTER));
				this.cachedUser = {
					info: {
						...this.mapUserResponse(accountResponse, userResponse),
						companyList: this.companyList,
					},
					service: _.get(userResponse, 'subscribedServiceLevel'),
				};

				this.user.next(this.cachedUser);
				const { cxLevel } = _.get(this.cachedUser, 'service');
				this.cxLevel.next(Number(cxLevel));

				this.roleList = this.getRefinedRoleList(this.smartAccount.roleList);
				this.role.next(_.get(this.roleList, [0, 'roleName']));

				return this.cachedUser;
			}),
			catchError(err => {
				this.logger.error('user-resolve : getAccountInfo() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.cuiModalService.showComponent(UnauthorizedUserComponent, { });

				return of(null);
			}),
		);
	}

	/**
	 * Filter the invalid roles out and sort the valid ones by priority
	 * @param roleList the array of roles
	 * @returns the refined roleList
	 */
	private getRefinedRoleList (roleList: Role[]) {
		if (roleList.length < 1) {
			return [];
		}

		const priorityOrder: Role['roleName'][] = [UserRoles.ADMIN, UserRoles.USER];
		const roleListFiltered = roleList.filter(role => priorityOrder.includes(role.roleName));

		return _.sortBy(roleListFiltered, role => priorityOrder.indexOf(role.roleName));
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
			saId: smartAccount.companyId,
			customerId: `${smartAccount.companyId}_${INTERIM_VA_ID}`,
			individual: {
				name: accountUser.firstName,
				familyName: accountUser.lastName,
				emailAddress: accountUser.emailId,
				ccoId: userResponse.individualAccount.ccoId,
				cxBUId: userResponse.cxBUId,
				role: _.get(this.getRefinedRoleList(this.smartAccount.roleList), ['0', 'roleName']),
			},
			account: userResponse.account,
			subscribedSolutions: {
				cxLevel: _.get(userResponse, ['subscribedServiceLevel', 'cxLevel']),
			},
		};
	}
}
