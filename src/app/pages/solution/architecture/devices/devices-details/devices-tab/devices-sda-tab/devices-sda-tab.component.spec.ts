import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSdaTabComponent } from './devices-sda-tab.component';
import { DevicesSdaTabModule } from './devices-sda-tab.module';

describe('DevicesSdaTabComponent', () => {
	let component: DevicesSdaTabComponent;
	let fixture: ComponentFixture<DevicesSdaTabComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesSdaTabModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSdaTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
