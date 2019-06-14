import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { I18n } from '@cisco-ngx/cui-utils';
import { SearchService, CDCSearchResponse, CDC, Buckets, Facets } from '@cui-x/sdp-api';
import { SearchService as SearchUtils } from '@services';

import * as _ from 'lodash';

/**
 * Indicates refresh type, either refreshing everything or fetching a new page
 */
type RefreshType = 'all' | 'newPage';

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
				if (refreshType === 'all') {
					this.loading = true;
				} else {
					this.loadingPage = true;
				}
			}),
			switchMap(() => this.doSearch(this.query, this.pageOffset, this.selectedSite)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loading = false;
			this.loadingPage = false;
			if (this.pageOffset === 0) {
				this.searchResults = _.get(result, 'documents', []);
			} else {
				this.searchResults = this.searchResults.concat(_.get(result, 'documents', []));
			}
			this.totalCount = _.get(result, 'totalHits', 0);
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
		});
		this.refresh$.next('all');
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
		this.refresh$.next('all');
	}

	/**
	 * Fires when user selects a site filter
	 * @param site the bucket with the site selection
	 */
	public onSiteSelected (site: Buckets) {
		this.pageOffset = 0;
		this.selectedSite = site;
		this.refresh$.next('all');
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
					filter: site.filter,
				} : { }
			),
		})
		.pipe(catchError(err => {
			this.logger.error(`Search Query :: ${query} :: Error ${err}`);

			return of(null);
		}));
	}
}
