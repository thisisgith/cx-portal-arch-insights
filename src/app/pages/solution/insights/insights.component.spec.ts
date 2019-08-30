import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InsightsComponent } from './insights.component';
import { InsightsModule } from './insights.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OptimalSoftwareVersionComponent } from '../osv/osv.component';
import { RiskMitigationComponent } from '../risk-mitigation/risk-mitigation.component';
import { OptimalSoftwareVersionModule } from '../osv/osv.module';
import { RiskMitigationModule } from '../risk-mitigation/risk-mitigation.module';
import { RouteAuthService } from 'src/app/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set empty select', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		tick(1000);
		fixture.detectChanges();
		expect(component.hasPermission)
			.toEqual(false);
	}));

	it('Should return the user permission response true', fakeAsync(() => {
		const response = true;
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(of(response));
		tick(1000);
		fixture.detectChanges();
		expect(component.hasPermission)
			.toBeDefined();
	}));

	it('Should return the user permission response false', fakeAsync(() => {
		const response = false;
		spyOn(routeAuthService, 'checkPermissions')
			.and
			.returnValue(of(response));
		tick(1000);
		fixture.detectChanges();
		expect(component.hasPermission)
			.toBeDefined();
	}));

});
