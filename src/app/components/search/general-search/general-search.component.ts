import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { I18n } from '@cisco-ngx/cui-utils';
import {
	Acc,
	AtxFuture,
	SearchService,
	CDC,
	CDCSearchResponse,
	SearchCommunity,
	Buckets,
	Facets,
	ELearning,
} from '@sdp-api';
import { SearchService as SearchUtils, RacetrackInfoService } from '@services';
import { SearchContext, SearchQuery } from '@interfaces';

import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

/**
 * Indicates refresh type, either refreshing everything or fetching a new page
 */
type RefreshType = 'query' | 'filters' | 'newPage';

/**
 * Possible types of "related" results
 */
type RelatedResultType = 'acc' | 'atx' | 'learning' | 'community';

/**
 * Interface representing related ACC/ATX/eLearning/Community results
 */
interface RelatedResult {
	url: string;
	title: string;
	type: RelatedResultType;
	description: string;
}

/**
 * Component representing "general" search results on the search modal
 */
@Component({
	selector: 'app-general-search',
	styleUrls: ['./general-search.component.scss'],
	templateUrl: './general-search.component.html',
})
export class GeneralSearchComponent implements OnInit, OnDestroy, OnChanges {
	@Input('query') public query: SearchQuery;
	@Input('context') public context: SearchContext;
	@Input('header') public header: string;
	@Output('results') public results = new EventEmitter();
	@Output('loadingChange') public loadingChange = new EventEmitter<boolean>();

	/**
	 * Search token to display above the results
	 * Generally this is the query the user typed in, but in the case of
	 * an 'SN' context search it will be the productName instead.
	 */
	public searchToken: string;

	/**
	 * The actual search results used in the template
	 * Important properties picked out of the CDCSearchResponse
	 */
	public searchResults: {
		displayUrl: string;
		description: string;
		pdfUrl?: string;
		pdfSize?: number;
	}[];
	public relatedResults: RelatedResult[];
	public siteOptions: Buckets[];
	public typeOptions: Buckets[];
	public totalCount = 0;
	public loading = true;
	public loadingPage = false;
	public loadingRelated = false;
	public selectedSite: Buckets;
	public selectedType: Buckets;
	public lastFiltered: string;

	private customerId: string;
	private pitStop: string;
	private readonly pageSize = 10;
	private pageOffset = 0;
	private refresh$ = new Subject<RefreshType>();
	private destroy$ = new Subject();

	constructor (
		private logger: LogService,
		private service: SearchService,
		private utils: SearchUtils,
		private userResolve: UserResolve,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(currentTechnology => {
			this.pitStop = currentTechnology.currentPitstop;
		});
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.searchToken = this.query.query;
		/** Refresh main CDC results subscription */
		this.refresh$.pipe(
			tap(refreshType => {
				if (refreshType === 'query' || refreshType === 'filters') {
					this.loading = true;
					this.loadingChange.emit(true);
				} else {
					this.loadingPage = true;
				}
			}),
			switchMap(refreshType => forkJoin(
				this.doSearch(
					this.query,
					this.pageOffset,
					this.selectedSite,
					this.selectedType,
				),
				of(refreshType),
			)),
			takeUntil(this.destroy$),
		)
		.subscribe(results => {
			const [result, refreshType] = results;
			this.loading = false;
			this.loadingChange.emit(false);
			this.loadingPage = false;
			if (_.get(result, 'searchToken')) {
				this.searchToken = result.searchToken;
			}
			const resultsMapped = (<CDC []> _.get(result, 'documents', []))
				.map(doc => {
					const o = {
						description: _.get(doc.fields, ['text', 0]),
						displayUrl: _.get(doc.fields, ['uri', 0]),
						pdfSize: null,
						pdfUrl: null,
						title: _.get(doc.fields, ['title', 0]),
					};
					const pdfIndex = _.findIndex(doc.fields.filetype, (s: string) => s === 'PDF');
					// If PDF Index is found and it's not the first result
					// (ie there is also an HTML version)
					// Attach it to the object as well to be displayed under the html url
					if (pdfIndex > 0) {
						o.pdfUrl = doc.fields.uri[pdfIndex];
						o.pdfSize =
							_.get(doc.fields, ['filesize', pdfIndex], doc.fields.filesize[0]);
					}

					return o;
				});
			if (refreshType === 'newPage') {
				this.searchResults = this.searchResults.concat(resultsMapped);
			} else {
				this.searchResults = resultsMapped;
			}
			this.results.emit(this.searchResults);
			this.totalCount = _.get(result, 'totalHits', 0);
			this.populateFilters(result);
		});
		/** Refresh "related" results subsection subscription */
		this.refresh$.pipe(
			tap(() => this.loadingRelated = true),
			switchMap(() => this.doRelatedSearch(this.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingRelated = false;
			this.relatedResults = result;
		});
		// Trigger initial search
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
		this.searchToken = this.query.query;
		this.pageOffset = 0;
		this.selectedSite = null;
		this.selectedType = null;
		this.refresh$.next('query');
	}

	/**
	 * Fires when user selects a site filter
	 * @param site the bucket with the site selection
	 */
	public onSiteSelected (site: Buckets) {
		this.pageOffset = 0;
		this.selectedSite = site;
		if (this.selectedSite.label.includes(I18n.get('_AllCategories_'))) {
			this.lastFiltered = null;
		} else {
			this.lastFiltered = 'site';
		}
		this.refresh$.next('filters');
	}

	/**
	 * Fires when user selects a site type
	 * @param type the bucket with the type selection
	 */
	public onTypeSelected (type: Buckets) {
		this.pageOffset = 0;
		this.selectedType = type;
		if (this.selectedType.label.includes(I18n.get('_AllTypes_'))) {
			this.lastFiltered = null;
		} else {
			this.lastFiltered = 'type';
		}
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
	 * @param type optional type filter
	 * @returns Observable with results
	 */
	private doSearch (query: SearchQuery, offset?: number, site?: Buckets, type?: Buckets):
		Observable<CDCSearchResponse | null> {
		return this.service.directCiscoSearch({
			...(
				this.context ? {
					context: this.context,
					customerId: this.customerId,
				} : { }
			),
			limit: this.pageSize.toString(),
			offset: offset.toString(),
			pitStop: this.pitStop,
			searchTokens: query.query,
			...this.buildFilterParam(site, type),
		})
		.pipe(catchError(err => {
			this.logger.error(`Search Query :: ${query} :: Error ${err}`);

			return of(null);
		}));
	}

	/**
	 * Get related ATX, ACC, eLearning, Community top results
	 * @param query search term
	 * @returns Observable with mapped results
	 */
	private doRelatedSearch (query: SearchQuery): Observable<RelatedResult []> {
		return this.service.allSearch({
			...(
				this.context ? {
					context: this.context,
					customerId: this.customerId,
				} : { }
			),
			limit: '1',
			offset: '0',
			pitStop: this.pitStop,
			searchTokens: query.query,
		})
		.pipe(
			map(result => {
				const results: RelatedResult[] = [];
				const atx = <AtxFuture>
					(_.get(result, ['atx-future', 'documents', 0, 'search', 0]));
				if (atx && atx['Session Name']) {
					results.push({
						description: atx['Session Description'],
						title: atx['Session Name'],
						type: 'atx',
						url: atx['Attendee Link'],
					});
				}
				const acc = <Acc>
					(_.get(result, ['acc', 'documents', 0, 'search', 0]));
				if (acc && acc.Title) {
					results.push({
						description: acc['Short Description'],
						title: acc.Title,
						type: 'acc',
						url: null,
					});
				}
				const learning = <ELearning>
					(_.get(result, ['elearning', 'documents', 0, 'search', 0]));
				if (learning && learning.title) {
					results.push({
						description: learning.description,
						title: learning.title,
						type: 'learning',
						url: learning.url,
					});
				}
				const community = <SearchCommunity>
					(_.get(result, ['communitySearch', 'documents', 0]));
				if (community && community.fields.title[0]) {
					results.push({
						description: community.fields.teaser[0],
						title: community.fields.title[0],
						type: 'community',
						url: community.fields.url[0],
					});
				}

				return results;
			}),
			catchError(err => {
				this.logger.error(`Related Search Query :: ${query} :: Error ${err}`);

				return of(null);
			}),
		);
	}

	/**
	 * Populates site/type filter options from a CDC Search response
	 * @param result the response value
	 */
	private populateFilters (result: CDCSearchResponse) {
		const facets = <Facets []> _.get(result, 'facets', []);
		const siteBuckets = _.get(
			facets.find((o: Facets) => o.label === 'Site'),
			'buckets',
		);
		const typeBuckets = _.get(
			facets.find((o: Facets) => o.label === 'Site Subcategory'),
			'buckets',
			[],
		);
		if (this.lastFiltered !== 'site' && siteBuckets) {
			this.siteOptions = siteBuckets.map((bucket: Buckets) => ({
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
		if (this.lastFiltered !== 'type' && typeBuckets) {
			this.typeOptions = typeBuckets.map((bucket: Buckets) => ({
				...bucket,
				label: `${bucket.label} (${bucket.count})`,
			}));
			this.typeOptions.unshift({
				filter: null,
				label: I18n.get('_AllTypes_'),
			});
			if (!this.selectedType) {
				this.selectedType = this.typeOptions[0];
			}
		}
		this.lastFiltered = null;
	}

	/**
	 * Builds a filter param based on the selected "site" and site "type" filters
	 * @param site selected site
	 * @param type selected type
	 * @returns object with the filter param
	 */
	private buildFilterParam (site: Buckets, type: Buckets) {
		if (!_.get(site, 'filter') && !_.get(type, 'filter')) {
			return { };
		}
		let filter = '';
		if (site && site.filter) {
			filter = `${site.filter}`;
		}
		if (type && type.filter) {
			filter = `${filter}${filter ? ',' : ''}${type.filter}`;
			this.logger.debug(`general-search.component :: buildFilterParam() :: ${
				JSON.stringify(type)}`);
		}

		return { filters: filter };
	}
}
