import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchContext, SearchType, SearchEnum, SearchQuery } from '@interfaces';
import { SearchService, AssetPanelLinkService, DetailsPanelStackService } from '@services';

import { I18n } from '@cisco-ngx/cui-utils';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { SpecialSearchComponent } from './special-search/special-search.component';
import { AssetLinkInfo } from '@sdp-api';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Search Component
 */
@Component({
	selector: 'app-search',
	styleUrls: ['./search.component.scss'],
	templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
	@ViewChild(
		SpecialSearchComponent,
		{ static: false },
	) set content (component: SpecialSearchComponent) {
		this.specialSearch = component;
		this.cdr.detectChanges();
	} public specialSearch: SpecialSearchComponent;

	@ViewChild(SearchBarComponent, { static: false }) public searchBarComponent: SearchBarComponent;
	@Output('searchFocus') public searchFocus = new EventEmitter<boolean>();

	public searchText = '';
	public selectedSearch: SearchQuery;
	public searchType: SearchType;
	public generalSearch: SearchQuery;
	public searchContext: string;
	public generalSearchHeader: string;
	public hideSpecialSearch = true;
	public hideGeneralSearch = false;
	public generalSearchLoading = false;

	public status = {
		hidden: true,
	};

	public showAsset360 = false;
	public serialNumber: string;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });

	private destroy$ = new Subject();

	constructor (
		private cdr: ChangeDetectorRef,
		private searchService: SearchService,
		private assetPanelLinkService: AssetPanelLinkService,
		private detailsPanelStackService: DetailsPanelStackService,
		private logger: LogService,
	) { }

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.searchService.close$.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(() => {
			this.onClose();
		});
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Fires when the user makes a new search (hits enter or selects from typeahead)
	 * @param search the search text and type
	 */
	public onSearchChange (search: { text: string, type: SearchType, generalSearch: string }) {
		this.hideSpecialSearch = true;
		this.status.hidden = false;
		this.selectedSearch = { query: search.text };
		this.searchType = search.type;
		this.generalSearch = { query: search.generalSearch };
		/** Set general search header */
		switch (search.type.name) {
			case 'sn':
			case 'rma':
				this.generalSearchHeader = I18n.get('_RelatedToThisProduct_');
				break;
			case 'case':
				this.generalSearchHeader = I18n.get('_RelatedToThisCase_');
				break;
			default:
				this.generalSearchHeader = null;
		}
		/** Set search context right away for the general searches fired in parallel */
		if (search.type.name === SearchEnum.contract) {
			this.searchContext = SearchContext.contract;
		} else if (search.type.name === SearchEnum.sn) {
			this.searchContext = SearchContext.serialno;
		} else {
			this.searchContext = null;
		}
	}

	/**
	 * Listen to special search component's "hide" event emitter
	 * Hides it when emits true
	 * @param hide whether to hide the component
	 */
	public onHide (hide: boolean) {
		this.hideSpecialSearch = hide;
		// This will trigger a new search on the plain searchText if it was changed to something
		// else by the special search view
		if (hide) {
			this.searchType.name = SearchEnum.default;
			this.generalSearch = { query: this.searchText };
			this.searchContext = null;
			this.generalSearchHeader = null;
		}
		this.cdr.detectChanges();
	}

	/**
	 * Toggles the general search visibility.
	 * @param event Event object
	 * @param event.hide If true, hides general search. If false, displays it.
	 * @param event.searchString If provided, overwrites the general search string.
	 */
	public toggleGeneralSearch (
		event: { hide: boolean, searchString?: string, context?: SearchContext },
	) {
		this.hideGeneralSearch = event.hide;
		if (event.searchString) {
			this.generalSearch = { query: event.searchString };
		}
		if (event.context) {
			this.searchContext = event.context;
		} else {
			this.searchContext = null;
		}
		this.cdr.detectChanges();
	}

	/**
	 * Close search results modal on click
	 */
	public onClose () {
		this.status.hidden = true;
		this.searchFocus.emit(false);
		this.searchText = '';
	}

	/**
	 * Determines whether to emit the searchFocus event or not
	 * @param focus True if focus, false if blur
	 */
	public onSearchFocus (focus: boolean) {
		if (this.status.hidden) {
			this.searchFocus.emit(focus);
		}
	}

	/**
	 * Used for Opening the Asset 360 View data
	 * @param assetObj contains asset details
	 */
	public showAssetDetails (assetObj) {
		this.onClose();
		this.serialNumber = assetObj.serialNumber;
		this.assetPanelLinkService.getAssetLinkData({
			customerId: assetObj.customerId,
			serialNumber: [assetObj.serialNumber],
		})
		.pipe(takeUntil(this.destroy$))
		.subscribe(response => {
			this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
			this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
			this.showAsset360 = true;
		},
		err => {
			this.showAsset360 = true;
			this.logger.error(
				'RccComponent : getAssetLinkData() ' +
			`:: Error : (${err.status}) ${err.message}`);
		});

	}
}
