import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { ArchitectureReviewService, ISeverity, IStatus } from '@sdp-api';
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
	public selectedFilter: ISeverity = {
		isClearAllSelected: false,
		severity: '',
		title: '',
	};
	public params = {
		collectionId : '',
		customerId : '',
	};
	public filters: VisualFilter[];

	public status: IStatus = { inventoryLoading: true, isLoading: true };

	private destroy$ = new Subject();

	public collectionId: any;

	@ViewChild('exceptionsFilter', { static: true })
	private exceptionsFilterTemplate: TemplateRef<{ }>;

	public visualLabels = [
		{
			active: true,
			count: null,
			key: 'dnac',
			label: I18n.get('_ArchitectureDNAC_'),
		},
		{
			active: false,
			count: null,
			key: 'devices',
			label: I18n.get('_ArchitectureSystems_'),
		},
	];

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureReviewService,
		private route: ActivatedRoute,
		) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Used to call the getDevicesCount,getDnacCount
	 *  and buildFilters function for Updating the Table
	 */
	public ngOnInit (): void {
		this.getCollectionId();
	}

	/**
	 * Method to fetch collectionId
	 */

	public getCollectionId () {
		this.architectureService.getCollectionDetails({ customerId: this.customerId })
		.subscribe(res => {
			this.params.collectionId = _.get(res, 'collectionId');
			this.getAllDevicesCount();
			this.getDnacCount();
			this.buildFilters();
		});
	}

	/**
	 * method to get devices count
	 */

	public getAllDevicesCount () {
		this.architectureService.getDevicesCount(this.params)
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(res => {
			const devices = _.find(this.visualLabels, { key: 'devices' });
			devices.count = res.totalCount;
		},
		err => {
			this.logger.error('Count of Devices' +
				'  : getDevicesCount() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * method to get devices count
	 */
	public getDnacCount () {
		this.architectureService.getDnacCount(this.params)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(res => {
				const dnac = _.find(this.visualLabels, { key: 'dnac' });
				dnac.count = res.totalCount;
			},
			err => {
				this.logger.error('Count of Dnac' +
					'  : getDnacCount() ' +
					`:: Error : (${err.status}) ${err.message}`);
			});
	}

	/**
	 * Used to toggle the active element in visual labels
	 * @param label - pass the label
	 */
	public selectVisualLabel (label: any) {
		label.active = true;
		const filter = _.find(this.filters, { key: 'sda' });
		this.visualLabels.forEach(element => {
			if (element !== label) {
				element.active = false;
				filter.title = '';
			} else {
				filter.title = I18n.get('_ArchitectureOverallReadiness_');
			}
		});
	}

	/**
	 * Initializes our visual filters
	 */
	public buildFilters () {
		this.filters = [
			{
				key: 'sda',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.exceptionsFilterTemplate,
				title: '',
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

		if (filter.key === 'sda') {
			this.selectedFilter[filter.key] =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
			this.selectedFilter.title = this.selectedFilter[filter.key].length > 0 ?
			_.get(filter, 'key') : '';
		}
		this.selectedFilter.isClearAllSelected = false;
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
			isClearAllSelected: true,
			severity: '',
		};
	}

	/**
	 * Fetches the exception counts for the visual filter
	 * @returns the edvisory counts
	 */
	public getDevicesCount () {
		const exceptionFilter = _.find(this.filters, { key: 'sda' });

		return this.architectureService.getSDAReadinessCount(this.params)
			.pipe(
				takeUntil(this.destroy$),
				map((data: any) => {
					const series = [];
					const Compliant = _.get(data, 'overallCompliance.Yes');

					if (Compliant && Compliant > 0) {
						series.push({
							filter: 'compliant',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: Compliant,
						});
					}

					const NonCompliant = _.get(data, 'overallCompliance.No');

					if (NonCompliant && NonCompliant > 0) {
						series.push({
							filter: 'noncompliant',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: NonCompliant,
						});
					}

					const NotAvailable = _.get(data, 'overallCompliance.NA');

					if (NotAvailable && NotAvailable > 0) {
						series.push({
							filter: 'notAvailable',
							label: I18n.get('_ArchitectureNotAvailable_'),
							selected: false,
							value: NotAvailable,
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
