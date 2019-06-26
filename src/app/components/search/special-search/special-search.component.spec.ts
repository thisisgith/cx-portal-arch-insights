import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSearchComponent } from './special-search.component';
import { SpecialSearchModule } from './special-search.module';

describe('SpecialSearchComponent', () => {
	let component: SpecialSearchComponent;
	let fixture: ComponentFixture<SpecialSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SpecialSearchModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpecialSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
