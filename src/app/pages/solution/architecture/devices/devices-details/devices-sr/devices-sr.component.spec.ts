import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSrComponent } from './devices-sr.component';
import { DevicesSrModule } from './devices-sr.module';

describe('DevicesSrComponent', () => {
	let component: DevicesSrComponent;
	let fixture: ComponentFixture<DevicesSrComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesSrModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSrComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
