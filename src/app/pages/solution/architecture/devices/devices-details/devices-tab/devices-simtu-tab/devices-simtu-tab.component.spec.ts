import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSimtuTabComponent } from './devices-simtu-tab.component';
import { DevicesSimtuTabModule } from './devices-simtu-tab.module';

describe('DevicesSimtuTabComponent', () => {
	let component: DevicesSimtuTabComponent;
	let fixture: ComponentFixture<DevicesSimtuTabComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesSimtuTabModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSimtuTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
