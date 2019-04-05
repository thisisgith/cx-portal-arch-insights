import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsComponent } from './search-results.component';
import { SearchResultsModule } from './search-results.module';

describe('SearchResultsComponent', () => {
	let component: SearchResultsComponent;
	let fixture: ComponentFixture<SearchResultsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SearchResultsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchResultsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
