import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSearchComponent } from './special-search.component';
import { SpecialSearchModule } from './special-search.module';

describe('SpecialSearchComponent', () => {
	let component: SpecialSearchComponent;
	let fixture: ComponentFixture<SpecialSearchComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [SpecialSearchModule],
		});
	});

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
