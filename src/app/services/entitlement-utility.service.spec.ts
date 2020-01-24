import { TestBed } from '@angular/core/testing';
import { UserRoles } from '@constants';
import { EntitlementUtilityService } from './entitlement-utility.service';
import { UserResolve } from '@utilities';
import { Observable } from 'rxjs';

const testCxLevel = 3;
const testRole = UserRoles.SA_ADMIN;

describe('EntitlementUtilityService', () => {
	let service: EntitlementUtilityService;

	beforeEach(() =>  {
		TestBed.configureTestingModule({
			providers: [{
				provide: UserResolve,
				useValue: {
					getCXLevel: () => new Observable<{ }>(observer => {
						observer.next(testCxLevel);
					}),
					getRole: () => new Observable<{ }>(observer => {
						observer.next(testRole);
					}),
				},
			}],
		});
		service = TestBed.get(EntitlementUtilityService);
	});

	it('should create a service', () => {
		expect(service)
				.toBeTruthy();
	});

	it('should allow a userRole checked against an authorized role string', () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: UserRoles.SA_ADMIN,
			userRole: UserRoles.SA_ADMIN,
		});
		expect(authorized)
			.toEqual(true);
	});

	it(`should disallow a string with an unauthorized
		userRole checked against an authorized role string`, () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: UserRoles.SA_ADMIN,
			userRole: UserRoles.SA_FULLUSER,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should allow a userRole checked against an authorized roles array', () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: [UserRoles.SA_ADMIN, UserRoles.SA_FULLUSER],
			userRole: UserRoles.SA_ADMIN,
		});
		expect(authorized)
			.toEqual(true);
	});

	it('should disallow an unauthorized userRole checked against an authorized roles array', () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: [UserRoles.PARTNER, UserRoles.SA_ADMIN],
			userRole: UserRoles.SA_FULLUSER,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should allow a higher userLevel against an authorized cx level', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			userLevel: 3,
		});
		expect(authorized)
			.toEqual(true);
	});

	it('should allow a similar userLevel against an authorized cx level', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			userLevel: 1,
		});
		expect(authorized)
			.toEqual(true);
	});

	it('should disallow an lower userLevel against an authorized cx level', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			userLevel: 0,
		});
		expect(authorized)
			.toEqual(false);
	});

	it(`should allow a higher userLevel against an authorized cx level,
		and allowed userRole against and authorized role`, () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: UserRoles.SA_ADMIN,
			userLevel: 3,
			userRole: UserRoles.SA_ADMIN,
		});
		expect(authorized)
			.toEqual(true);
	});

	it(`should disallow a higher userLevel against an authorized cx level,
		and an unauthorized userRole against and authorized role`, () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: UserRoles.SA_FULLUSER,
			userLevel: 3,
			userRole: UserRoles.SA_ADMIN,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should disallow a userLevel against an authorized cx level, and allowed userRole against and authorized role', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: UserRoles.SA_ADMIN,
			userLevel: 0,
			userRole: UserRoles.SA_ADMIN,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should disallow a lower userLevel against an authorized cx level, and unauthorized userRole against and authorized role', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: UserRoles.SA_ADMIN,
			userLevel: 0,
			userRole: UserRoles.SA_FULLUSER,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should have called checkRoleAndLevel', done => {
		const whitelistRoles = testRole;
		const cxLevel = testCxLevel;

		spyOn(service, 'checkRoleAndLevel');

		const subscription = service.getUserCheckLevelAndRole({ whitelistRoles, cxLevel });
		subscription.subscribe(
			() => {
				expect(service.checkRoleAndLevel)
					.toHaveBeenCalled();
				done();
			},
			() => done.fail(),
		);
	});

	it('should return get user and return authorized or unauthorized for whitelistRoles', done => {
		const whitelistRoles = testRole;
		const cxLevel = testCxLevel;

		const subscription = service.getUserCheckLevelAndRole({ whitelistRoles, cxLevel });
		subscription.subscribe(
			({ isAuthorized }) => {
				expect(isAuthorized)
		 			.toEqual(true);
				done();
			},
			() => done.fail(),
		);
	});

	it('should return get user and return unauthorized for blacklisted role', done => {
		const blacklistRoles = testRole;

		const subscription = service.getUserCheckLevelAndRole({ blacklistRoles });
		subscription.subscribe(
			({ isAuthorized }) => {
				expect(isAuthorized)
		 			.toEqual(false);
				done();
			},
			() => done.fail(),
		);
	});

	it('should return get user and return authorized for blacklisted role not the same as user and correct cxLevel', done => {
		const blacklistRoles = UserRoles.PARTNER;
		const cxLevel = 0;

		const subscription = service.getUserCheckLevelAndRole({ blacklistRoles, cxLevel });
		subscription.subscribe(
			({ isAuthorized }) => {
				expect(isAuthorized)
		 			.toEqual(true);
				done();
			},
			() => done.fail(),
		);
	});

	it('should return get user and return unauthorized for blacklisted role as user in array', done => {
		const blacklistRoles = [UserRoles.PARTNER, testRole];
		const cxLevel = 0;

		const subscription = service.getUserCheckLevelAndRole({ blacklistRoles, cxLevel });
		subscription.subscribe(
			({ isAuthorized }) => {
				expect(isAuthorized)
		 			.toEqual(false);
				done();
			},
			() => done.fail(),
		);
	});

	it('should throw an error if no arguments are provided', done => {
		service.getUserCheckLevelAndRole()
			.subscribe(
				results => done.fail(`${results} was returned instead of an error`),
				err => {
					expect(err)
					.toEqual(
						// tslint:disable-next-line: ter-max-len
						new Error('Please provide the correct inputs { whitelistRoles?: string[] | string, blacklistRoles?: string[] | string, cxLevel?: number }'),
					);
					done();
				},
		);
	});

	it('should throw an error if roles lists and/or cxLevel are not provided', done => {
		service.getUserCheckLevelAndRole({ })
		.subscribe(
			results => done.fail(`${results} was returned instead of an error`),
			err => {
				expect(err)
				.toEqual(
					// tslint:disable-next-line: ter-max-len
					new Error('Please provide the correct inputs { whitelistRoles?: string[] | string, blacklistRoles?: string[] | string, cxLevel?: number }'),
				);
				done();
			},
		);
	});

	it('should throw an error if both whitelistRoles and blacklistRoles are provided',  done => {
		const whitelistRoles = UserRoles.SA_ADMIN;
		const blacklistRoles = UserRoles.SA_FULLUSER;

		service.getUserCheckLevelAndRole({ whitelistRoles, blacklistRoles })
		.subscribe(
			results => done.fail(`${results} was returned instead of an error`),
			err => {
				expect(err)
				.toEqual(
					// tslint:disable-next-line: ter-max-len
					new Error('`whiteListRole` or `blacklistRoles` may only be used exclusive of each other'),
				);
				done();
			},
		);
	});
});
