import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWrapperComponent } from './admin-wrapper.component';
import { AdminWrapperModule } from './admin-wrapper.module';
import { AppStatusColorPipe } from './settings/app-status-color.pipe';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IEHealthStatusResponseModel } from '@sdp-api';
import { HealthStatusScenarios } from '@mock';

import { of } from 'rxjs';

describe('AdminWrapperComponent', () => {
	let component: AdminWrapperComponent;
	let fixture: ComponentFixture<AdminWrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AdminWrapperModule,
				RouterTestingModule,
			],
			providers: [
				AppStatusColorPipe,
				{
					provide: Location,
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminWrapperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle going back', () => {
		component.appService.addRouteToList('/test/route/1');
		component.appService.addRouteToList('/test/route/2');
		component.goBack();

		expect(component.appService.getLastRoute())
			.toBe('/test/route/1');
	});

	it('should handle going back ignoring admin pages', () => {
		component.appService.addRouteToList('/test/route/1');
		component.appService.addRouteToList('/admin1');
		component.appService.addRouteToList('/admin2');
		component.goBack();

		expect(component.appService.getLastRoute())
			.toBeUndefined();
	});

	describe('test errored apps badge', () => {
		const response = <IEHealthStatusResponseModel[]>
			HealthStatusScenarios[0].scenarios.GET[0].response.body;

		it('should call api', () => {
			spyOn(component, 'getIEHealthStatusData')
				.and
				.returnValue(of(response));

			component.ngOnInit();

			expect(component.getIEHealthStatusData)
				.toHaveBeenCalled();
		});

		it('should display no errored apps', () => {
			const tempResponse: IEHealthStatusResponseModel = {
				component_details: [
					{
						status: 'Running',
					},
					{
						status: 'Running',
					},
					{
						status: 'Running',
					},
				],
				dnac_details: [
					{
						status: 'Reachable',
					},
				],
				ieStatus: 'Reachable',
			};

			component.setErroredAppsNum(tempResponse);
			expect(component.erroredAppsNum)
				.toBe(0);
		});

		it('should display some errored apps', () => {
			const tempResponse: IEHealthStatusResponseModel = {
				component_details: [
					{
						status: 'Running',
					},
					{
						status: 'Error',
					},
					{
						status: 'ErrorLoopBackoff',
					},
				],
				dnac_details: [
					{
						status: 'Unreachable',
					},
				],
				ieStatus: 'Unreachable',
			};

			component.setErroredAppsNum(tempResponse);
			expect(component.erroredAppsNum)
				.toBe(4);
		});
	});
});
