import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialResultComponent } from './serial-result.component';
import { SerialResultModule } from './serial-result.module';

describe('SerialResultComponent', () => {
	let component: SerialResultComponent;
	let fixture: ComponentFixture<SerialResultComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SerialResultModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SerialResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
