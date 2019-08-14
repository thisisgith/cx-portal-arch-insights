import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesDetailsHeaderComponent } from './devices-details-header.component';
import { DevicesDetailsHeaderModule } from './devices-details-header.module';

describe('DevicesDetailsHeaderComponent', () => {
	let component: DevicesDetailsHeaderComponent;
	let fixture: ComponentFixture<DevicesDetailsHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesDetailsHeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesDetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
