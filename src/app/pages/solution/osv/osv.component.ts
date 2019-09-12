import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, Subject, of } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { takeUntil, map, catchError } from 'rxjs/operators';
import {
	OSVService, SummaryResponse, OSVAsset,
} from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { VisualFilter } from '@interfaces';
import { CuiModalService } from '@cisco-ngx/cui-components';
import {
	ContactSupportComponent,
} from 'src/app/components/contact-support/contact-support.component';

/**
 * Interface representing our visual filters
 */
interface Filter extends VisualFilter {
	view?: string[];
}

/**
 * OptimalSoftwareVersion Component
 */
@Component({
	selector: 'app-osv',
	styleUrls: ['./osv.component.scss'],
	templateUrl: './osv.component.html',
})
export class OptimalSoftwareVersionComponent implements OnInit, OnDestroy {
	@ViewChild('assetTypeFilter', { static: true }) private assetTypeFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('totalAssetsFilter', { static: true }) private totalAssetsFilterTemplate:
		TemplateRef<{ }>;
	public status = {
		isLoading: true,
	};
	public customerId: string;
	public fullScreen = false;
	public selectedSoftwareGroup: any;
	public selectedAsset: OSVAsset;
	public tabIndex: number;
	public filtered = false;
	public filters: Filter[];
	public allFilters: Filter[];
	private destroy$ = new Subject();
	public view: 'swGroups' | 'assets' | 'swVersions' | undefined
		= 'swGroups';
	public appliedFilters = {
		assetType: '',
		deploymentStatus: [],
	};
	public assetGroupList: string[] = [];
	public operationalPreferencesList: string[] = [];
	public showProfileInfo = true;
	public doNotShowAgain = false;
	public cxLevel: number;

	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
		private cuiModalService: CuiModalService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		let list = I18n.get('_OsvAssetGroupList_');
		_.forEach(list, (item: string) => {
			this.assetGroupList.push(item);
		});
		list = I18n.get('_OsvOperationalPreferencesList_');
		_.forEach(list, (item: string) => {
			this.operationalPreferencesList.push(item);
		});
		if (window.localStorage.getItem('doNotShowSGInfo') === 'true') {
			this.showProfileInfo = false;
			this.doNotShowAgain = true;
		}
		this.buildFilters();
		this.loadData();
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.allFilters = [
			{
				key: 'totalAssets',
				loading: true,
				selected: true,
				seriesData: [],
				template: this.totalAssetsFilterTemplate,
				title: '',
				view: ['swGroups', 'assets', 'swVersions'],
			},
			{
				key: 'assetType',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.assetTypeFilterTemplate,
				title: I18n.get('_OsvAssets_'),
				view: ['assets'],
			},
		];
	}

	/**
	 * filter out the filters on the basis of selected view
	 */
	public filterByView () {
		this.filters = _.filter(this.allFilters, (filter: Filter) =>
			_.indexOf(filter.view, this.view) > -1,
		);
	}

	/**
	 * Function used to load all of the data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getSummary(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;
				this.logger.debug('assets software.component: loadData()::Done Loading');
			});
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getSummary () {

		const totalAssetsFilter = _.find(this.allFilters, { key: 'totalAssets' });
		const assetTypeFilter = _.find(this.allFilters, { key: 'assetType' });

		return this.osvService.getSummary({ customerId: this.customerId })
			.pipe(
				map((response: SummaryResponse) => {
					totalAssetsFilter.loading = false;
					assetTypeFilter.loading = false;
					totalAssetsFilter.seriesData = [{
						assets: response.assets,
						profiles: response.profiles,
						versions: response.versions,
					}];
					this.decideView(response);
					this.filterByView();
					assetTypeFilter.seriesData = _.compact(
						_.map(response.asset_profile, (value: number, key: string) => {
							if (value !== 0) {
								return {
									value,
									filter: key,
									label: key === 'assets_profile' ?
										I18n.get('_OsvAssetsOfSoftwareProfiles_')
										: I18n.get('_OsvIndependentAssets_'),
									selected: false,
								};
							}
						}));

				}),
				catchError(err => {
					this.logger.error('OSV Summary : getSummary() ' +
						`:: Error : (${err.status}) ${err.message}`);
					totalAssetsFilter.loading = false;
					assetTypeFilter.loading = false;
					this.view = undefined;

					return of();
				}),
			);
	}

	/**
	 * will show the default view based on response count
	 * @param response the counts summary of assets
	 */
	public decideView (response: SummaryResponse) {
		if (response.profiles > 0) {
			this.view = 'swGroups';
		} else if (response.assets > 0) {
			this.view = 'assets';
		} else if (response.versions > 0) {
			this.view = 'swVersions';
		} else {
			this.view = undefined;
		}
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Changes the view to either swProfiles or assets
	 * @param view view to set
	 */
	public selectView (view: 'swGroups' | 'assets' | 'swVersions') {
		if (this.view !== view) {
			this.view = view;
			this.reset();
		}
		this.filterByView();
	}

	/**
	 * Returns the current selected visual filters
	 * @returns the selected visual filters
	 */
	get selectedFilters () {

		return _.filter(this.filters, 'selected');
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {

			return _.filter(filter.seriesData, 'selected');
		}

		return [];
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading our assets
	 */
	public onSubfilterSelect (subfilter: string, filter: Filter) {
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}
		filter.selected = _.some(filter.seriesData, 'selected');
		if (filter.key === 'deploymentStatus') {
			this.appliedFilters.deploymentStatus =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
		}
		if (filter.key === 'assetType') {
			this.appliedFilters.assetType =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
		}
		this.appliedFilters = _.cloneDeep(this.appliedFilters);
		const totalFilter = _.find(this.filters, { key: 'totalAssets' });
		if (filter.selected) {
			totalFilter.selected = false;
			this.filtered = true;
		} else {
			const total = _.reduce(this.filters, (memo, f) => {
				if (!memo) {
					return _.some(f.seriesData, 'selected');
				}

				return memo;
			}, false);

			totalFilter.selected = !total;
			this.filtered = total;
		}
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		const totalFilter = _.find(this.filters, { key: 'totalAssets' });
		this.filtered = false;

		_.each(this.filters, (filter: Filter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
		totalFilter.selected = true;
		this.appliedFilters = {
			assetType: '',
			deploymentStatus: [],
		};
	}

	/**
	 * Open contact support modal
	 */
	public openContactSupport () {
		this.cuiModalService.showComponent(ContactSupportComponent, { contactExpert: true });
	}

	/**
	 * close all details panel
	 */
	public reset () {
		this.appliedFilters = {
			assetType: '',
			deploymentStatus: [],
		};
		this.selectedAsset = null;
		this.selectedSoftwareGroup = null;
	}

	/**
	 * hide/show profile Info modal on ngModal change
	 */
	public hideInfo () {
		if (this.doNotShowAgain) {
			window.localStorage.setItem('doNotShowSGInfo', 'true');
		} else {
			window.localStorage.setItem('doNotShowSGInfo', 'false');
		}
	}

	/**
	 * Called on 360 details panel close button click
	 */
	public onPanelClose () {
		_.set(this.selectedAsset, 'rowSelected', false);
		this.selectedAsset = null;

		_.set(this.selectedSoftwareGroup, 'rowSelected', false);
		this.selectedSoftwareGroup = null;
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
		}
	}
}
