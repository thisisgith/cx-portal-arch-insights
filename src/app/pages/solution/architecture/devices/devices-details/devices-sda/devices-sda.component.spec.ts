import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSdaComponent } from './devices-sda.component';
import { DevicesSdaModule } from './devices-sda.module';

describe('DevicesSdaComponent', () => {
	let component: DevicesSdaComponent;
	let fixture: ComponentFixture<DevicesSdaComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesSdaModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSdaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
