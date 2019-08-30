import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsComponent } from './insights.component';
import { InsightsModule } from './insights.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OptimalSoftwareVersionComponent } from '../osv/osv.component';
import { RiskMitigationComponent } from '../risk-mitigation/risk-mitigation.component';
import { OptimalSoftwareVersionModule } from '../osv/osv.module';
import { RiskMitigationModule } from '../risk-mitigation/risk-mitigation.module';
import { RouteAuthService } from 'src/app/services';
import { of } from 'rxjs';

describe('InsightsComponent', () => {
	let component: InsightsComponent;
	let fixture: ComponentFixture<InsightsComponent>;
	let routeAuthService: RouteAuthService;

	beforeEach(async(() => {
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
		})
			.compileComponents();
		routeAuthService = TestBed.get(RouteAuthService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(InsightsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeDefined();
	});

	it('should get the optin status for loggedIn user true', () => {
		const response = true;
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(of(response));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.hasPermission)
					.toBeDefined();
				expect(component.hasPermission)
					.toEqual(response);
			});
	});

	it('should get the optin status for loggedIn user false', () => {
		const response = false;
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(of(response));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.hasPermission)
					.toBeDefined();
				expect(component.hasPermission)
					.toEqual(response);
			});
	});
});
