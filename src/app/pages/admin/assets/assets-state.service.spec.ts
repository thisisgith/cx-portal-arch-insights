import { fakeAsync, TestBed, tick, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AssetsState } from './assets-state.service';

describe('AssetsStateService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				AssetsState,
			],
		});
	});

	it('should be created', inject([AssetsState], (service: AssetsState) => {
		expect(service)
			.toBeTruthy();
	}));
	
	it('should send current state', inject([AssetsState], (service: AssetsState) => {
		expect(service.currentState.displayedAssets)
			.toBe(0);
	}));

	it('should send state updates', fakeAsync(inject([AssetsState], (service: AssetsState) => {
		let newAssets;
		let newPage;
		let newDisplayedAssets;
		let newIsLoadingAssets;
		let newTotalAssets;
		let newSearch;
		let newFilter;
		let newView;
		const updateSub = service.changes
			.subscribe(changes => {
				newAssets = changes.assets;
				newDisplayedAssets = changes.displayedAssets;
				newPage = changes.page;
				newIsLoadingAssets = changes.isLoadingAssets;
				newSearch = changes.search;
				newTotalAssets = changes.totalAssets;
				newFilter = changes.filter;
				newView = changes.view;
			});
		service.assets = [{ data: { } }];
		tick(0);
		expect(newAssets)
			.toBeDefined();
		expect(service.assets)
			.toBeDefined();
		service.page = 1;
		tick(0);
		expect(newPage)
			.toBe(1);
		expect(service.page)
			.toBe(1);
		service.displayedAssets = 20;
		tick(0);
		expect(newDisplayedAssets)
			.toBe(20);
		expect(service.displayedAssets)
			.toBe(20);
		service.isLoadingAssets = true;
		tick(0);
		expect(newIsLoadingAssets)
			.toBe(true);
		expect(service.isLoadingAssets)
			.toBe(true);
		service.totalAssets = 100;
		tick(0);
		expect(newTotalAssets)
			.toBe(100);
		expect(service.totalAssets)
			.toBe(100);
		service.search = 'search';
		tick(0);
		expect(newSearch)
			.toBe('search');
		expect(service.search)
			.toBe('search');
		service.filter = 'filter';
		tick(0);
		expect(newFilter)
			.toBe('filter');
		expect(service.filter)
			.toBe('filter');
		service.view = 'table';
		tick(0);
		expect(newView)
			.toBe('table');
		expect(service.view)
			.toBe('table');
	})));
});
