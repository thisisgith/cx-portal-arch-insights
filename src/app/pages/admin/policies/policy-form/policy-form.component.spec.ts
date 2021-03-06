import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormComponent } from './policy-form.component';
import { PolicyFormModule } from './policy-form.module';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CuiPagerModule } from '@cisco-ngx/cui-components';
import { DeviceListModule } from './device-list/device-list.module';

import { DevicePolicyResponseModel, CollectionPolicyResponseModel } from '@sdp-api';
import { of } from 'rxjs';

import * as _ from 'lodash-es';

describe('PolicyFormComponent', () => {
	let component: PolicyFormComponent;
	let fixture: ComponentFixture<PolicyFormComponent>;

	const locationStub = {
		back: jest.fn(),
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PolicyFormModule,
				RouterTestingModule,
				CuiPagerModule,
				DeviceListModule,
			],
			providers: [
				{
					provide: Location,
					useValue: locationStub,
				},
			],
		});
	});

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
			schedule: '0 0 10 ? * TUE',
		};

		it('call editCollection', () => {
			jest.spyOn(component, 'editCollection');

			component.type = 'editCollection';
			component.policy = policy;
			component.ngOnInit();

			expect(component.editCollection)
				.toHaveBeenCalled();
		});

		it('call newPolicy', () => {
			jest.spyOn(component, 'newPolicy');

			component.type = 'newPolicy';
			component.ngOnInit();

			expect(component.newPolicy)
				.toHaveBeenCalled();
		});

		it('call editPolicy', () => {
			jest.spyOn(component, 'editPolicy');

			component.type = 'editPolicy';
			component.policy = policy;
			component.ngOnInit();

			expect(component.editPolicy)
				.toHaveBeenCalled();
		});

		it('call editIgnorePolicy', () => {
			jest.spyOn(component, 'editIgnorePolicy');

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
			schedule: '0 0 10 ? * TUE',
		};

		it('editCollection', () => {
			const response: CollectionPolicyResponseModel = {
				customerId: '0',
				policyId: '0',
			};

			component.policy = policy;
			component.editCollection();

			jest.spyOn(component.collectionService, 'updateCollectionPolicyUsingPATCH')
				.mockReturnValue(of(response));

			component.onSubmit();

			expect(component.collectionService.updateCollectionPolicyUsingPATCH)
				.toHaveBeenCalled();
		});

		it('newPolicy', () => {
			const response: DevicePolicyResponseModel = {
				customerId: '0',
				policyId: '0',
			};

			component.newPolicy();

			jest.spyOn(component.devicePolicyService, 'createDevicePolicyUsingPOST')
				.mockReturnValue(of(response));

			component.onSubmit();

			expect(component.devicePolicyService.createDevicePolicyUsingPOST)
				.toHaveBeenCalled();
		});

		it('newIgnorePolicy', () => {
			component.newIgnorePolicy();
		});

		it('editPolicy', () => {
			const response: DevicePolicyResponseModel = {
				customerId: '0',
				policyId: '0',
			};

			component.editPolicy();

			jest.spyOn(component.devicePolicyService, 'updateDevicePolicyUsingPATCH')
				.mockReturnValue(of(response));

			component.onSubmit();

			expect(component.devicePolicyService.updateDevicePolicyUsingPATCH)
				.toHaveBeenCalled();
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
			jest.spyOn(component, 'newIgnorePolicy');
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
			jest.spyOn(component, 'newPolicy');

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
			jest.spyOn(component, 'editIgnorePolicy');
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
			jest.spyOn(component, 'editPolicy');

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
				hostname: 'C3850',
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
				hostname: 'C3850',
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
			component.allDevicesSelectedLeft = true;
			component.toggleAllDevicesSelected(
				component.deviceListLeft, component.leftDevices);

			expect(component.allDevicesSelectedLeft)
				.toBe(false);

			component.toggleAllDevicesSelected(
				component.deviceListLeft, component.leftDevices);

			expect(component.allDevicesSelectedLeft)
				.toBe(true);

			component.allDevicesSelectedRight = true;
			component.toggleAllDevicesSelected(
				component.deviceListRight, component.rightDevices);

			expect(component.allDevicesSelectedRight)
				.toBe(false);

			component.toggleAllDevicesSelected(
				component.deviceListRight, component.rightDevices);

			expect(component.allDevicesSelectedRight)
				.toBe(true);

			component.deviceListRight = [];
			component.toggleAllDevicesSelected(
				component.deviceListRight,
				component.rightDevices,
			);
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

		it('paginator', () => {
			jest.spyOn(component, 'onLeftListCall');

			const pageInfo = {
				page: 0,
			};

			component.onPageChanged(pageInfo);

			expect(component.pageNumber)
				.toBe(1);

			pageInfo.page = 999;

			component.onPageChanged(pageInfo);

			expect(component.pageNumber)
				.toBe(1000);

			expect(component.onLeftListCall)
				.toHaveBeenCalled();
		});

		it('getDevieListNoSelect', () => {
			const devList = component.getDeviceListNoSelect();

			expect(devList[0].selected)
				.toBeUndefined();
		});

	});

	describe('should handle schedules', () => {
		it('testMonthlySchedule', () => {
			const schedule = component.getSchedule('monthly', undefined, '1', '0 1');

			expect(schedule)
				.toBe('0 0 1 1 * ?');
		});

		it('testWeeklySchedule', () => {
			const schedule = component.getSchedule('weekly', 'SAT', undefined, '0 1');

			expect(schedule)
				.toBe('0 0 1 ? * SAT');
		});

		it('testDailySchedule', () => {
			const schedule = component.getSchedule('daily', undefined, undefined, '0 1');

			expect(schedule)
				.toBe('0 0 1 ? * *');
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

	describe('should handle page changes', () => {
		it('onPageChanged', () => {
			jest.spyOn(component, 'onLeftListCall');

			const pageInfo = {
				page: 0,
			};

			component.onPageChanged(pageInfo);

			expect(component.pageNumber)
				.toBe(1);

			expect(component.onLeftListCall)
				.toHaveBeenCalled();
		});

	});

	describe('should handle converting hours and min in time strings', () => {
		it('12:00 am', () => {
			_.set(component, ['policy', 'formattedSchedule'],
				'2 devices are scanned at 12:00 am UTC');

			component.setSelectors();

			expect(component.hourmins.selected)
				.toBe('0 0');
		});

		it('12:00 pm', () => {
			_.set(component, ['policy', 'formattedSchedule'],
				'2 devices are scanned at 12:00 pm UTC');

			component.setSelectors();

			expect(component.hourmins.selected)
				.toBe('0 12');
		});

		it('6:00 am', () => {
			_.set(component, ['policy', 'formattedSchedule'],
				'2 devices are scanned at 06:00 am UTC');

			component.setSelectors();

			expect(component.hourmins.selected)
				.toBe('0 6');
		});

		it('6:00 pm', () => {
			_.set(component, ['policy', 'formattedSchedule'],
				'2 devices are scanned at 06:00 pm UTC');

			component.setSelectors();

			expect(component.hourmins.selected)
				.toBe('0 18');
		});

	});
});
