import { UserResolve } from './user-resolve';
import { mappedUser, accountsResponseMock, v2UserResponseMock } from '@mock';
import { UserEntitlement, OrgUserResponse } from '@sdp-api';
import { of, Observable, throwError } from 'rxjs';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { ACTIVE_SMART_ACCOUNT_KEY, UserRoles } from '@constants';

describe('UserResolve', () => {
	let userResolve: UserResolve;
	const fakeEntitlementWrapperService = {
	  userAccounts (_: any): Observable<UserEntitlement> {

		  return of(accountsResponseMock);
	  },
	};
	const fakeOrgUserService = {
		getUserV2 (_: any): Observable<OrgUserResponse[]> {
			return of(v2UserResponseMock);
		},
	};
	const fakeCuiModalService = {
		// tslint:disable-next-line
		showComponent (_: any, data: any) {
			return new Promise(jest.fn());
		},
	};
	const fakeLoggerService = {
		// tslint:disable-next-line
		error (message) {}
	};
	const user = mappedUser;

	beforeEach(() => {
		userResolve = new UserResolve(
		<CuiModalService> fakeCuiModalService,
		<any> fakeEntitlementWrapperService,
		<any> fakeOrgUserService,
		<LogService> fakeLoggerService,
	);
	});

	it('should resolve to a user by calling resolve method', done => {
		userResolve
		.resolve()
		.subscribe(u => {
			expect(u)
		  .toEqual(user);

			done();
		});
	});

	it('should resolve to a cached user', done => {
		const spy = jest.spyOn(fakeEntitlementWrapperService, 'userAccounts');
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.resolve()
			.subscribe(u => {
				expect(spy)
		  .toBeCalledTimes(1);

				expect(u)
		  .toEqual(mappedUser);
				done();
			});
		});
	});

	it('should fail gracefully when resolving userAccounts', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest
		.spyOn(fakeEntitlementWrapperService, 'userAccounts')
		.mockImplementationOnce(() => {
			return throwError(error);
		});

		userResolve
		.resolve()
		.subscribe(u => {
			expect(u)
		.toBeNull();

			done();
		});
	});

	it('should fail gracefully when resolving getUserV2', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest
	  .spyOn(fakeOrgUserService, 'getUserV2')
	  .mockImplementationOnce(() => {

		return throwError(error);
	});

		userResolve
		.resolve()
		.subscribe(u => {
			expect(u)
		.toBeNull();

			done();
		});
	});

	it('should resolve a customerId', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getCustomerId()
			.subscribe((id: string) => {
				expect(id)
		.toEqual(mappedUser.info.customerId);

				done();
			});
		});
	});

	it('should resolve a user by calling getUser method', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getUser()
			.subscribe((u: any) => {
				expect(u)
		.toEqual(mappedUser);

				done();
			});
		});
	});

	it('should resolve a cxLevel', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getCXLevel()
			.subscribe((n: number) => {
				expect(n)
		.toEqual(Number(mappedUser.service.cxLevel));

				done();
			});
		});
	});

	it('should resolve a role', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getRole()
			.subscribe((s: string) => {
				expect(s)
		.toEqual(mappedUser.info.individualAccount.role);

				done();
			});
		});
	});

	it('should resolve an sa id', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getSaId()
			.subscribe((n: number) => {
				expect(n)
		.toEqual(mappedUser.info.companyList[0].companyId);

				done();
			});
		});
	});

	it('should resolve a data center', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getDataCenter()
			.subscribe((s: string) => {
				expect(s)
		.toEqual(mappedUser.info.dataCenter.dataCenter);

				done();
			});
		});
	});

	it('should set the sa id', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve.setSaId(mappedUser.info.companyList[0].companyId);
			userResolve
			.getSaId()
			.subscribe((n: number) => {
				expect(n)
		.toEqual(mappedUser.info.companyList[0].companyId);

				done();
			});
		});
	});

	it('should resolve a valid sa id from local storage', done => {
		window.localStorage.setItem(ACTIVE_SMART_ACCOUNT_KEY, `${mappedUser.info.companyList[1].companyId}`);

		userResolve
		.resolve()
		.subscribe(() => {
			userResolve.getSaId()
		.subscribe((n: number) => {
			expect(n)
		.toEqual(mappedUser.info.companyList[1].companyId);

			done();
		});
		});
	});

	it('should refine the roleList resolve the role', done => {
		userResolve
		.resolve()
		.subscribe(() => {
			userResolve
			.getRole()
			.subscribe((s: string) => {
				expect(s)
				.toEqual(UserRoles.SA_ADMIN);

				done();
			});
		});
	});
});
