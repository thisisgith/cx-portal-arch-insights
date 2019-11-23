import { EntitlementRouteAuthService } from './entitlement-route-guard.service';
import { userRoles } from '@constants';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckRoleLevelReturn } from '@interfaces';

const testUser = {
	cxLevel: 0,
	role: userRoles.USER,
};

class MockRouter {
	public navigateByUrl = () => null;
}

describe('EntitlementRouteAuthService', () => {
	let authGuard: EntitlementRouteAuthService;
	let entitlementUtil;
	let router;
	let route;

	beforeEach(() => {
		entitlementUtil = {
			getUserCheckLevelAndRole: ({ whitelistRoles, blacklistRoles, cxLevel }) => new Observable<CheckRoleLevelReturn>(observer => {
				const { role: userRole, cxLevel: userLevel } = testUser;
				let isAuthorized = false;

				if (whitelistRoles
				&& whitelistRoles.includes(userRole)
				&&  userLevel >= cxLevel) {
					isAuthorized = true;
				}

				if (blacklistRoles
				&& !blacklistRoles.includes(userRole)) {
					isAuthorized = true;
				}

				observer.next({ isAuthorized, role: userRole });
			}),
		};

		router = new MockRouter();
		authGuard = new EntitlementRouteAuthService(entitlementUtil, router);
		route = new ActivatedRouteSnapshot();
	});

	it('should return true for a user with correct role and level', done => {
		const rolesLevelRedirect = {
			cxLevel: 0,
			redirectUrl: '/',
			whitelistRoles: [userRoles.USER],
		};

		route.data = {
			auth: rolesLevelRedirect,
		};

		authGuard.canActivate(route)
		.subscribe(
			authorized => {
				expect(authorized)
					.toEqual(true);
				done();
			},
				err => done.fail(err),
		);
	});

	it('should return false for a user with incorrect role and level', done => {
		const rolesLevelRedirect = {
			cxLevel: 3,
			redirectUrl: '/',
			whitelistRoles: [userRoles.ADMIN],
		};

		route.data = {
			auth: rolesLevelRedirect,
		};

		authGuard.canActivate(route)
		.subscribe(
			authorized => {
				expect(authorized)
					.toEqual(false);
				done();
			},
				err => done.fail(err),
		);
	});

	it('should send the router to redirect to the redirect url for a user with incorrect role and level', done => {
		const rolesLevelRedirect = {
			cxLevel: 3,
			redirectUrl: '/',
			whitelistRoles: [userRoles.ADMIN],
		};

		route.data = {
			auth: rolesLevelRedirect,
		};

		spyOn(router, 'navigateByUrl');

		authGuard.canActivate(route)
		.subscribe(
			() => {
				expect(router.navigateByUrl)
					.toHaveBeenCalledWith(rolesLevelRedirect.redirectUrl);
				done();
			},
				err => done.fail(err),
		);
	});

	it('should send the router to redirect to the redirect url for a user with blacklisted role', done => {
		const rolesLevelRedirect = {
			cxLevel: 3,
			redirectUrl: '/',
			blacklistRoles: [userRoles.USER],
		};

		route.data = {
			auth: rolesLevelRedirect,
		};

		spyOn(router, 'navigateByUrl');

		authGuard.canActivate(route)
		.subscribe(
			() => {
				expect(router.navigateByUrl)
					.toHaveBeenCalledWith(rolesLevelRedirect.redirectUrl);
				done();
			},
				err => done.fail(err),
		);
	});
});
