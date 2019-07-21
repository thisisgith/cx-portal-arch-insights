import { Component, TemplateRef, ViewChild } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, Subject } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { takeUntil, map } from 'rxjs/operators';
import {
	OSVService,
	DeviceCountResponse,
	DeviceCount,
	RiskCountResponse,
	RiskCount,
	DeploymentStatusCountResponse,
	DeploymentStatusCount,
	DERecommendationsResponse,
} from '@sdp-api';

/** Our current customerId */
const customerId = '2431199';

/**
 * Interface representing our visual filters
 */
interface Filter {
	key: string;
	selected?: boolean;
	template?: TemplateRef<{ }>;
	title?: string;
	loading: boolean;
	data: {
		filter: string,
		label: string,
		selected: boolean,
		value: number,
	}[];
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
export class OptimalSoftwareVersionComponent {
	@ViewChild('riskLevelFilter', { static: true }) private riskLevelFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('totalAssetsFilter', { static: true }) private totalAssetsFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('deploymentStatusFilter', { static: true }) private deploymentStatusFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('deRecommendationFilter', { static: true }) private deRecommendationFilterTemplate:
		TemplateRef<{ }>;
	public status = {
		isLoading: true,
	};
	public selectedProfileGroup: any;
	public selectedAssetSoftware: any;
	public filtered = false;
	public filters: Filter[];
	private destroy$ = new Subject();
	public view: 'swProfiles' | 'assetsSwProfiles' | 'assets' | 'swVersions'
		= 'swProfiles';
	constructor (private logger: LogService,
		private osvService: OSVService) { }

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.buildFilters();
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
				template: this.totalAssetsFilterTemplate,
				data: [],
				view: ['swProfiles', 'assets', 'swVersions', 'assetsSwProfiles'],
			},
			{
				key: 'deploymentStatus',
				loading: true,
				selected: false,
				template: this.deploymentStatusFilterTemplate,
				data: [],
				title: I18n.get('_OsvOptimalSoftwareDeploymentStatus_'),
				view: ['swProfiles', 'assets'],
			},
			{
				key: 'riskLevel',
				loading: true,
				selected: false,
				template: this.riskLevelFilterTemplate,
				data: [],
				title: I18n.get('_OsvRiskLevel_'),
				view: ['swProfiles'],
			},
			{
				key: 'deRecommendation',
				loading: true,
				selected: false,
				template: this.deRecommendationFilterTemplate,
				data: [],
				title: I18n.get('_OsvDERecommendation_'),
				view: ['assetsSwProfiles'],
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
			this.getTotalAssetsCounts(),
			this.getDeploymentStatusCounts(),
			this.getRiskLevelStatusCounts(),
			this.getDERecommendationCounts(),
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
	 * Fetches the DE Recommendation Counts
	 * @returns the total counts observable of DE Recommendations
	 */
	private getDERecommendationCounts () {
		const deRecommendationFilter = _.find(this.filters, { key: 'deRecommendation' });
		return this.osvService.getDERecommendations({ customerId })
			.pipe(
				map((response: DERecommendationsResponse) => {
					deRecommendationFilter.loading = false;
					deRecommendationFilter.data = _.compact(
						_.map(response, (value: DeploymentStatusCount) => {
							if (value !== 0) {
								return {
									value: value.deviceCount,
									filter: value.status,
									label: _.capitalize(value.status),
									selected: false,
								};
							}
						}));
				}),
			);
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getTotalAssetsCounts () {

		const totalAssetsFilter = _.find(this.filters, { key: 'totalAssets' });
		return this.osvService.getDeviceCount({ customerId })
			.pipe(
				map((response: DeviceCountResponse) => {
					totalAssetsFilter.loading = false;
					totalAssetsFilter.data[0] = { };
					_.map(response, (d: DeviceCount) => {
						totalAssetsFilter.data[0][d.type] = d.deviceCount;
					});
				}),
			);
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getDeploymentStatusCounts () {
		const deploymentStatusFilter = _.find(this.filters, { key: 'deploymentStatus' });
		return this.osvService.getDeploymentStatusCount({ customerId })
			.pipe(
				map((response: DeploymentStatusCountResponse) => {
					deploymentStatusFilter.loading = false;
					deploymentStatusFilter.data = _.compact(
						_.map(response, (value: DeploymentStatusCount) => {
							if (value !== 0) {
								return {
									value: value.deviceCount,
									filter: value.status,
									label: _.capitalize(value.status),
									selected: false,
								};
							}
						}));
				}),
			);
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getRiskLevelStatusCounts () {
		const riskLevelStatusFilter = _.find(this.filters, { key: 'riskLevel' });
		return this.osvService.getRiskCount({ customerId })
			.pipe(
				map((response: RiskCountResponse) => {
					riskLevelStatusFilter.loading = false;
					riskLevelStatusFilter.data = _.compact(_.map(response, (value: RiskCount) => {
						if (value !== 0) {
							return {
								value: value.deviceCount,
								filter: value.risk,
								label: _.capitalize(value.risk),
								selected: false,
							};
						}
					}));
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
	public selectView (view: 'swProfiles' | 'assetsSwProfiles' | 'assets' | 'swVersions') {
		if (this.view !== view) {
			this.view = view;
		}
	}

	/**
	 * Selects all the sub filters based on a list of parameters
	 * @param params the array list of params
	 * @param key the key to search for in the filters
	 */
	private selectSubFilters (params: string[], key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {
			_.each(filter.data, d => {
				if (params.indexOf(d.filter) > -1) {
					this.onSubfilterSelect(d.filter, filter, false);
				}
			});
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

			return _.filter(filter.data, 'selected');
		}
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading our assets
	 */
	public onSubfilterSelect (subfilter: string, filter: Filter, reload: boolean = true) {
		const sub = _.find(filter.data, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}
		filter.selected = _.some(filter.data, 'selected');
		const totalFilter = _.find(this.filters, { key: 'totalAssets' });
		if (filter.selected) {
			totalFilter.selected = false;
			this.filtered = true;
		} else {
			const total = _.reduce(this.filters, (memo, f) => {
				if (!memo) {
					return _.some(f.data, 'selected');
				}

				return memo;
			}, false);

			totalFilter.selected = !total;
			this.filtered = total;
			if (reload) {
				// todo reload
			}
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
			_.each(filter.data, f => {
				f.selected = false;
			});
		});
		totalFilter.selected = true;
	}
}
