import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { GeneralSearchComponent } from './general-search.component';
import { GeneralSearchModule } from './general-search.module';
import { SearchScenarios } from '@mock';
import { CDCSearchResponse, GlobalSearchResponse, SearchService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';

describe('GeneralSearchComponent', () => {
	let component: GeneralSearchComponent;
	let service: SearchService;
	let fixture: ComponentFixture<GeneralSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				GeneralSearchModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(SearchService);
		fixture = TestBed.createComponent(GeneralSearchComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(
				of(<CDCSearchResponse> (SearchScenarios[0].scenarios.POST[0].response.body)),
			);
		spyOn(service, 'allSearch')
			.and
			.returnValue(
				of(<GlobalSearchResponse> (SearchScenarios[2].scenarios.POST[0].response.body)),
			);
		component.query = { query: 'query1' };
		fixture.detectChanges();
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(
				of(<CDCSearchResponse> (SearchScenarios[0].scenarios.POST[0].response.body)),
			);
		spyOn(service, 'allSearch')
			.and
			.returnValue(
				of(<GlobalSearchResponse> (SearchScenarios[2].scenarios.POST[0].response.body)),
			);
		component.query = { query: 'query1' };
		fixture.detectChanges();
		component.query = { query: 'query2' };
		fixture.detectChanges();
		component.ngOnChanges();
		expect(service.directCDCSearch)
			.toHaveBeenCalled();
		expect(service.allSearch)
			.toHaveBeenCalled();
	});

	it('should load more', fakeAsync(() => {
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(
				of(<CDCSearchResponse> (SearchScenarios[0].scenarios.POST[0].response.body)),
			);
		spyOn(service, 'allSearch')
			.and
			.returnValue(
				of(<GlobalSearchResponse> (SearchScenarios[2].scenarios.POST[0].response.body)),
			);
		component.query = { query: 'query1' };
		fixture.detectChanges();
		tick(1000);
		fixture.detectChanges();
		const button = fixture.debugElement.query(By.css('button'));
		button.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(service.directCDCSearch)
			.toHaveBeenCalledTimes(2);
	}));

	it('should refresh on filter change', fakeAsync(() => {
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(
				of(<CDCSearchResponse> (SearchScenarios[0].scenarios.POST[0].response.body)),
			);
		component.query = { query: 'query1' };
		fixture.detectChanges();
		component.onSiteSelected((<CDCSearchResponse> SearchScenarios[0].scenarios.POST[0]
			.response.body).facets[0].buckets[0]);
		fixture.detectChanges();
		expect(component.selectedSite)
			.toBe((<CDCSearchResponse> SearchScenarios[0].scenarios.POST[0]
				.response.body).facets[0].buckets[0]);
		expect(service.directCDCSearch)
			.toHaveBeenCalledTimes(2);
		component.onTypeSelected((<CDCSearchResponse> SearchScenarios[0].scenarios.POST[0]
			.response.body).facets[1].buckets[0]);
		fixture.detectChanges();
		expect(component.selectedType)
			.toBe((<CDCSearchResponse> SearchScenarios[0].scenarios.POST[0]
				.response.body).facets[1].buckets[0]);
		expect(service.directCDCSearch)
			.toHaveBeenCalledTimes(3);
	}));

	it('should display no results if searches error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(service, 'allSearch')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.query = { query: 'query1' };
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('app-no-results')))
			.toBeDefined();
	});

	it('should set the search token if one is returned', fakeAsync(() => {
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(
				of(<CDCSearchResponse> (SearchScenarios[0].scenarios.POST[3].response.body)),
			);
		component.query = { query: 'query1' };
		fixture.detectChanges();
		expect(component.searchToken)
			.toBe((<CDCSearchResponse> SearchScenarios[0].scenarios.POST[3]
				.response.body).searchToken);
	}));

});
