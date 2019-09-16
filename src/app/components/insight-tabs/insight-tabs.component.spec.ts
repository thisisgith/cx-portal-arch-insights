import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightTabsComponent } from './insight-tabs.component';
import { RouteAuthService } from '@services';
import { UserResolve } from '@utilities';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InsightTabsModule } from './insight-tabs.module';

describe('InsightTabsComponent', () => {
	let component: InsightTabsComponent;
	let fixture: ComponentFixture<InsightTabsComponent>;
	let routeAuthService: RouteAuthService;
	let userResolve: UserResolve;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				InsightTabsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InsightTabsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		routeAuthService = TestBed.get(RouteAuthService);
		userResolve = TestBed.get(UserResolve);
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it('should return true if the user has permission', () => {
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(of(true));
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.hasPermission)
			.toBeTruthy();
	});

	it('should return false and re-route to  risk mitigation', () => {
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(of(false));
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.hasPermission)
			.toBeFalsy();
	});

	it('should should set hasPermission false if error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.hasPermission)
			.toBeFalsy();
	});
});
