import {
	Component,
	Input,
	OnInit,
	TemplateRef,
	ViewChild,
	OnChanges,
	SimpleChanges,
	Output,
	EventEmitter,
} from '@angular/core';

import {
	AlertData,
	Announcement,
	RMA,
} from '@interfaces';
import * as _ from 'lodash';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	advisorySeverities,
	caseSeverities,
} from '@classes';
import {
	AlertResults,
} from '@services';

/**
 * Interface representing our global filters
 */
interface Filter {
	count?: number;
	data?: AlertData[];
	filtered: boolean;
	key: string;
}

/**
 * The interface for the alert details
 */
interface AlertDetails {
	key: string;
	percentAffected?: number;
	data: AlertData;
}

/**
 * The Alert Sidebar component
 */
@Component({
	selector: 'alert-sidebar',
	styleUrls: ['./alert-sidebar.component.scss'],
	templateUrl: './alert-sidebar.component.html',
})
export class AlertSidebarComponent implements OnInit, OnChanges {

	@Input() public alertResults: AlertResults;
	@Input() public alertDetails: AlertDetails;
	@Input() public collapsed = false;
	@Input() public totalAssets = 0;
	@Output() public onCollapse = new EventEmitter();
	@Output() public onSelect = new EventEmitter();

	@ViewChild('advisoryDetails') private advisoryDetails: TemplateRef<{ }>;
	@ViewChild('advisoryHeader') private advisoryHeader: TemplateRef<{ }>;
	@ViewChild('advisorySummary') private advisorySummary: TemplateRef<{ }>;

	@ViewChild('bugDetails') private bugDetails: TemplateRef<{ }>;
	@ViewChild('bugHeader') private bugHeader: TemplateRef<{ }>;

	@ViewChild('caseDetails') private caseDetails: TemplateRef<{ }>;
	@ViewChild('caseHeader') private caseHeader: TemplateRef<{ }>;
	@ViewChild('caseSummary') private caseSummary: TemplateRef<{ }>;

	@ViewChild('contractDetails') private contractDetails: TemplateRef<{ }>;
	@ViewChild('contractHeader') private contractHeader: TemplateRef<{ }>;
	@ViewChild('contractSummary') private contractSummary: TemplateRef<{ }>;

	@ViewChild('fieldNoticeDetails') private fieldNoticeDetails: TemplateRef<{ }>;
	@ViewChild('fieldNoticeHeader') private fieldNoticeHeader: TemplateRef<{ }>;

	@ViewChild('licenseDetails') private licenseDetails: TemplateRef<{ }>;
	@ViewChild('licenseHeader') private licenseHeader: TemplateRef<{ }>;

	@ViewChild('lifecycleDetails') private lifecycleDetails: TemplateRef<{ }>;
	@ViewChild('lifecycleHeader') private lifecycleHeader: TemplateRef<{ }>;

	@ViewChild('rmaDetails') private rmaDetails: TemplateRef<{ }>;
	@ViewChild('rmaHeader') private rmaHeader: TemplateRef<{ }>;
	@ViewChild('rmaSummary') private rmaSummary: TemplateRef<{ }>;

	public details;
	public filters: Filter[];

	private cachedData;

	/**
	 * Show the default results when no filters are applied
	 */
	private defaultResults () {
		_.each(this.filters, (filter: Filter) => {
			filter.data = [_.get(this.cachedData, filter.key)[0]];
		});
	}

	/**
	 * Handled collapsing/expanding the sidebar
	 * @param collapsed the status of the collapse
	 */
	public collapse (collapsed: boolean) {
		this.collapsed = collapsed;
		this.onCollapse.emit(this.collapsed);
	}

	/**
	 * Parses the data for the global filters
	 */
	private parseFilterData () {
		_.forOwn(this.alertResults, alert => {
			_.forOwn(alert, (data: AlertData, key: string) => {
				const filter = _.find(this.filters, { key });

				if (filter) {
					const sortedData = _.orderBy(data, ['severity'], ['asc']);
					filter.count = sortedData.length;
					if (sortedData.length) {
						this.cachedData[key] = sortedData;
					}
				}
			});
		});
		this.defaultResults();
	}

	/**
	 * Filter the results
	 * @TODO Re-enable when filtering is adding back into the designs
	 * @param filter the filter to apply
	 */
	// public filterResults (filter: Filter) {
	// 	filter.filtered = !filter.filtered;

	// 	const allFilters = _.every(this.filters, { filtered: true });

	// 	if (allFilters) {
	// 		this.defaultResults();
	// 	} else {
	// 		filter.data = filter.filtered ? _.get(this.cachedData, filter.key) : [];
	// 	}
	// }

	/**
	 * Calculate the affected percentage
	 */
	private calculateAffected () {
		const affected = _.get(this.alertDetails, ['data', 'affected']);

		if (affected) {
			this.alertDetails.percentAffected = Math.floor((affected / this.totalAssets) * 100);
		}
	}

	/**
	 * Calculates if an RMA is scheduled for delivery
	 * @param details the RMA details
	 * @returns the delivery date or null
	 */
	public rmaDelivery (details: RMA): string | null {
		const delivery = _.find(details.timeline, { title: 'Delivery' });

		return delivery ? delivery.date : null;
	}

	/**
	 * Adjusts the timeline for calculations
	 * @param details the details
	 * @param order the sort order
	 * @returns object array representing the adjusted timeline
	 */
	public timeline (details: RMA | Announcement, order: string = 'desc'):
		{ title: string, date: string, past?: boolean }[] {
		const today = new Date();

		return _.map(_.orderBy(details.timeline, ['date'], [order]), event => {
			const currentStatus = _.get(details, 'status');
			event.past = ((new Date(event.date).getTime() < today.getTime()));

			if (currentStatus && currentStatus === event.title) {
				event.past = false;
			}

			return event;
		});
	}

	/**
	 * The details to show
	 * @param data the data
	 * @param key the key the data is assigned to
	 */
	public showDetails (data: AlertData, key: string) {
		this.alertDetails = { data, key };
		this.onSelect.emit({ key, data, selected: true });
		this.calculateAffected();
	}

	/**
	 * OnChanges Functionality
	 * @param changes The changes found
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const alertDetails = _.get(changes, 'alertDetails',
			{ currentValue: null, firstChange: false });
		if (alertDetails.currentValue && !alertDetails.firstChange) {
			this.calculateAffected();
			this.collapse(false);
		}
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.details = {
			advisories: {
				header: this.advisoryHeader,
				icon: 'lightbulb',
				impactSummary: I18n.get('_Thisadvisory_'),
				sevMap: advisorySeverities,
				summary: this.advisorySummary,
				template: this.advisoryDetails,
				title: I18n.get('_SecurityAdvisory_'),
			},
			announcements: {
				header: this.lifecycleHeader,
				icon: 'lifecycle',
				impactSummary: I18n.get('_Thismilestone_'),
				template: this.lifecycleDetails,
				title: I18n.get('_EndOfLifeMilestone_'),
			},
			bugs: {
				header: this.bugHeader,
				icon: 'bug',
				impactSummary: I18n.get('_Thiscase_'),
				maxList: 3,
				template: this.bugDetails,
				title: I18n.get('_Bug_'),
			},
			cases: {
				header: this.caseHeader,
				icon: 'briefcase',
				impactSummary: I18n.get('_Thiscase_'),
				sevMap: caseSeverities,
				summary: this.caseSummary,
				template: this.caseDetails,
				title: I18n.get('_SupportCase_'),
			},
			contracts: {
				header: this.contractHeader,
				icon: 'document',
				impactSummary: I18n.get('_Thiscontractexpiry_'),
				summary: this.contractSummary,
				template: this.contractDetails,
				title: I18n.get('_SupportContract_'),
			},
			fieldNotices: {
				header: this.fieldNoticeHeader,
				icon: 'lightbulb',
				impactSummary: I18n.get('_Thisnotice_'),
				template: this.fieldNoticeDetails,
				title: I18n.get('_FieldNotice_'),
			},
			licenses: {
				header: this.licenseHeader,
				icon: 'compliance',
				impactSummary: I18n.get('_Thiscontractexpiry_'),
				template: this.licenseDetails,
				title: I18n.get('_LicenseExpiry_'),
			},
			rmas: {
				header: this.rmaHeader,
				icon: 'transit',
				maxList: 3,
				summary: this.rmaSummary,
				template: this.rmaDetails,
				title: I18n.get('_RMA_'),
			},
		};
		this.filters = [
			{
				data: [],
				filtered: true,
				key: 'cases',
			},
			{
				data: [],
				filtered: true,
				key: 'advisories',
			},
			{
				data: [],
				filtered: true,
				key: 'contracts',
			},
			{
				data: [],
				filtered: true,
				key: 'rmas',
			},
		];
		this.cachedData = {
			advisories: [],
			cases: [],
			contracts: [],
			rmas: [],
		};

		if (this.alertResults) {
			this.parseFilterData();
		}
	}
}
