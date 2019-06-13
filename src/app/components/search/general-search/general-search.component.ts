import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, forkJoin, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { I18n } from '@cisco-ngx/cui-utils';
import { SearchService, CDCSearchResponse, CDC, Buckets, Facets } from '@cui-x/sdp-api';
import { SearchService as SearchUtils } from '@services';

import * as _ from 'lodash';

/**
 * Indicates refresh type, either refreshing everything or fetching a new page
 */
type RefreshType = 'query' | 'filters' | 'newPage';

/**
 * Component representing "general" search results on the search modal
 */
@Component({
	selector: 'app-general-search',
	templateUrl: './general-search.component.html',
})
export class GeneralSearchComponent implements OnInit, OnDestroy, OnChanges {
	@Input('query') public query: string;
	public searchResults: CDC[];
	public siteOptions: Buckets[];
	public totalCount = 0;
	public loading = true;
	public loadingPage = false;
	public selectedSite: Buckets;

	private readonly pageSize = 10;
	private pageOffset = 0;
	private refresh$ = new Subject<RefreshType>();
	private destroy$ = new Subject();

	constructor (
		private logger: LogService,
		private service: SearchService,
		private utils: SearchUtils,
	) {
		this.logger.debug('GeneralSearchComponent Created!');
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.refresh$.pipe(
			tap(refreshType => {
				if (refreshType === 'query' || refreshType === 'filters') {
					this.loading = true;
				} else {
					this.loadingPage = true;
				}
			}),
			switchMap(refreshType => forkJoin(
				this.doSearch(this.query, this.pageOffset, this.selectedSite),
				of(refreshType),
			)),
			takeUntil(this.destroy$),
		)
		.subscribe(results => {
			const [result, refreshType] = results;
			this.loading = false;
			this.loadingPage = false;
			if (refreshType === 'newPage') {
				this.searchResults = this.searchResults.concat(_.get(result, 'documents', []));
			} else {
				this.searchResults = _.get(result, 'documents', []);
			}
			this.totalCount = _.get(result, 'totalHits', 0);
			// Only change filter options when the query changes
			if (refreshType === 'query') {
				const facets = <Facets []> _.get(result, 'facets', []);
				if (facets && facets.length) {
					this.siteOptions = facets
						.find((o: Facets) => o.label === 'Site')
						.buckets
						.map((bucket: Buckets) => ({
							...bucket,
							label: `${bucket.label} (${bucket.count})`,
						}));
					this.siteOptions.unshift({
						filter: null,
						label: I18n.get('_AllCategories_'),
					});
					if (!this.selectedSite) {
						this.selectedSite = this.siteOptions[0];
					}
				}
			}
		});
		this.refresh$.next('query');
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
		this.pageOffset = 0;
		this.selectedSite = null;
		this.refresh$.next('query');
	}

	/**
	 * Fires when user selects a site filter
	 * @param site the bucket with the site selection
	 */
	public onSiteSelected (site: Buckets) {
		this.pageOffset = 0;
		this.selectedSite = site;
		this.refresh$.next('filters');
	}

	/**
	 * Fires when "load more" button is clicked. Gets the next page.
	 */
	public onLoadMore () {
		this.pageOffset += this.pageSize;
		this.refresh$.next('newPage');
	}

	/**
	 * Send search request
	 * @param query search term string
	 * @param offset page offset
	 * @param site optional site filter
	 * @returns observable with results
	 */
	private doSearch (query: string, offset?: number, site?: Buckets):
		Observable<CDCSearchResponse | null> {
		return this.service.directCDCSearch({
			limit: this.pageSize.toString(),
			offset: offset.toString(),
			searchTokens: query,
			...(
				site && site.filter ? {
					filters: site.filter,
				} : { }
			),
		})
		.pipe(catchError(err => {
			this.logger.error(`Search Query :: ${query} :: Error ${err}`);

			return of(null);
		}));
	}
}
