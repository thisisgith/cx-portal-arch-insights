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
		filter : [],
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

	public titlesList = [
		{ title :  I18n.get('_ArchitectureOverallReadiness_') },
		{ title :  I18n.get('_ArchitectureSDAReadiness_') },
		{ title :  I18n.get('_ArchitectureAssuranceReadiness_') },
		{ title :  I18n.get('_ArchitectureSwimReadiness_') },
		{ title :  I18n.get('_ArchitecturePnpReady_') },
	];

	@ViewChild('exceptionsFilter', { static: true })
	private exceptionsFilterTemplate: TemplateRef<{ }>;

	@ViewChild('sdaReadinessFilter', { static: true })
	private sdaReadinessFilterTemplate: TemplateRef<{ }>;

	@ViewChild('assuranceReadinessFilter', { static: true })
	private assuranceReadinessTemplate: TemplateRef<{ }>;

	@ViewChild('swimReadinessFilter', { static: true })
	private swimReadinessFilterTemplate: TemplateRef<{ }>;

	@ViewChild('devicesOnboardingReadinessFilter', { static: true })
	private devicesOnboardingReadinessFilterTemplate: TemplateRef<{ }>;

	public visualLabels = [
		{
			active: true,
			count: 0,
			key: 'dnac',
			label: I18n.get('_ArchitectureDNAC_'),
		},
		{
			active: false,
			count: 0,
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
		this.visualLabels.forEach(element => {
			if (element !== label) {
				element.active = false;
				this.filters.forEach(item => {
					item.title = '';
				});
			} else {
				this.filters.map((ele, index) => {
					ele.title = this.titlesList[index].title;
				});
			}
		});
	}

	/**
	 * Initializes our visual filters
	 */
	public buildFilters () {
		this.filters = [
			{
				key: 'overallCompliance',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.exceptionsFilterTemplate,
				title: '',
			},
			{
				key: 'sdaCompliance',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.sdaReadinessFilterTemplate,
				title: '',
			},
			{
				key: 'assuranceCompliance',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.assuranceReadinessTemplate,
				title: '',
			},
			{
				key: 'swimCompliance',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.swimReadinessFilterTemplate,
				title: '',
			},
			{
				key: 'pnpCompliance',
				loading: true,
				selected: false,
				seriesData: [],
				template: this.devicesOnboardingReadinessFilterTemplate,
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

		this.filters.forEach(element => {
			if (element.key === filter.key) {
				this.selectedFilter.filter =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
				this.selectedFilter.title = this.selectedFilter.filter.length > 0 ?
				_.get(filter, 'key') : '';
			} else {
				element.selected = false;
			}
		});
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

	public setSdaCompliantValue (obj: any) {
		let sdaCompliant = 0;

		if (obj.hasOwnProperty('Yes') && obj.hasOwnProperty('Warning')) {
			sdaCompliant = obj.Yes + obj.Warning;
		} else if (obj.hasOwnProperty('Warning'))  {
			sdaCompliant = obj.Warning;
		} else {
			sdaCompliant = obj.Yes;
		}

		return sdaCompliant;
	}

	/**
	 * Fetches the exception counts for the visual filter
	 * @returns the edvisory counts
	 */
	public getDevicesCount () {
		const exceptionFilter = _.find(this.filters, { key: 'overallCompliance' });
		const sdaReadinessFilter = _.find(this.filters, { key: 'sdaCompliance' });
		const assuranceReadinessFilter = _.find(this.filters, { key: 'assuranceCompliance' });
		const swimReadinessDataFilter = _.find(this.filters, { key: 'swimCompliance' });
		const pnpFilter = _.find(this.filters, { key: 'pnpCompliance' });

		return this.architectureService.getSDAReadinessCount(this.params)
			.pipe(
				takeUntil(this.destroy$),
				map((data: any) => {
					const series = [];
					const Compliant = _.get(data, 'overallCompliance.Yes');

					if (Compliant && Compliant > 0) {
						series.push({
							filter: 'Yes',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: Compliant,
							color: '#92dde4',
						});
					}

					const NonCompliant = _.get(data, 'overallCompliance.No');

					if (NonCompliant && NonCompliant > 0) {
						series.push({
							filter: 'No',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: NonCompliant,
							color: '#8ab6d0',
						});
					}

					const NotAvailable = _.get(data, 'overallCompliance.NE');

					if (NotAvailable && NotAvailable > 0) {
						series.push({
							filter: 'NE',
							label: I18n.get('_ArchitectureNotAvailable_'),
							selected: false,
							value: NotAvailable,
							color: '#c8d4d7',
						});
					}

					exceptionFilter.seriesData = series;
					exceptionFilter.loading = false;

					const sdaSeriesData = [];

					const compliantValue = _.get(data, 'sdaCompliance');

					const sdaCompliant = this.setSdaCompliantValue(compliantValue);

					if (sdaCompliant && sdaCompliant > 0) {
						sdaSeriesData.push({
							filter: 'Yes',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: sdaCompliant,
							color: '#92dde4',
						});
					}

					const sdaNonCompliant = _.get(data, 'sdaCompliance.No');

					if (sdaNonCompliant && sdaNonCompliant > 0) {
						sdaSeriesData.push({
							filter: 'No',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: sdaNonCompliant,
							color: '#8ab6d0',
						});
					}

					const sdaNotAvailable = _.get(data, 'sdaCompliance.NE');

					if (sdaNotAvailable && sdaNotAvailable > 0) {
						sdaSeriesData.push({
							filter: 'NE',
							label: I18n.get('_ArchitectureNotAvailable_'),
							selected: false,
							value: sdaNotAvailable,
							color:  '#c8d4d7',
						});
					}

					sdaReadinessFilter.seriesData = sdaSeriesData;
					sdaReadinessFilter.loading = false;

					const assuranceSeriesData = [];
					const assuranceCompliant = _.get(data, 'assuranceCompliance.Yes');

					if (assuranceCompliant && assuranceCompliant > 0) {
						assuranceSeriesData.push({
							filter: 'Yes',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: assuranceCompliant,
							color: '#92dde4',
						});
					}

					const assuranceNonCompliant = _.get(data, 'assuranceCompliance.No');

					if (assuranceNonCompliant && assuranceNonCompliant > 0) {
						assuranceSeriesData.push({
							filter: 'No',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: assuranceNonCompliant,
							color: '#8ab6d0',
						});
					}

					const assuranceNotAvailable = _.get(data, 'assuranceCompliance.NE');

					if (assuranceNotAvailable && assuranceNotAvailable > 0) {
						assuranceSeriesData.push({
							filter: 'NE',
							label: I18n.get('_ArchitectureNotAvailable_'),
							selected: false,
							value: assuranceNotAvailable,
							color: '#c8d4d7',
						});
					}

					assuranceReadinessFilter.seriesData = assuranceSeriesData;
					assuranceReadinessFilter.loading = false;

					const swimReadinessData = [];
					const swimCompliant = _.get(data, 'swimCompliance.Yes');

					if (swimCompliant && swimCompliant > 0) {
						swimReadinessData.push({
							filter: 'Yes',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: swimCompliant,
							color: '#92dde4',
						});
					}

					const swimNonCompliant = _.get(data, 'swimCompliance.No');

					if (swimNonCompliant && swimNonCompliant > 0) {
						swimReadinessData.push({
							filter: 'No',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: swimNonCompliant,
							color: '#8ab6d0',
						});
					}

					const swimNotAvailable = _.get(data, 'swimCompliance.NE');

					if (swimNotAvailable && swimNotAvailable > 0) {
						swimReadinessData.push({
							filter: 'NE',
							label: I18n.get('_ArchitectureNotAvailable_'),
							selected: false,
							value: swimNotAvailable,
							color: '#c8d4d7',
						});
					}

					swimReadinessDataFilter.seriesData = swimReadinessData;
					swimReadinessDataFilter.loading = false;

					const pnpReadinessData = [];
					const pnpCompliant = _.get(data, 'pnpCompliance.Yes');

					if (pnpCompliant && pnpCompliant > 0) {
						pnpReadinessData.push({
							filter: 'Yes',
							label: I18n.get('_ArchitectureCompliant_'),
							selected: false,
							value: pnpCompliant,
							color: '#92dde4',
						});
					}

					const pnpNonCompliant = _.get(data, 'pnpCompliance.No');

					if (pnpNonCompliant && pnpNonCompliant > 0) {
						pnpReadinessData.push({
							filter: 'No',
							label: I18n.get('_ArchitectureNonCompliant_'),
							selected: false,
							value: pnpNonCompliant,
							color: '#8ab6d0',
						});
					}

					const pnpNotAvailable = _.get(data, 'pnpCompliance.NE');

					if (pnpNotAvailable && pnpNotAvailable > 0) {
						pnpReadinessData.push({
							filter: 'NE',
							label: I18n.get('_ArchitectureNotAvailable_'),
							selected: false,
							value: pnpNotAvailable,
							color: '#c8d4d7',
						});
					}

					pnpFilter.seriesData = pnpReadinessData;
					pnpFilter.loading = false;

				}),
				catchError(err => {
					exceptionFilter.loading = false;
					sdaReadinessFilter.loading = false;
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
