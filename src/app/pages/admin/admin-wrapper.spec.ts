import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWrapperComponent } from './admin-wrapper.component';
import { AdminWrapperModule } from './admin-wrapper.module';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
});
