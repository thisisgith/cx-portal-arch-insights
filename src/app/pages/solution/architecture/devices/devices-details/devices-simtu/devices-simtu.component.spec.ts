import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSimtuComponent } from './devices-simtu.component';
import { DevicesSimtuModule } from './devices-simtu.module';

describe('DevicesSimtuComponent', () => {
	let component: DevicesSimtuComponent;
	let fixture: ComponentFixture<DevicesSimtuComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesSimtuModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSimtuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
