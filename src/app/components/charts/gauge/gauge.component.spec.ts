import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponent } from './gauge.component';
import { GaugeModule } from './gauge.module';

describe('GaugeComponent', () => {
	let component: GaugeComponent;
	let fixture: ComponentFixture<GaugeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [GaugeModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GaugeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
