
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EntitlementService, EntitledUser, ServiceInfoResponse } from '@sdp-api';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { User } from '@interfaces';
import * as _ from 'lodash-es';

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
	private cxLevel = new ReplaySubject<number>(1);
	private solution = new ReplaySubject<string>(1);
	private useCase = new ReplaySubject<string>(1);

	constructor (
		private entitlementService: EntitlementService,
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
	 * Function used to resolve a user
	 * @returns the user
	 */
	public resolve (): Observable<User> {
		if (this.cachedUser) {
			return of(this.cachedUser);
		}

		return this.entitlementService.getUser()
		.pipe(
			mergeMap((user: EntitledUser) => {
				this.customerId.next(_.get(user, 'customerId'));

				return this.getServiceInfo(user);
			}),
			catchError(err => {
				this.logger.error('user-resolve : loadUser() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetches the service info for the user
	 * @param user the user to fetch the service info for
	 * @returns the user
	 */
	private getServiceInfo (user: EntitledUser):
		Observable<User> {
		return this.entitlementService.getServiceInfo(_.get(user, 'customerId'))
		.pipe(
			map((response: ServiceInfoResponse) => {
				this.cachedUser = {
					info: user,
					service: _.head(response),
				};

				this.user.next(this.cachedUser);
				const { cxLevel, useCase, solution } = _.get(this.cachedUser, 'service');

				this.cxLevel.next(cxLevel);
				this.useCase.next(useCase);
				this.solution.next(solution);

				return this.cachedUser;
			}),
			catchError(err => {
				this.logger.error('user-resolve : getServiceInfo() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}
}
