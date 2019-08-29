import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { ArchitectureReviewService } from '@sdp-api';
import { forkJoin, of, Subject } from 'rxjs';
import { VisualFilter } from '@interfaces';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * it ccreates component
 */
@Component({
	selector: 'app-architecture-review',
	styleUrls: ['./architecture-review.component.scss'],
	templateUrl: './architecture-review.component.html',
})

export class ArchitectureReviewComponent implements OnInit {

	public customerId: string;
	public filtered = false;
	public selectedFilter = {
		severity: '',
	};
	public filters: VisualFilter[];

	public status = { inventoryLoading: true, isLoading: true };

	private destroy$ = new Subject();

	@ViewChild('exceptionsFilter', { static: true })
	private exceptionsFilterTemplate: TemplateRef<{ }>;

	public visualLabels = [
		{ label: I18n.get('_ArchitectureDNAC_'), active: true, count: null },
		{ label: I18n.get('_ArchitectureDevices_'), active: false, count: null },
	];

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureReviewService,
		private route: ActivatedRoute,
		) {
		this.logger.debug('ArchitectureReviewComponent Created!');
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Used to call the getDevicesCount,getDnacCount
	 *  and buildFilters function for Updating the Table
	 */
	public ngOnInit (): void {
		this.architectureService.getDevicesCount({ customerId: this.customerId })
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(res => {
				this.visualLabels[1].count = res.TotalCounts;
			});

		this.architectureService.getDnacCount({ customerId: this.customerId })
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(res => {
				this.visualLabels[0].count = res.TotalCounts;
			});

		this.buildFilters();
	}

	/**
	 * Used to toggle the active element in visual labels
	 * @param label - pass the label
	 */
	public selectVisualLabel (label: any) {
		label.active = true;
		this.visualLabels.forEach(element => {
			if (element !== label) {
				element.active = false;
			}
		});
	}

	/**
	 * Initializes our visual filters
	 */
	public buildFilters () {
		this.filters = [
			{
				key: 'exceptions',
				loading: true,
				selected: true,
				seriesData: [],
				template: this.exceptionsFilterTemplate,
				title: I18n.get('_ArchitectureSDAReadiness_'),
			},
		];
		this.loadData();
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

		if (filter.key === 'exceptions') {
			this.selectedFilter[filter.key] =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
		}
		this.selectedFilter = _.cloneDeep(this.selectedFilter);
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
	 * @returns selectedSubFilter
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}
	/**
	 * Clears filters
	 */
	public clearFilters () {
		this.filtered = false;
		_.each(this.filters, (filter: VisualFilter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
		this.selectedFilter = {
			severity: '',
		};
	}

	/**
	 * Fetches the exception counts for the visual filter
	 * @returns the edvisory counts
	 */
	public getDevicesCount () {
		const exceptionFilter = _.find(this.filters, { key: 'exceptions' });

		return this.architectureService.getSDAReadinessCount({ customerId: this.customerId })
			.pipe(
				takeUntil(this.destroy$),
				map((data: any) => {
					const series = [];

					const Compliant = _.get(data, 'Compliant');

					if (Compliant && Compliant > 0) {
						series.push({
							filter: 'compliant',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: Compliant,
						});
					}

					const NonCompliant = _.get(data, 'Non-Compliant');

					if (NonCompliant && NonCompliant > 0) {
						series.push({
							filter: 'noncompliant',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: NonCompliant,
						});
					}

					exceptionFilter.seriesData = series;
					exceptionFilter.loading = false;
				}),
				catchError(err => {
					exceptionFilter.loading = false;
					this.logger.error('architecture.component : getDevicesCount() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * Function used to load all of the data
	 */
	public loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getDevicesCount(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;

				this.logger.debug('architecture.component : loadData() :: Finished Loading');
			});
	}

}
