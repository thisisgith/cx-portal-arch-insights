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

	describe('should run nginit functions good', () => {
		const policy = {
			deviceCount: 5,
			formattedSchedule: 'at 10:00 am, only on tuesday UTC',
			policyId: 'b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
			policyType: 'SCAN',
			schedule: '0 0 10 ? * TUE',
		};

		it('should init with type \'editCollection\'', () => {
			component.policy = policy;
			component.type = 'editCollection';
			component.ngOnInit();
		});

		it('should init with type \'newPolicy\'', () => {
			component.type = 'newPolicy';
			component.ngOnInit();
		});

		it('should init with type \'editPolicy\'', () => {
			component.policy = policy;
			component.type = 'editPolicy';
			component.ngOnInit();
		});
	});

	describe('should run functions', () => {
		const deviceList = [{
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

		it('timePeriodChange', () => {
			component.timePeriodChange();
		});

		it('toggleAllDevicesSelected', () => {
			let selected = component.toggleAllDevicesSelected(true, deviceList);
			expect(selected)
				.toBe(false);

			selected = component.toggleAllDevicesSelected(false, deviceList);
			expect(selected)
				.toBe(true);
		});

		it('add', () => {
			component.deviceListLeft = deviceList;
			component.deviceListRight = [];

			component.add();
		});

		it('remove', () => {
			component.deviceListLeft = [];
			component.deviceListRight = deviceList;

			component.remove();
		});

		it('getSchedule', () => {
			const schedule = component.getSchedule('monthly', undefined, '1', '0 1');

			expect(schedule)
				.toBe('0 1 1 * *');
		});

		it('closeRequestForm', () => {
			component.closeRequestForm();
		});
	});
});
