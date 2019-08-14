import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesListComponent } from './devices-list.component';
import { DevicesListModule } from './devices-list.module';

describe('DevicesWithExceptionsComponent', () => {
	let component: DevicesListComponent;
	let fixture: ComponentFixture<DevicesListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesListModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
