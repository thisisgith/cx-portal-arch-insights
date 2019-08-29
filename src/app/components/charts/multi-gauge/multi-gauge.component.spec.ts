import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiGaugeComponent } from './multi-gauge.component';
import { MultiGaugeModule } from './multi-gauge.module';

describe('MultiGaugeComponent', () => {
	let component: MultiGaugeComponent;
	let fixture: ComponentFixture<MultiGaugeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MultiGaugeModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiGaugeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
