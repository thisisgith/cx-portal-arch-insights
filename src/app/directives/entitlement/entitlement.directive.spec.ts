import { configureTestSuite } from 'ng-bullet';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { EntitlementDirective } from './entitlement.directive';
import { EntitlementUtilityService } from '../../services/entitlement-utility.service';
import { UserRoles } from '@constants';
import { Observable } from 'rxjs';
import { RoleListsAndLevel, CheckRoleLevelReturn } from '../../interfaces/entitlement';

const testUser = {
	cxLevel: 0,
	role: UserRoles.USER,
};

const template =  `
<p *auth="rolesAndLevel">
	Authorized
</p>`;

/**
 * Test component with mock users role and level
 */
@Component({
	template,
})
class TestComponentAuthorized {
	public rolesAndLevel: RoleListsAndLevel = {
		whitelistRoles: UserRoles.USER,
		cxLevel: 0,
	};
}

/**
 * Test component with same level and different role than mock user
 */
@Component({
	template,
})
class TestComponentUnAuthorizedWhitelist {
	public rolesAndLevel: RoleListsAndLevel = {
		whitelistRoles: UserRoles.ADMIN,
		cxLevel: 2,
	};
}

@Component({
	template,
})
class TestComponentUnAuthorizedBlacklist {
	public rolesAndLevel: RoleListsAndLevel = {
		blacklistRoles: UserRoles.USER,
		cxLevel: 0,
	};
}

@Component({
	template,
})
class TestComponentAuthorizedBlacklist {
	public rolesAndLevel: RoleListsAndLevel = {
		blacklistRoles: UserRoles.ADMIN,
		cxLevel: 0,
	};
}

/**
 * Test component with higher level and same role than mock user
 */
@Component({
	template,
})
class TestComponentUnAuthorizedLevel {
	public rolesAndLevel: RoleListsAndLevel = {
		whitelistRoles: UserRoles.USER,
		cxLevel: 4,
	};
}

describe('EntitlementDirective', () => {
	let fixture: ComponentFixture<any>;
	let component: TestComponentAuthorized
		| TestComponentUnAuthorizedWhitelist
		| TestComponentUnAuthorizedLevel
		| TestComponentUnAuthorizedBlacklist
		| TestComponentAuthorizedBlacklist;
	let element: any;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponentAuthorized,
				TestComponentUnAuthorizedWhitelist,
				TestComponentUnAuthorizedLevel,
				TestComponentAuthorizedBlacklist,
				TestComponentUnAuthorizedBlacklist,
				EntitlementDirective,
			],
			providers: [{
				provide: EntitlementUtilityService,
				useValue: {
					getUserCheckLevelAndRole: ({
						whitelistRoles,
						blacklistRoles,
						cxLevel,
					}) => new Observable<CheckRoleLevelReturn>(observer => {
						const output = {
							role: '',
							isAuthorized: false,
						};
						const { role: userRole, cxLevel: userLevel } = testUser;
						output.role = userRole;

						if (whitelistRoles) {
							output.isAuthorized = (userRole === whitelistRoles && userLevel >= cxLevel);
						}

						if (blacklistRoles) {
							output.isAuthorized = (userRole !== blacklistRoles && userLevel >= cxLevel);
						}

						observer.next(output);
					}),
				},
			}],
		});
	});

	it('should create an component', () => {
		fixture = TestBed.createComponent(TestComponentAuthorized);
		component = fixture.componentInstance;

		expect(component)
			.toBeDefined();
	});

	it('should create an element with the correct role passed in from the user data', () => {
		fixture = TestBed.createComponent(TestComponentAuthorized);
		fixture.detectChanges();

		element = fixture.nativeElement;
		expect(element.innerHTML)
			.toContain('Authorized');
	});

	it('should not create an element with wrong role passed in from the user data', () => {
		fixture = TestBed.createComponent(TestComponentUnAuthorizedWhitelist);
		fixture.detectChanges();

		element = fixture.nativeElement;
		expect(element.innerHTML)
			.not
			.toContain('Authorized');
	});
	it('should not create an element with wrong level passed in from the user data', () => {
		fixture = TestBed.createComponent(TestComponentUnAuthorizedLevel);
		fixture.detectChanges();

		element = fixture.nativeElement;
		expect(element.innerHTML)
			.not
			.toContain('Authorized');
	});

	it('should not create an element with blacklisted role passed in from the user data', () => {
		fixture = TestBed.createComponent(TestComponentUnAuthorizedBlacklist);
		fixture.detectChanges();

		element = fixture.nativeElement;
		expect(element.innerHTML)
			.not
			.toContain('Authorized');
	});

	it('should create an element with a different role blacklisted from the user data', () => {
		fixture = TestBed.createComponent(TestComponentAuthorizedBlacklist);
		fixture.detectChanges();

		element = fixture.nativeElement;
		expect(element.innerHTML)
			.toContain('Authorized');
	});
});
