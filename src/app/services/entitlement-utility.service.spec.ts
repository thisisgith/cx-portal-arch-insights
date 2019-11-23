import { TestBed } from '@angular/core/testing';
import { userRoles } from '@constants';
import { EntitlementUtilityService } from './entitlement-utility.service';
import { UserResolve } from '@utilities';
import { Observable } from 'rxjs';

const testUser = {
	info: {
		individual: {
			role: userRoles.ADMIN,
		},
	},
	service: {
		cxLevel: 3,
	},
};

describe('EntitlementUtilityService', () => {
	let service: EntitlementUtilityService;

	beforeEach(() =>  {
		TestBed.configureTestingModule({
			providers: [{
				provide: UserResolve,
				useValue: {
					getUser: () => new Observable<{ }>(observer => {
						observer.next(testUser);
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
			whitelistRoles: userRoles.ADMIN,
			userRole: userRoles.ADMIN,
		});
		expect(authorized)
			.toEqual(true);
	});

	it(`should disallow a string with an unauthorized
		userRole checked against an authorized role string`, () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: userRoles.ADMIN,
			userRole: userRoles.USER,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should allow a userRole checked against an authorized roles array', () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: [userRoles.ADMIN, userRoles.USER],
			userRole: userRoles.ADMIN,
		});
		expect(authorized)
			.toEqual(true);
	});

	it('should disallow an unauthorized userRole checked against an authorized roles array', () => {
		const authorized = service.checkRoleAndLevel({
			whitelistRoles: [userRoles.PARTNER, userRoles.ADMIN],
			userRole: userRoles.USER,
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
			whitelistRoles: userRoles.ADMIN,
			userLevel: 3,
			userRole: userRoles.ADMIN,
		});
		expect(authorized)
			.toEqual(true);
	});

	it(`should disallow a higher userLevel against an authorized cx level,
		and an unauthorized userRole against and authorized role`, () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: userRoles.USER,
			userLevel: 3,
			userRole: userRoles.ADMIN,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should disallow a userLevel against an authorized cx level, and allowed userRole against and authorized role', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: userRoles.ADMIN,
			userLevel: 0,
			userRole: userRoles.ADMIN,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should disallow a lower userLevel against an authorized cx level, and unauthorized userRole against and authorized role', () => {
		const authorized = service.checkRoleAndLevel({
			cxLevel: 1,
			whitelistRoles: userRoles.ADMIN,
			userLevel: 0,
			userRole: userRoles.USER,
		});
		expect(authorized)
			.toEqual(false);
	});

	it('should have called checkRoleAndLevel', done => {
		const whitelistRoles = testUser.info.individual.role;
		const { cxLevel } = testUser.service;

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
		const whitelistRoles = testUser.info.individual.role;
		const { cxLevel } = testUser.service;

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
		const blacklistRoles = testUser.info.individual.role;

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
		const blacklistRoles = userRoles.PARTNER;
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
		const blacklistRoles = [userRoles.PARTNER, testUser.info.individual.role];
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
		const whitelistRoles = userRoles.ADMIN;
		const blacklistRoles = userRoles.USER;

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
