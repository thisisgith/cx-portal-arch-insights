import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

	describe('when a selected smart account is received along-with an error', () => {
		it('should set `accountWithError`', () => {
			component.data = {
				smartAccounts: [],
				selectedSmartAccount: {
					companyName: 'ABC',
				},
				isError: true,
			};
			component.ngOnInit();
			expect(component.accountWithError)
			.toEqual('ABC');
		});
	});

	describe('when a selected smart account is received without an error', () => {
		it('should not set `accountWithError`', () => {
			component.data = {
				smartAccounts: [],
				isError: true,
			};
			component.ngOnInit();
			expect(component.accountWithError)
			.toEqual('');
		});
	});

	describe('when a selected smart account is not received along-with an error', () => {
		it('should not set `accountWithError`', () => {
			component.data = {
				smartAccounts: [],
				selectedSmartAccount: {
					companyName: 'ABC',
				},
			};
			component.ngOnInit();
			expect(component.accountWithError)
			.toBeUndefined();
		});
	});
});
