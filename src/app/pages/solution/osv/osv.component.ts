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
	@ViewChild('deploymentStatusFilter', { static: true }) private deploymentStatusFilterTemplate:
		TemplateRef<{ }>;
	public status = {
		isLoading: true,
	};
	public customerId: string;
	public fullScreen = false;
	public selectedProfileGroup: any;
	public selectedAsset: OSVAsset;
	public filtered = false;
	public filters: Filter[];
	private destroy$ = new Subject();
	public view: 'swProfiles' | 'assets' | 'swVersions'
		= 'assets';
	public appliedFilters = {
		assetType: '',
		deploymentStatus: [],
	};
	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.buildFilters();
	}

	/**
	 * refresh the deploymentstatus pie chart
	 */
	public onAssetStatusUpdate () {
		this.loadData();
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'totalAssets',
				loading: true,
				selected: true,
				seriesData: [],
				template: this.totalAssetsFilterTemplate,
				title: '',
				view: ['swProfiles', 'assets', 'swVersions'],
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
			{
				key: 'deploymentStatus',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.deploymentStatusFilterTemplate,
				title: I18n.get('_OsvOptimalSoftwareDeploymentStatus_'),
				view: ['assets'],
			},
		];
		this.loadData();
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

		const totalAssetsFilter = _.find(this.filters, { key: 'totalAssets' });
		const deploymentStatusFilter = _.find(this.filters, { key: 'deploymentStatus' });
		const assetTypeFilter = _.find(this.filters, { key: 'assetType' });

		return this.osvService.getSummary({ customerId: this.customerId })
			.pipe(
				map((response: SummaryResponse) => {
					totalAssetsFilter.loading = false;
					deploymentStatusFilter.loading = false;
					assetTypeFilter.loading = false;
					totalAssetsFilter.seriesData = [{
						assets: response.assets,
						profiles: response.profiles,
						versions: response.versions,
					}];
					deploymentStatusFilter.seriesData = _.compact(
						_.map(response.deployment, (value: number, key: string) => {
							if (value !== 0) {
								return {
									value,
									filter: key,
									label: _.capitalize(key),
									selected: false,
								};
							}
						}));

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
					deploymentStatusFilter.loading = false;
					assetTypeFilter.loading = false;

					return of({ });
				}),
			);
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
	public selectView (view: 'swProfiles' | 'assets' | 'swVersions') {
		if (this.view !== view) {
			this.view = view;
		}
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
}
