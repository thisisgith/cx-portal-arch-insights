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

describe('InsightsComponent', () => {
	let component: InsightsComponent;
	let fixture: ComponentFixture<InsightsComponent>;

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
						path: 'solution/insights/osv',
					},
					{
						component: RiskMitigationComponent,
						path: 'solution/insights/risk-mitigation',
					},
				]),
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InsightsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create Insights component', () => {
		expect(component)
			.toBeTruthy();
	});
<<<<<<< HEAD

	// it('should return true if the user has permission', () => {
	// 	spyOn(routeAuthService, 'checkPermissions')
	// 		.and
	// 		.returnValue(of(true));
	// 	spyOn(userResolve, 'getCustomerId')
	// 		.and
	// 		.returnValue(of('1234'));
	// 	component.ngOnInit();
	// 	fixture.detectChanges();
	// 	expect(component.hasPermission)
	// 		.toBeTruthy();
	// });

	// it('should return false and re-route to  risk mitigation', () => {
	// 	spyOn(routeAuthService, 'checkPermissions')
	// 		.and
	// 		.returnValue(of(false));
	// 	spyOn(userResolve, 'getCustomerId')
	// 		.and
	// 		.returnValue(of('1234'));
	// 	component.ngOnInit();
	// 	fixture.detectChanges();
	// 	expect(component.hasPermission)
	// 		.toBeFalsy();
	// });

	// it('should should set hasPermission false if error', () => {
	// 	const error = {
	// 		status: 404,
	// 		statusText: 'Resource not found',
	// 	};
	// 	spyOn(routeAuthService, 'checkPermissions')
	// 		.and
	// 		.returnValue(throwError(new HttpErrorResponse(error)));
	// 	spyOn(userResolve, 'getCustomerId')
	// 		.and
	// 		.returnValue(of('1234'));
	// 	component.ngOnInit();
	// 	fixture.detectChanges();
	// 	expect(component.hasPermission)
	// 		.toBeFalsy();
	// });
=======
>>>>>>> eft_throttle
});
