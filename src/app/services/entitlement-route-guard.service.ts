import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { EntitlementUtilityService } from '../services/entitlement-utility.service';
import { Subscription, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

/**
 * RouteGuard to allow navigation or denial or navigation based on the `whitelistRoles` and `blacklistRoles` lists
 * and `cxLevel` against the users role and level. Both roles and levels are optional but one must be specified.
 * `whitelistRoles` and `blacklistRoles` are exclusive of each other and can only be used one at a time.
 *
 * Usage:
 * data: {
 *  auth: {
 *    whitelistRoles?,
 *    blacklistRoles?,
 *    cxLevel?
 *    redirectUrl?
 *   }
 * }
 *
 */
@Injectable()
export class EntitlementRouteAuthService implements CanActivate, OnDestroy {
	private entitlementUtilSubscription: Subscription;

	constructor (
		private entitlementUtil: EntitlementUtilityService,
		private router: Router,
	) { }

	/**
	 * canActivate
	 *
	 * You must pass one of, or both, whitelistRoles/blacklistroles and optional redirectUrl in case
	 * the user is not authorzied
	 * {
	 * 		whitelistRoles?: string[] | string,
	 * 		blacklistRoles?: string[] | string,
	 * 		cxLevel?: number,
	 * 		redirectUrl?: string
	 * }
	 *
	 * @param route route passed in to be completed if true is returned
	 * @returns Observable that resolves to a boolean
	 */
	public canActivate = (route: ActivatedRouteSnapshot): Observable<boolean> => {
		const { data: { auth: { whitelistRoles, blacklistRoles, cxLevel, redirectUrl } } } = route;

		return this.entitlementUtil
				.getUserCheckLevelAndRole({
					cxLevel,
					whitelistRoles,
					blacklistRoles,
				})
				.pipe(
					first(),
					map(({ isAuthorized }) => {
						if (!isAuthorized && redirectUrl) {
							 this.router.navigateByUrl(redirectUrl);
						}

						return isAuthorized;
					}),
				);
	 }

	 public ngOnDestroy (): void {
		 this.entitlementUtilSubscription.unsubscribe();
	 }
}
