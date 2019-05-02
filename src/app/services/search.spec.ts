import { async, inject, TestBed } from '@angular/core/testing';
import { SearchService, SearchResults } from './search';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { mockData } from './mock/search';

describe('SearchService', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MicroMockModule,
				HttpClientModule,
			],
			providers: [
				SearchService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	it('should inject', inject([SearchService], (service: SearchService) => {
		expect(service)
			.toBeTruthy();
	}));

	it('should handle a read', inject([SearchService], (service: SearchService) => {
		service.search('Test string')
			.subscribe(
			(results: SearchResults) => {
				expect(results.results.length)
					.toEqual(mockData.results.length);
			});
	}));
});
