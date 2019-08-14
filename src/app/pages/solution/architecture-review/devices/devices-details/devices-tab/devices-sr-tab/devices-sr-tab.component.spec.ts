import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSrTabComponent } from './devices-sr-tab.component';
import { DevicesSrTabModule } from './devices-sr-tab.module';

describe('DevicesSrTabComponent', () => {
	let component: DevicesSrTabComponent;
	let fixture: ComponentFixture<DevicesSrTabComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesSrTabModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSrTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
