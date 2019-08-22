import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListComponent } from './device-list.component';
import { DeviceListModule } from './device-list.module';
import { DeviceListRow } from './policy-form.component';

describe('DeviceListComponent', () => {
	let component: DeviceListComponent;
	let fixture: ComponentFixture<DeviceListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				DeviceListModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeviceListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('should run refresh', () => {
		beforeEach(() => {
			component.items = [{
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

		it('handle list with item', () => {
			component.refresh();

			expect(component.itemsInView.length)
				.toBe(1);
		});

		it('handle list with no items', () => {
			component.items = [];
			component.refresh();

			expect(component.itemsInView.length)
				.toBe(0);
		});
	});

	describe('should toggle device selected', () => {
		const deviceRow: DeviceListRow = {
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
		};

		it('toggleDeviceSelected toggles to false', () => {
			deviceRow.selected = true;

			component.toggleDeviceSelected(deviceRow);

			expect(deviceRow.selected)
				.toBeFalsy();
		});

		it('toggleDeviceSelected toggles to true', () => {
			deviceRow.selected = false;

			component.toggleDeviceSelected(deviceRow);

			expect(deviceRow.selected)
				.toBeTruthy();
		});
	});
});
