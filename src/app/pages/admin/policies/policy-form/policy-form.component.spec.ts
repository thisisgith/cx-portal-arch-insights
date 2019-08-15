import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormComponent } from './policy-form.component';
import { PolicyFormModule } from './policy-form.module';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PolicyFormComponent', () => {
	let component: PolicyFormComponent;
	let fixture: ComponentFixture<PolicyFormComponent>;

	const locationStub = {
		back: jasmine.createSpy('back'),
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PolicyFormModule,
				RouterTestingModule,
			],
			providers: [
				{
					provide: Location,
					useValue: locationStub,
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PolicyFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('should call different configurations on init', () => {
		const policy = {
			deviceCount: 5,
			formattedSchedule: 'at 10:00 am, only on tuesday UTC',
			policyId: 'b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
			policyType: 'SCAN',
			schedule: '0 0 10 * * 2',
		};

		it('call editCollection', () => {
			spyOn(component, 'editCollection');

			component.type = 'editCollection';
			component.policy = policy;
			component.ngOnInit();

			expect(component.editCollection)
				.toHaveBeenCalled();
		});

		it('call newPolicy', () => {
			spyOn(component, 'newPolicy');

			component.type = 'newPolicy';
			component.ngOnInit();

			expect(component.newPolicy)
				.toHaveBeenCalled();
		});

		it('call editPolicy', () => {
			spyOn(component, 'editPolicy');

			component.type = 'editPolicy';
			component.policy = policy;
			component.ngOnInit();

			expect(component.editPolicy)
				.toHaveBeenCalled();
		});

		it('call editIgnorePolicy', () => {
			spyOn(component, 'editIgnorePolicy');

			component.type = 'editIgnorePolicy';
			component.ngOnInit();

			expect(component.editIgnorePolicy)
				.toHaveBeenCalled();
		});
	});

	describe('main functions should run', () => {
		const policy = {
			deviceCount: 5,
			formattedSchedule: 'at 10:00 am, only on tuesday UTC',
			policyId: 'b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
			policyType: 'SCAN',
			schedule: '0 0 10 * * 2',
		};

		it('editCollection', () => {
			component.policy = policy;
			component.editCollection();
		});

		it('newPolicy', () => {
			component.newPolicy();
		});

		it('newIgnorePolicy', () => {
			component.newIgnorePolicy();
		});

		it('editPolicy', () => {
			component.editPolicy();
		});

		it('editIgnorePolicy', () => {
			component.editIgnorePolicy();
		});
	});

	describe('should change with time period changes', () => {
		it('never and newPolicy', () => {
			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'never',
				},
			);
			spyOn(component, 'newIgnorePolicy');
			component.type = 'newPolicy';
			component.timePeriodChange();

			expect(component.newIgnorePolicy)
				.toHaveBeenCalled();
		});

		it('not never and newIgnorePolicy', () => {
			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'monthly',
				},
			);
			spyOn(component, 'newPolicy');

			component.type = 'newIgnorePolicy';
			component.timePeriodChange();

			expect(component.newPolicy)
				.toHaveBeenCalled();
		});

		it('never and editPolicy', () => {
			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'never',
				},
			);
			spyOn(component, 'editIgnorePolicy');
			component.type = 'editPolicy';
			component.timePeriodChange();

			expect(component.editIgnorePolicy)
				.toHaveBeenCalled();
		});

		it('not never and editIgnorePolicy', () => {
			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'monthly',
				},
			);
			spyOn(component, 'editPolicy');

			component.type = 'editIgnorePolicy';
			component.timePeriodChange();

			expect(component.editPolicy)
				.toHaveBeenCalled();
		});

		it('timePeriodChange', () => {
			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'monthly',
				},
			);
			component.timePeriodChange();
			expect(component.timePeriod)
				.toBe('monthly');

			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'weekly',
				},
			);
			component.timePeriodChange();
			expect(component.timePeriod)
				.toBe('weekly');

			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'daily',
				},
			);
			component.timePeriodChange();
			expect(component.timePeriod)
				.toBe('daily');

			component.requestForm.setValue(
				{
					dates: '',
					days: '',
					hourmins: '',
					timePeriod: 'never',
				},
			);
			component.timePeriodChange();
			expect(component.timePeriod)
				.toBe('never');
		});
	});

	describe('should edit device lists with inputs', () => {
		beforeEach(() => {
			component.deviceListLeft = [{
				hostName: 'C3850',
				ipAddress: '172.25.121.6',
				managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
				productId: 'WS-C3850-48U-L',
				reachabilityStatus: 'Reachable',
				role: 'ACCESS',
				selected: true,
				serialNumber: 'FOC2045X0WJ',
				softwareType: 'IOS-XE',
				softwareVersion: '03.06.05E',
			}];
			component.deviceListRight = [{
				hostName: 'C3850',
				ipAddress: '172.25.121.6',
				managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
				productId: 'WS-C3850-48U-L',
				reachabilityStatus: 'Reachable',
				role: 'ACCESS',
				selected: true,
				serialNumber: 'FOC2045X0WJ',
				softwareType: 'IOS-XE',
				softwareVersion: '03.06.05E',
			}];
		});
		it('toggleAllDevicesSelected', () => {
			let selected = component.toggleAllDevicesSelected(true, component.deviceListLeft);
			expect(selected)
				.toBe(false);

			selected = component.toggleAllDevicesSelected(false, component.deviceListLeft);
			expect(selected)
				.toBe(true);
		});

		it('toggleDeviceSelected', () => {
			component.toggleDeviceSelected(component.deviceListRight[0]);

			expect(component.deviceListRight[0].selected)
				.toBeFalsy();

			component.toggleDeviceSelected(component.deviceListRight[0]);

			expect(component.deviceListRight[0].selected)
				.toBeTruthy();
		});

		it('add', () => {
			component.deviceListRight = [];

			component.add();

			expect(component.deviceListLeft.length)
				.toBe(0);
			expect(component.deviceListRight.length)
				.toBe(1);
		});

		it('remove', () => {
			component.deviceListLeft = [];

			component.remove();

			expect(component.deviceListLeft.length)
				.toBe(1);
			expect(component.deviceListRight.length)
				.toBe(0);
		});
	});

	describe('should handle schedules', () => {
		it('testMonthlySchedule', () => {
			const schedule = component.getSchedule('monthly', undefined, '1', '0 1');

			expect(schedule)
				.toBe('0 0 1 1 * *');
		});

		it('testWeeklySchedule', () => {
			const schedule = component.getSchedule('weekly', '6', undefined, '0 1');

			expect(schedule)
				.toBe('0 0 1 * * 6');
		});

		it('testDailySchedule', () => {
			const schedule = component.getSchedule('daily', undefined, undefined, '0 1');

			expect(schedule)
				.toBe('0 0 1 * * *');
		});

		it('testBadSchedule', () => {
			const schedule = component.getSchedule(undefined, undefined, undefined, '0 1');

			expect(schedule)
				.toBe(false);
		});
	});

	describe('should handle form closes', () => {
		it('closeRequestForm', () => {
			component.closeRequestForm();
		});
	});
});
