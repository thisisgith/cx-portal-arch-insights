import {
	Component,
	TemplateRef,
	OnInit,
	ViewChild,
	Input,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import * as _ from 'lodash-es';
import {
	FieldNoticeBulletin,
	SecurityAdvisoryBulletin,
	FieldNotice,
	SecurityAdvisory,
	ProductAlertsService,
	Asset,
} from '@sdp-api';

/** Our current customerId */
const customerId = '2431199';

/** Interface representing an advisory tab */
interface Tab {
	data?: {
		notice: FieldNotice | SecurityAdvisory;
		bulletin: FieldNoticeBulletin | SecurityAdvisoryBulletin;
	}[];
	params?: {
		notice:
			ProductAlertsService.GetFieldNoticeParams |
			ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin:
			ProductAlertsService.GetFieldNoticeBulletinParams |
			ProductAlertsService.GetPSIRTBulletinParams;
	};
	disabled?: boolean;
	key: string;
	selected: boolean;
	template: TemplateRef<{ }>;
	title: string;
}

/**
 * Details Advisories Component
 */
@Component({
	selector: 'details-advisories',
	styleUrls: ['./details-advisories.component.scss'],
	templateUrl: './details-advisories.component.html',
})
export class DetailsAdvisoriesComponent implements OnInit {

	@Input('asset') public asset: Asset;
	@ViewChild('security', { static: true }) private securityTemplate: TemplateRef<{ }>;
	@ViewChild('fieldNotices', { static: true }) private fieldNoticesTemplate: TemplateRef<{ }>;
	@ViewChild('bugs', { static: true }) private bugsTemplate: TemplateRef<{ }>;

	public tabs: Tab[];
	public visibleTab: TemplateRef<{ }>;

	constructor (
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
	) { }

	/**
	 * Sets the active tab
	 * @param tab the tab to select
	 */
	public selectTab (tab: Tab) {
		_.each(this.tabs, (t: Tab) => {
			if (t !== tab) {
				t.selected = false;
			}
		});
		tab.selected = true;
		this.visibleTab = tab.template;
	}

	/** Initializes our advisory tabs */
	private initializeTabs () {
		this.tabs = [
			{
				key: 'security',
				params: {
					bulletin: {
						page: 1,
						rows: 10,
					},
					notice: {
						customerId,
						vulnerabilityStatus: ['POTVUL', 'VUL'],
					},
				},
				selected: true,
				template: this.securityTemplate,
				title: '_SecurityAdvisories_',
			},
			{
				key: 'field',
				params: {
					bulletin: {
						page: 1,
						rows: 10,
					},
					notice: {
						customerId,
						vulnerabilityStatus: ['POTVUL', 'VUL'],
					},
				},
				selected: false,
				template: this.fieldNoticesTemplate,
				title: '_FieldNotices_',
			},
			{
				disabled: true,
				key: 'bugs',
				selected: false,
				template: this.bugsTemplate,
				title: '_CriticalBugs_',
			},
		];

		this.visibleTab = _.find(this.tabs, 'selected').template;
	}

	/** Function used to initialize the component */
	public ngOnInit () {
		this.initializeTabs();
	}
}
