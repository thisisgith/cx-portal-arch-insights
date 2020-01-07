import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { I18n } from '@cisco-ngx/cui-utils';

import { SmartAccountSelectionComponent } from './smart-account-selection.component';
import { SmartAccountSelectionModule } from './smart-account-selection.module';

describe('SmartAccountSelectionComponent', () => {
	let component: SmartAccountSelectionComponent;
	let fixture: ComponentFixture<SmartAccountSelectionComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SmartAccountSelectionModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartAccountSelectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('when the user has multiple smart accounts and an error is received', () => {
		it('should set the correct error msg, show smart accounts and not show the log out btn', () => {
			component.data = {
				smartAccounts: [{
					companyName: 'ABC',
				}, {
					companyName: 'XYZ',
				}],
				selectedSmartAccount: {
					companyName: 'ABC',
				},
				isError: true,
			};
			component.ngOnInit();
			expect(component.errorMsg)
			.toEqual(I18n.get('_SmartAccountSelectionErrorMultiple_', 'ABC'));
			expect(component.showSmartAccounts)
			.toBeTruthy();
			expect(component.showLogOutBtn)
			.toBeFalsy();
		});
	});

	describe('when the user has one smart account and an error is received', () => {
		it('should set the correct error msg', () => {
			component.data = {
				smartAccounts: [{
					companyName: 'ABC',
				}],
				selectedSmartAccount: {
					companyName: 'ABC',
				},
				isError: true,
			};
			component.ngOnInit();
			expect(component.errorMsg)
			.toEqual(I18n.get('_SmartAccountSelectionErrorSingle_', 'ABC'));
		});
	});

	describe('when the user has no smart accounts and an error is received', () => {
		it('should set the correct error msg', () => {
			component.data = {
				smartAccounts: [],
				selectedSmartAccount: {
					companyName: 'ABC',
				},
				isError: true,
			};
			component.ngOnInit();
			expect(component.errorMsg)
			.toEqual(I18n.get('_SmartAccountSelectionErrorEmpty_'));
		});
	});

	describe('when an error is not received', () => {
		it('should set any error msg', () => {
			component.data = {
				smartAccounts: [],
			};
			component.ngOnInit();
			expect(component.errorMsg)
			.toBeUndefined();
		});
	});
});
