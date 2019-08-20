import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { ArchitectureService } from '@sdp-api';
import { forkJoin, of } from 'rxjs';
import { VisualFilter } from '@interfaces';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';

@Component({
	selector: 'app-architecture-review',
	styleUrls: ['./architecture-review.component.scss'],
	templateUrl: './architecture-review.component.html',
})

export class ArchitectureReviewComponent implements OnInit {

	public tabIndex = 0;
	public activeRoute: any;
	public severityObj = { };
	public AssetsExceptionsCount: any;
	public filtered = false;
	public SeverityCount: any = [];
	public severityType: any = [];
	public newarray: any = [];
	public selectedFilter = {
		severity: '',
	};
	public filters: VisualFilter[];
	public severityList: any = [];

	public status = { inventoryLoading: true, isLoading: true };

	@ViewChild('exceptionsFilter', { static: true })
	private exceptionsFilterTemplate: TemplateRef<{ }>;

	public visualLabels: any = [
		{ label: 'DNAC', active: true, count: null },
		{ label: 'Devices', active: false, count: null },
	];

	constructor (private logger: LogService, private architectureService: ArchitectureService) {
		this.logger.debug('ArchitectureComponent Created!');
	}

	/**
	 * Used to call the getExceptionsCount,getAssetsExceptionsCount
	 *  and buildFilters function for Updating the Table
	 */
	public ngOnInit (): void {
		// this.architectureService.getExceptionsCount()
		// .subscribe(res => {
		// 	this.visualLabels[0].count = res.CBPRulesCount;
		// });

		// this.architectureService.getAssetsExceptionsCount()
		// .subscribe(res => {
		// 	this.visualLabels[1].count = res.AssetsExceptionCount;
		// });

		this.buildFilters();
	}

	/**
	 * Used to toggle the active element in visual labels
	 */
	public selectVisualLabel () {
		this.visualLabels.forEach(element => {
			element.active = !element.active;
		});
	}

	/**
	 * Initializes our visual filters
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'Exceptions',
				loading: true,
				selected: true,
				seriesData: [],
				template: this.exceptionsFilterTemplate,
				title: I18n.get('_Exceptions_'),
			},
		];
		// this.loadData();
	}


	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 */
	public onSubfilterSelect (subfilter: string, filter: VisualFilter) {
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');

		if (filter.key === 'Exceptions') {
			this.selectedFilter[filter.key] =
			_.map(_.filter(filter.seriesData, 'selected'), 'filter');
		}
		this.selectedFilter = _.cloneDeep(this.selectedFilter);

		// const totalFilter = _.find(this.filters, { key: 'total' });
		// if (filter.selected) {
		// 	totalFilter.selected = false;
		// 	this.filtered = true;
		// } else {
		// 	const total = _.reduce(this.filters, (memo, f) => {
		// 		if (!memo) {
		// 			return _.some(f.seriesData, 'selected');
		// 		}

		// 		return memo;
		// 	}, false);

		// 	totalFilter.selected = !total;
		// 	this.filtered = total;
		// }

	}

	/**
	 * Getter for selected filter
	 */
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}

	/**
	 * This function returns the selected filter from 
	 * array of objects
	 * @param key - it contains selected object
	 */
	public getSelectedSubFilters(key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}
	/**
	* Clears filters
	*/
	public clearFilters () {
		// const totalFilter = _.find(this.filters, { key: 'total' });
		this.filtered = false;
		_.each(this.filters, (filter: VisualFilter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
		this.selectedFilter = {
			severity: '',
		}
	}
	/**
	 * Fetches the exception counts for the visual filter
	 * @returns the edvisory counts
	 */
	// private getExceptionsCount () {
	// 	const exceptionFilter = _.find(this.filters, { key: 'Exceptions' });

	// 	return this.architectureService.getExceptionsCount()
	// 		.pipe(
	// 			map((data: any) => {
	// 				const series = [];

	// 				const High = _.get(data, 'HighRisk');

	// 				if (High && High > 0) {
	// 					series.push({
	// 						filter: 'High',
	// 						label: 'Compliant',
	// 						selected: false,
	// 						value: High,
	// 					});
	// 				}

	// 				const Medium = _.get(data, 'MediumRisk');

	// 				if (Medium && Medium > 0) {
	// 					series.push({
	// 						filter: 'Medium',
	// 						label: 'Non-Compliant',
	// 						selected: false,
	// 						value: Medium,
	// 					});
	// 				}

	// 				// const Low = _.get(data, 'LowRisk');

	// 				// if (Low && Low > 0) {
	// 				// 	series.push({
	// 				// 		filter: 'Low',
	// 				// 		label: 'Low',
	// 				// 		selected: false,
	// 				// 		value: Low,
	// 				// 	});
	// 				// }

	// 				exceptionFilter.seriesData = series;
	// 				exceptionFilter.loading = false;
	// 			}),
	// 			catchError(err => {
	// 				exceptionFilter.loading = false;
	// 				this.logger.error('architecture.component : getExceptionsCount() ' +
	// 					`:: Error : (${err.status}) ${err.message}`);

	// 				return of({ });
	// 			}),
	// 		);
	// }

	/**
	 * Function used to load all of the data
	 */
	// private loadData () {
	// 	this.status.isLoading = true;
	// 	forkJoin(
	// 		this.getExceptionsCount(),

	// 	)
	// 		.pipe(
	// 			map(() => { }),
	// 		)
	// 		.subscribe(() => {
	// 			this.status.isLoading = false;

	// 			if (window.Cypress) {
	// 				window.loading = false;
	// 			}

	// 			this.logger.debug('architecture.component : loadData() :: Finished Loading');
	// 		});
	// }

}
