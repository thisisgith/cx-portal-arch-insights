import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesL3Component } from './devices-l3.component';
import { DevicesL3Module } from './devices-l3.module';

describe('DevicesL3Component', () => {
	let component: DevicesL3Component;
	let fixture: ComponentFixture<DevicesL3Component>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesL3Module],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesL3Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
