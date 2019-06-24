import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialSearchComponent } from './serial-search.component';
import { SerialSearchModule } from './serial-search.module';

describe('SerialSearchComponent', () => {
	let component: SerialSearchComponent;
	let fixture: ComponentFixture<SerialSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SerialSearchModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SerialSearchComponent);
		component = fixture.componentInstance;
		component.serialNumber = '';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
