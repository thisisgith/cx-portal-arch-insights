import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesL3TabComponent } from './devices-l3-tab.component';
import { DevicesL3TabModule } from './devices-l3-tab.module';

describe('DevicesL3TabComponent', () => {
	let component: DevicesL3TabComponent;
	let fixture: ComponentFixture<DevicesL3TabComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesL3TabModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesL3TabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
