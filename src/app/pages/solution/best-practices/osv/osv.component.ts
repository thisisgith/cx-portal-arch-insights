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
	@ViewChild('totalAssetsFilter', { static: true }) private totalAssetsFilterTemplate:
		TemplateRef<{}>;
	public status = {
		isLoading: true,
	};
	public filters: Filter[];
	private destroy$ = new Subject();

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
				data: []
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
						value: 100,
						filter: 'assets',
						label: _.capitalize('assets'),
						selected: false,
					},
					{
						value: 50,
						filter: 'profilegroups',
						label: _.capitalize('profilegroups'),
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
}
