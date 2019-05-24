import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchModule } from './search.module';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SearchService } from '@services';
import { I18n } from '@cisco-ngx/cui-utils';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment';
import { searchData } from '@mock';
import { RouterTestingModule } from '@angular/router/testing';

import * as enUSJson from '../../../assets/i18n/en-US.json';

describe('SearchComponent', () => {
	let component: SearchComponent;
	let fixture: ComponentFixture<SearchComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	let service: SearchService;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				SearchModule,
				RouterTestingModule.withRoutes([]),
			],
		})
		.compileComponents();

		service = TestBed.get(SearchService);
		httpMock = TestBed.get(HttpTestingController);
	}));

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);

		fixture = TestBed.createComponent(SearchComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
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

		it('should show a message if there are no results', () => {
			spyOn(service, 'search')
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
		});

		describe('insights', () => {
			it('should hide the insights if they dont exist', () => {
				spyOn(service, 'search')
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
			});

			it('should show the insights if they do exist ', () => {
				spyOn(service, 'search')
					.and
					.returnValue(of(searchData));

				component.doSearch(searchTerm);

				fixture.detectChanges();
				expect(service.search)
					.toHaveBeenCalled();
				expect(component.searchResults.insight)
					.toBeDefined();
				de = fixture.debugElement.query(By.css('#insight'));
				expect(de)
					.toBeTruthy();
			});

			it('should not fail if receive an error message', () => {
				component.search.setValue(searchTerm);
				component.doSearch(searchTerm);

				const req = httpMock.expectOne(
					`${environment.origin}${environment.services.search}`);

				const mockErrorResponse = { status: 404, statusText: 'Bad Request' };

				expect(req.request.method)
					.toBe('GET');

				req.flush({ }, mockErrorResponse);

				fixture.detectChanges();

				de = fixture.debugElement.query(By.css('#noResults'));
				el = de.nativeElement;
				expect(el.innerText)
					.toEqual(I18n.get('_NoResultsFoundForX_', searchTerm));
			});
		});

		describe('top results', () => {
			it('should show the results if they do exist', () => {
				spyOn(service, 'search')
					.and
					.returnValue(of(searchData));

				component.doSearch(searchTerm);

				fixture.detectChanges();
				expect(service.search)
					.toHaveBeenCalled();
				expect(component.searchResults.results.length)
					.toEqual(8);
				de = fixture.debugElement.query(By.css('#topResults'));
				expect(de)
					.toBeTruthy();
			});
		});
	});
});
