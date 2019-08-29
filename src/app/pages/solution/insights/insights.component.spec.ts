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

describe('InsightsComponent', () => {
	let component: InsightsComponent;
	let fixture: ComponentFixture<InsightsComponent>;
	let rccService: RccService;

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
		rccService = TestBed.get(RccService);
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

	it('should get the optin status for loggedIn user', done => {
		const response = true;
		spyOn(rccService, 'checkPermissions')
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
				done();
			});
	});

	it('should get the optin status for loggedIn user', done => {
		const response = false;
		spyOn(rccService, 'checkPermissions')
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
				done();
			});
	});
});
