import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { SearchService, SearchResults } from '@services';

/**
 * Component representing "general" search results on the search modal
 */
@Component({
	selector: 'app-general-search',
	templateUrl: './general-search.component.html',
})
export class GeneralSearchComponent implements OnInit, OnDestroy, OnChanges {
	@Input('query') public query: string;
	public searchResults: SearchResults['cdcSearch'][0]['search'];
	public loading = true;
	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private logger: LogService,
		private service: SearchService,
	) {
		this.logger.debug('GeneralSearchComponent Created!');
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.refresh$.pipe(
			tap(() => this.loading = true),
			switchMap(() => this.doSearch(this.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loading = false;
			this.searchResults = result.cdcSearch[0].search;
		});
		this.refresh$.next();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * On changes lifecycle Hook
	 * Send another request whenever the query term changes.
	 */
	public ngOnChanges () {
		this.refresh$.next();
	}

	/**
	 * Send search request
	 * @param query search term string
	 * @returns observable with results
	 */
	private doSearch (query: string): Observable<SearchResults | null> {
		return this.service.search(query)
			.pipe(catchError(err => {
				this.logger.error(`Search Query :: ${query} :: Error ${err}`);

				return of(null);
			}));
	}
}
