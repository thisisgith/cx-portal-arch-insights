import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MicroMockService } from '@cui-x-views/mock';
import { EntitlementService } from '@sdp-api';
import { UserResolve } from '@utilities';
import { user } from '@mock';

import { HeaderComponent } from './header.component';
import { HeaderModule } from './header.module';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let mockService: MicroMockService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HeaderModule,
				RouterTestingModule,
			],
			providers: [
				EntitlementService,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		mockService = TestBed.get(MicroMockService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should provide a method for opening the the mock settings modal', () => {
		const promptMockSettingsSpy = spyOn(mockService, 'promptMockSettings')
			.and
			.callThrough();
		component.openMockModal();
		expect(promptMockSettingsSpy)
			.toHaveBeenCalled();
	});

	it('should fetch user information when instantiated', () => {
		const localUserResolve = TestBed.get(UserResolve);
		const spy = spyOn(localUserResolve, 'getUser')
			.and
			.returnValue(of(user));

		const localComponent = TestBed.createComponent(HeaderComponent);
		expect(spy)
			.toHaveBeenCalled();
		expect(localComponent.componentInstance.name)
			.toBe('Demo');
		expect(localComponent.componentInstance.fullName)
			.toBe('Demo Test');
		expect(localComponent.componentInstance.initials)
			.toBe('DT');
		expect(localComponent.componentInstance.email)
			.toBe('fakeCco@cisco.com');
		expect(localComponent.componentInstance.cxLevel)
			.toBe(3);
	});

	it('should update innerHtml on window resize', () => {
		const spy = spyOn(component, 'onResize').and
			.callThrough();
		(<any> window).innerWidth = 200;
		window.dispatchEvent(new Event('resize'));
		expect(spy)
			.toHaveBeenCalled();
		expect((<any> component).innerWidth)
			.toBe(200);
	});

	it('should expand the search bar when its focused', () => {
		const searchBar = document.getElementById('input-type-search');
		searchBar.click();
		searchBar.focus();
		searchBar.dispatchEvent(new Event('focus'));
		fixture.detectChanges();

		expect(component.searchExpanded)
			.toBe(true);
	});

	it('should expand the search bar when the search button is clicked', () => {
		const searchBar = document.getElementsByClassName('cx-search-button');
		searchBar[0].dispatchEvent(new Event('click'));
		fixture.detectChanges();

		expect(component.searchExpanded)
			.toBe(true);
	});

	it('should indicate whether to show or hide element by window size', () => {
		(<any> component).innerWidth = 200;
		let response = component.searchBreakpointShow(300);
		expect(response)
			.toBe(true);
		component.searchExpanded = true;
		response = component.searchBreakpointShow(300);
		expect(response)
			.toBe(false);
		response = component.searchBreakpointShow(150);
		expect(response)
			.toBe(true);
	});

	it('should open a dropdown that has not been opened when clicked', () => {
		const dropdowns = document.getElementsByClassName('cx-header-links');
		const spy = spyOn(component, 'toggleDropdown').and
			.callThrough();
		expect(component.dropdownComponents.first.open)
			.toBe(false);
		dropdowns[2].dispatchEvent(new Event('click'));
		fixture.detectChanges();
		expect(spy)
			.toHaveBeenCalled();
		expect(dropdowns[2].classList)
			.toContain('cx-header-links--active');
		expect(component.dropdownComponents.first.open)
			.toBe(true);
	});

	it('should close a dropdown that has been opened when different dropdown is clicked', () => {
		const dropdowns = document.getElementsByClassName('cx-header-links');
		const spy = spyOn(component, 'toggleDropdown').and
			.callThrough();
		expect(component.dropdownComponents.first.open)
			.toBe(false);
		dropdowns[2].dispatchEvent(new Event('click'));
		fixture.detectChanges();
		expect(spy)
			.toHaveBeenCalled();
		expect(dropdowns[2].classList)
			.toContain('cx-header-links--active');
		expect(component.dropdownComponents.first.open)
			.toBe(true);
		dropdowns[4].dispatchEvent(new Event('click'));
		fixture.detectChanges();
		expect(dropdowns[2].classList).not
			.toContain('cx-header-links--active');
		expect(component.dropdownComponents.first.open)
			.toBe(false);
	});

	it('should try and open a case and scan if not success', () => {
		spyOn(component.router, 'navigate');
		component.navigateHome();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.router.navigate)
			.toHaveBeenCalledWith(
				['solution/lifecycle'],
				{ },
			);
		});
	});
});
