import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { DevicesWithExceptionsModule } from './devices-with-exceptions.module';

describe('DevicesWithExceptionsComponent', () => {
	let component: DevicesWithExceptionsComponent;
	let fixture: ComponentFixture<DevicesWithExceptionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesWithExceptionsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesWithExceptionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
