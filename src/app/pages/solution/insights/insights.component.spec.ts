import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsComponent } from './insights.component';
import { InsightsModule } from './insights.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OptimalSoftwareVersionComponent } from '../osv/osv.component';
import { RiskMitigationComponent } from '../risk-mitigation/risk-mitigation.component';
import { OptimalSoftwareVersionModule } from '../osv/osv.module';
import { RiskMitigationModule } from '../risk-mitigation/risk-mitigation.module';
import { of } from 'rxjs';
import { UserResolve } from '@utilities';
import { RouteAuthService } from '@services';

/**
 * class to mock router
 */

fdescribe('InsightsComponent', () => {
	let component: InsightsComponent;
	let fixture: ComponentFixture<InsightsComponent>;
	let routeAuthService: RouteAuthService;
	let userResolve: UserResolve;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				InsightsModule,
				OptimalSoftwareVersionModule,
				RiskMitigationModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([
					{
						component: OptimalSoftwareVersionComponent,
						path: 'solution/best-practices/osv',
					},
					{
						component: RiskMitigationComponent,
						path: 'solution/best-practices/risk-mitigation',
					},
				]),
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InsightsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		routeAuthService = TestBed.get(routeAuthService);
		userResolve = TestBed.get(UserResolve);
	});

	it('should create Insights component', () => {
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

		expect(component.hasPermission)
			.toBeFalsy();
	});
});
