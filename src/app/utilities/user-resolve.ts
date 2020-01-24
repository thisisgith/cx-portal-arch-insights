
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EntitlementWrapperService, UserEntitlement, OrgUserService, OrgUserResponse, Company, Role } from '@sdp-api';
import { Observable, of, ReplaySubject, throwError, forkJoin, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { User } from '@interfaces';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	UnauthorizedUserComponent,
} from '../components/unauthorized-user/unauthorized-user.component';
import { INTERIM_VA_ID, DEFAULT_DATACENTER, ACTIVE_SMART_ACCOUNT_KEY, UserRoles } from '@constants';

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
	private vaId = new ReplaySubject<string>(1);
	private cxLevel = new ReplaySubject<number>(1);
	private role = new ReplaySubject<string>(1);
	private dataCenter = new ReplaySubject<string>(1);
	private userSelectedDataCenter = new ReplaySubject<string>(1);
	private isUserCompletedStep = new BehaviorSubject<boolean>(false);
	// TODO: Remove `roleList` when `mapUserResponse` logic is deprecated
	private roleList: Role[] = [];
	public isIEsetupCompleted: boolean;

	constructor (
		private cuiModalService: CuiModalService,
		private entitlementWrapperService: EntitlementWrapperService,
		private orgUserService: OrgUserService,
		private logger: LogService,
	) {
		this.dataCenter.next(DEFAULT_DATACENTER);
		this.userSelectedDataCenter.next(DEFAULT_DATACENTER);
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

	public getVaId (): Observable<string> {
		return this.vaId.asObservable();
	}

	public getDataCenter (): Observable<string> {
		return this.dataCenter.asObservable();
	}

	// public setDataCenter (dataCenter: string) {
	// 	this.dataCenter.next(dataCenter);
	// }

	public setUserSelectedDataCenter (dataCenter: string) {
		this.userSelectedDataCenter.next(dataCenter);
	}

	public getUserSelectedDataCenter (): Observable<string> {
		return this.userSelectedDataCenter.asObservable();
	}

	public setUserSteps (steps: boolean) {
		this.isUserCompletedStep.next(steps);
	}

	public getUserSteps (): Observable<boolean> {
		return this.isUserCompletedStep.asObservable();
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
			window.localStorage.setItem(ACTIVE_SMART_ACCOUNT_KEY, `${saId}`);
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
			catchError(err => {
				this.logger.error(`Failed fetching account information: ${err.message}`);
				this.cuiModalService.showComponent(UnauthorizedUserComponent, {
					message: I18n.get('_FailedAccountFetch_'),
				});
				err._modalShown = true;

				return throwError(err);
			}),
			switchMap((account: UserEntitlement) => {
				let saIdVaIdPairs = account.companyList.map(company => {
					return company.roleList.map(role => {
						return { saId: company.companyId, vaId: role.attribValue || 0 };
					});
				});
				saIdVaIdPairs = _.flatten(saIdVaIdPairs);

				return forkJoin([
					of(account),
					this.orgUserService.getUserV2({
						CXContext: JSON.stringify(saIdVaIdPairs),
						customerId: null,
						saId: null,
						vaId: null,
					}),
				]);
			}),
			catchError(err => {
				if (!err._modalShown) {
					this.logger.error(`Failed fetching filtered list of user details: ${err.message}`);
					this.cuiModalService.showComponent(UnauthorizedUserComponent, {
						message: I18n.get('_FailedUserDetailsFetch_'),
					});
				}

				return throwError(err);
			}),
			map(([account, validUsers]: [UserEntitlement, OrgUserResponse[]]) => {
				account.companyList = this.getRefinedCompanyList(account.companyList, validUsers);
				this.companyList = account.companyList;

				if (account.companyList.length === 0) {
					this.logger.error('Failed finding a company with valid roles');
					this.cuiModalService.showComponent(UnauthorizedUserComponent, {
						message: I18n.get('_FailedAccountFilter_'),
					});

					throw new Error(I18n.get('_FailedAccountFilter_'));
				}

				const activeSmartAccountId = window.localStorage.getItem(ACTIVE_SMART_ACCOUNT_KEY);
				if (activeSmartAccountId) {
					this.smartAccount = _.find(this.companyList, {
						companyId: Number(activeSmartAccountId),
					}) || _.get(this.companyList, 0, { });
				} else {
					this.smartAccount = _.get(this.companyList, 0, { });
				}

				const currentSaId = _.get(this.smartAccount, 'companyId');
				this.saId.next(currentSaId);
				this.customerId.next(`${currentSaId}_${INTERIM_VA_ID}`);

				this.roleList = this.smartAccount.roleList;
				const currentRole = this.roleList[0];
				const currentRoleDetails = validUsers.find(validUser => {
					return (
						validUser.individualAccount.saId === currentSaId.toString() &&
						validUser.individualAccount.vaId === currentRole.attribValue
					);
				});
				this.role.next(currentRole.roleName);
				this.vaId.next(currentRoleDetails.individualAccount.vaId || INTERIM_VA_ID.toString());

				let dataCenterValue = _.get(currentRoleDetails, ['dataCenter', 'dataCenter'], DEFAULT_DATACENTER);
				// handle null value when a new user logined in
				if (_.isNull(dataCenterValue)) {
					dataCenterValue = DEFAULT_DATACENTER;
				}
				this.dataCenter.next(dataCenterValue);
				this.userSelectedDataCenter.next(dataCenterValue);

				this.cachedUser = {
					info: {
						...this.mapUserResponse(account, currentRoleDetails),
						companyList: this.companyList,
					},
					service: _.get(currentRoleDetails, 'subscribedServiceLevel'),
				};

				this.user.next(this.cachedUser);
				const { cxLevel } = _.get(this.cachedUser, 'service');
				this.cxLevel.next(Number(cxLevel));

				return this.cachedUser;
			}),
			catchError(err => {
				this.logger.error('user-resolve : loadUser() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Filter the invalid companies out and sort alphabetically by company name
	 * @param companyList the array of roles
	 * @param validUsers the array of valid users returned by /v2/user
	 * @returns the refined companyList
	 */
	private getRefinedCompanyList (companyList: Company[], validUsers: OrgUserResponse[]): Company[] {
		const validSaIdVaIdPairs = validUsers.map(user => {
			return {
				saId: user.individualAccount.saId,
				vaId: user.individualAccount.vaId,
			};
		});

		// filter out SAs (companies) that were not returned from /v2/user
		let companyListFiltered = companyList.filter(company => {
			return validSaIdVaIdPairs.some(({ saId }) => company.companyId.toString() === saId);
		});

		// filter out roles (SA or VA roles) that:
		//   1. are not returned from /v2/user
		//   2. are not valid roles for this release
		companyListFiltered.forEach(company => {
			company.roleList = company.roleList.filter(role => {
				return validSaIdVaIdPairs.some(({ saId, vaId }) => {
					return company.companyId.toString() === saId && role.attribValue === vaId;
				});
			});

			company.roleList = this.getRefinedRoleList(company.roleList);
		});

		// an company is invalid if it has no valid roles
		companyListFiltered = companyListFiltered.filter(company => company.roleList.length > 0);

		return _.sortBy(companyListFiltered, 'companyName');
	}

	/**
	 * Filter the invalid roles out and sort the valid ones by priority
	 * @param roleList the array of roles
	 * @returns the refined roleList
	 */
	private getRefinedRoleList (roleList: Role[]): Role[] {
		if (roleList.length < 1) {
			return [];
		}

		const priorityOrder: string[] = [
			UserRoles.SA_ADMIN,
			UserRoles.VA_ADMIN,
			UserRoles.SA_FULLUSER,
			UserRoles.VA_FULLUSER,
		];

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
				role: _.get(this.smartAccount.roleList, ['0', 'roleName']),
			},
			account: userResponse.account,
			subscribedSolutions: {
				cxLevel: _.get(userResponse, ['subscribedServiceLevel', 'cxLevel']),
			},
		};
	}
}
