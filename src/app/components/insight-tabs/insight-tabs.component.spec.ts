import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightTabsComponent } from './insight-tabs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InsightTabsModule } from './insight-tabs.module';
import { RouteAuthService } from '@services';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('InsightTabsComponent', () => {
	let component: InsightTabsComponent;
	let fixture: ComponentFixture<InsightTabsComponent>;
	let routeAuthService: RouteAuthService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				InsightTabsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [RouteAuthService],
		});
	});

	beforeEach(() => {
		routeAuthService = TestBed.get(RouteAuthService);
		fixture = TestBed.createComponent(InsightTabsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it('should throw errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(routeAuthService, 'checkArchitecturePermissions')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
		);
		component.canActivate();
		expect(component.enableArchitectureTab)
		.toBeTruthy();
		expect(component.enableConfigurationTab)
		.toBeTruthy();
		expect(component.enableSystemEventsTab)
		.toBeTruthy();
	});

	it('should call canActivate', () => {

		const response = {
			architectureReviewUIEnabled: true,
			configurationUIEnabled: true,
			syslogUIEnabled: true,
		};

		spyOn(routeAuthService, 'checkArchitecturePermissions')
			.and
			.returnValue(of(response));
		component.canActivate();
		expect(routeAuthService.checkArchitecturePermissions)
			.toHaveBeenCalled();
		expect(component.enableArchitectureTab)
		.toBeTruthy();
		expect(component.enableConfigurationTab)
		.toBeTruthy();
		expect(component.enableSystemEventsTab)
		.toBeTruthy();
	});

	it('should not call canActivate', () => {

		const response = null;

		spyOn(routeAuthService, 'checkArchitecturePermissions')
			.and
			.returnValue(of(response));
		component.canActivate();
		expect(routeAuthService.checkArchitecturePermissions)
			.toHaveBeenCalled();
	});
});
