import { Component, TemplateRef, ViewChild } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, of, Subject } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { takeUntil, delay, map } from 'rxjs/operators';
/**
 * Interface representing our visual filters
 */
interface Filter {
	key: string;
	selected?: boolean;
	template?: TemplateRef<{}>;
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
		TemplateRef<{}>;
	@ViewChild('totalAssetsFilter', { static: true }) private totalAssetsFilterTemplate:
		TemplateRef<{}>;
	@ViewChild('deploymentStatusFilter', { static: true }) private deploymentStatusFilterTemplate:
		TemplateRef<{}>;
	public status = {
		isLoading: true,
	};
	public selectedProfileGroup: any;
	public selectedAssetSoftware: any;
	public filtered = false;
	public filters: Filter[];
	private destroy$ = new Subject();
	public view: 'profileGroups' | 'assets' | 'softwareVersions' = 'profileGroups';
	constructor (private logger: LogService) { }

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
				view: ['profileGroups', 'assets', 'softwareVersion']
			},
			{
				key: 'deploymentStatus',
				loading: true,
				selected: false,
				template: this.deploymentStatusFilterTemplate,
				data: [],
				title: I18n.get('_OsvOptimalSoftwareDeploymentStatus_'),
				view: ['profileGroups', 'assets']
			},
			{
				key: 'riskLevel',
				loading: true,
				selected: false,
				template: this.deploymentStatusFilterTemplate,
				data: [],
				title: I18n.get('_OsvRiskLevel_'),
				view: ['profileGroups']
			}
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
		).pipe(
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
	private getTotalAssetsCounts () {
		const totalAssetsFilter = _.find(this.filters, { key: 'totalAssets' });
		return of({}).pipe(
			map(() => {
				totalAssetsFilter.loading = false;
				totalAssetsFilter.data = [
					{
						value: 50,
						filter: 'profilegroups',
						label: I18n.get('_OsvProfileGroups_'),
						selected: false,
					},
					{
						value: 100,
						filter: 'assets',
						label: I18n.get('_OsvUngroupedAssets_'),
						selected: false,
					},
					{
						value: 50,
						filter: 'softwareversions',
						label: I18n.get('_OsvSoftwareVersions_'),
						selected: false,
					}
				]
			})
		)
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getDeploymentStatusCounts () {
		const deploymentStatusFilter = _.find(this.filters, { key: 'deploymentStatus' });
		return of({}).pipe(
			map(() => {
				deploymentStatusFilter.loading = false;
				deploymentStatusFilter.data = [
					{
						value: 100,
						filter: 'production',
						label: _.capitalize(I18n.get('_OsvProduction_')),
						selected: false,
					},
					{
						value: 50,
						filter: 'upgrade',
						label: _.capitalize(I18n.get('_OsvUpgrade_')),
						selected: false,
					},
					{
						value: 20,
						filter: 'none',
						label: _.capitalize(I18n.get('_OsvNone_')),
						selected: false,
					}
				]
			})
		)
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getRiskLevelStatusCounts () {
		const deploymentStatusFilter = _.find(this.filters, { key: 'riskLevel' });
		return of({}).pipe(
			map(() => {
				deploymentStatusFilter.loading = false;
				deploymentStatusFilter.data = [
					{
						value: 100,
						filter: 'low',
						label: _.capitalize(I18n.get('_OsvLow_')),
						selected: false,
					},
					{
						value: 50,
						filter: 'medium',
						label: _.capitalize(I18n.get('_OsvMedium_')),
						selected: false,
					},
					{
						value: 20,
						filter: 'high',
						label: _.capitalize(I18n.get('_OsvHigh_')),
						selected: false,
					}
				]
			})
		)
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Changes the view to either profileGroups or assets
	 * @param view view to set
	 */
	public selectView (view: 'profileGroups' | 'assets' | 'softwareVersions') {
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
