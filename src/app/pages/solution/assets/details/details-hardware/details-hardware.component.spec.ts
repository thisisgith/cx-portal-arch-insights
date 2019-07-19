import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHardwareComponent } from './details-hardware.component';
import { DetailsHardwareModule } from './details-hardware.module';

describe('DetailsHardwareComponent', () => {
	let component: DetailsHardwareComponent;
	let fixture: ComponentFixture<DetailsHardwareComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DetailsHardwareModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailsHardwareComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
