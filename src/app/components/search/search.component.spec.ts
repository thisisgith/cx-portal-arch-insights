import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchModule } from './search.module';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SearchService } from './search.service';
import { AppModule } from '../../app.module';
import { I18n } from '@cisco-ngx/cui-utils';
import { mockData } from './search.component.spec.mock';

describe('SearchComponent', () => {
	let component: SearchComponent;
	let fixture: ComponentFixture<SearchComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				AppModule,
				SearchModule,
			],
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should have a placeholder', () => {
		de = fixture.debugElement.query(By.css('#input-type-search'));
		el = de.nativeElement;
		expect(el.getAttribute('placeholder'))
			.toEqual(I18n.get('_SearchLabel_'));
	});

	describe('search result', () => {
		let spy: any;
		const searchTerm = 'Timeout error when configuring new node in DNA cluster';

		beforeEach(() => {
			component.status = {
				hidden: true,
				searching: false,
			};
			component.searchResults = null;
			component.search.setValue('');
		});

		it('should be hidden by default', () => {
			expect(component.status.hidden)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('modal-container'));
			expect(de)
				.toBeFalsy();
		});

		it('should show the spinner while searching', () => {
			component.status.hidden = false;
			component.status.searching = true;

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('h4'));
			el = de.nativeElement;
			expect(el.innerText)
				.toEqual('Searching');

			de = fixture.debugElement.query(By.css('cui-spinner'));
			expect(de)
				.toBeTruthy();
		});

		it('should show a message if there are no results',
			inject([SearchService], (service: SearchService) => {
				spy = spyOn(service, 'search')
					.and
					.returnValue(of({ results: [] }));

				component.search.setValue(searchTerm);
				component.doSearch(searchTerm);

				fixture.detectChanges();

				expect(service.search)
					.toHaveBeenCalled();
				expect(component.searchResults.results.length)
					.toEqual(0);

				de = fixture.debugElement.query(By.css('h5'));
				el = de.nativeElement;
				expect(el.innerText)
					.toEqual(I18n.get('_NoResultsFoundForX_', searchTerm));
			}));

		describe('insights', () => {
			it('should hide the insights if they dont exist',
				inject([SearchService], (service: SearchService) => {
					spy = spyOn(service, 'search')
						.and
						.returnValue(of({ results: [] }));

					component.doSearch(searchTerm);

					fixture.detectChanges();

					expect(service.search)
						.toHaveBeenCalled();
					expect(component.searchResults.insight)
						.toBeUndefined();
					de = fixture.debugElement.query(By.css('#insight'));

					expect(de)
						.toBeFalsy();
				}));

			it('should show the insights if they do exist ',
				inject([SearchService], (service: SearchService) => {
					spy = spyOn(service, 'search')
						.and
						.returnValue(of(mockData));

					component.doSearch(searchTerm);

					fixture.detectChanges();
					expect(service.search)
						.toHaveBeenCalled();
					expect(component.searchResults.insight)
						.toBeDefined();
					de = fixture.debugElement.query(By.css('#insight'));
					expect(de)
						.toBeTruthy();
				}));
		});

		describe('top results', () => {
			it('should show the results if they do exist',
				inject([SearchService], (service: SearchService) => {
					spy = spyOn(service, 'search')
						.and
						.returnValue(of(mockData));

					component.doSearch(searchTerm);

					fixture.detectChanges();
					expect(service.search)
						.toHaveBeenCalled();
					expect(component.searchResults.results.length)
						.toEqual(8);
					de = fixture.debugElement.query(By.css('#topResults'));
					expect(de)
						.toBeTruthy();
				}));
		});
	});
});
