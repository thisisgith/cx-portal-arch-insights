import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InsightsComponent } from './insights.component';
import { InsightsModule } from './insights.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OptimalSoftwareVersionComponent } from '../osv/osv.component';
import { RiskMitigationComponent } from '../risk-mitigation/risk-mitigation.component';
import { OptimalSoftwareVersionModule } from '../osv/osv.module';
import { RiskMitigationModule } from '../risk-mitigation/risk-mitigation.module';
import { RccService } from '@sdp-api';
import { of } from 'rxjs';
import { PermissionGuard } from './permission.guard';
import { UserResolve } from '@utilities';
/**
 * class to mock router
 */
class MockRouter {
	/**
	 * method for navigate routes
	 * @param path refers path
	 */
	// tslint:disable-next-line: no-empty
	public navigateByUrl () { }
}

describe('InsightsComponent', () => {
	let router;
	let component: InsightsComponent;
	let fixture: ComponentFixture<InsightsComponent>;
	let rccService: RccService;
	let userResolve: UserResolve;
	let permissionGuard: PermissionGuard;

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
			providers: [
				UserResolve,
			],
		})
			.compileComponents();
		rccService = TestBed.get(RccService);
		userResolve = TestBed.get(UserResolve);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(InsightsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should return true if the user has permission', done => {
		spyOn(rccService, 'checkPermissions')
			.and
			.returnValue(of(true));
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
		router = new MockRouter();
		permissionGuard = new PermissionGuard(rccService, userResolve, router);
		permissionGuard.canActivate(null, null)
			.subscribe(response => {
				expect(response)
					.toEqual(true);
				done();
			});
	});

	it('should return false and reroute if the user has permission', () => {
		spyOn(rccService, 'checkPermissions')
			.and
			.returnValue(of(false));
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
		router = new MockRouter();
		permissionGuard = new PermissionGuard(rccService, userResolve, router);
		permissionGuard.canActivate(null, null)
			.subscribe(response => {
				expect(response)
					.toEqual(false);
			});
	});
});
