import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Chart } from 'angular-highcharts';
import { of } from 'rxjs';
import { severityLevelMap } from '@classes';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	AlertResults,
	AlertService,
	InventoryService,
	InventoryResults,
} from '@services';

import { AlertData, Asset, DeviceDetails } from '@interfaces';

import * as _ from 'lodash';
import { Row } from './alert-info/alert-info.component';

/**
 * Interface representing the options used for the Info container
 */
interface InfoContainer {
	data?: AlertData[];
	disabled?: boolean;
	count?: number;
	title: string;
	summary?: string;
	selected?: boolean;
	key: string;
	chart?: Chart;
	table?: {
		key: string;
		name: string;
		sortable?: boolean;
		sortDirection?: string;
		sorting?: boolean;
		width?: string;
		template?: TemplateRef<{ }>;
	}[];
	gauges?: {
		title: string;
		color?: string;
		percent?: number;
		count?: number;
	}[];
}

/**
 * Interface representing a Tab
 */
interface Tab {
	key: string;
	icon?: string;
	selected: boolean;
	subTabs?: InfoContainer[];
	title: string;
}

/**
 * The possible sort directions
 */
type SortDir = 'asc' | 'desc';

/**
 * Main Inventory Page Component
 */
@Component({
	selector: 'app-inventory',
	styleUrls: ['./inventory.component.scss'],
	templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {

	public selectedTab: Tab;
	public tabs: Tab[];
	public subTab: InfoContainer;
	public severities = severityLevelMap;

	@ViewChild('severityTemplate') public severityTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleAnnouncement') public lifecycleAnnouncementTemplate: TemplateRef<{ }>;

	public alertData: AlertResults;
	public alertDetails: {
		data: AlertData;
		key: string;
		selected: boolean;
	};

	public status = {
		alertLoading: false,
		sidebarCollapsed: false,
	};
	public loading = false;
	public activeAssetId = 0;
	public totalAssets = 20;
	public assets: Asset[] = [];
	private cachedAssets: Asset[] = [];
	public selectedAsset: DeviceDetails;
	public currentTab = 'vulnerability';
	public less = true;
	public currentButton = 'securityadvisory';
	public showSidePanel = false;
	public sortDirection: SortDir = 'desc';
	public hideSoftwareColumns = true;

	@ViewChild('productid') public productidTemplate: TemplateRef<string>;

	constructor (
		private logger: LogService,
		private alertService: AlertService,
		private service: InventoryService,
	) { }

	/**
	 * Parses out the alert data for each section
	 * @param alertData the alert results
	 */
	private parseAlertData (alertData: AlertResults) {
		_.forOwn(alertData, (alert, upperKey) => {
			const tab = _.find(this.tabs, { key: upperKey });

			if (tab) {
				_.forOwn(alert, (data: AlertData[], key: string) => {
					const subTab = _.find(tab.subTabs, { key });
					if (subTab) {
						subTab.count = data.length;
						subTab.selected = false;
						subTab.data = data;
						if (_.get(data[0], 'severity')) {
							subTab.chart = this.buildColumnChart(data);
						}

						if (subTab.gauges) {
							_.forEach(subTab.gauges, (gauge, index) => {
								gauge.count = _.filter(data, d =>
										_.get(d, 'severity') === (index + 1)).length;
								gauge.percent =
									Math.floor((gauge.count / data.length) * 100) || 0;
								gauge.color = severityLevelMap[index + 1].class;
							});
						}
					}
				});
			}
		});
	}

	/**
	 * Selecting row in inner table
	 * @param row the row from the alert info
	 */
	public onSelect (row: Row) {
		this.alertDetails = row.selected ? row : undefined;
		if (this.alertDetails) {
			this.status.sidebarCollapsed = false;
		}

		if (row.selected) {
			const affected = _.get(row.data, 'affectedDevices', []);
			this.assets = _.filter(this.cachedAssets, (asset: Asset) =>
				_.includes(affected, asset.serialNumber));
		} else {
			this.assets = _.cloneDeep(this.cachedAssets);
		}
	}

	/**
	 * Select or unselect the tab
	 * @param tab Tab
	 */
	public selectTab (tab: Tab) {
		if (this.selectedTab) {
			this.selectedTab.subTabs.forEach(t => {
				t.selected = false;
			});
		}
		this.subTab = undefined;

		let obs = of(this.alertData);
		if (!this.alertData && !this.status.alertLoading) {
			this.status.alertLoading = true;
			obs = this.alertService.read();
		}

		this.tabs.forEach(t => {
			if (t.title !== tab.title) {
				t.selected = false;
			}
		});
		tab.selected = !tab.selected;
		this.selectedTab = (tab.selected) ? tab : undefined;

		obs.subscribe((alertData: AlertResults) => {
			if (!this.alertData) {
				this.alertData = alertData;
				this.parseAlertData(alertData);
			}
			this.status.alertLoading = false;
		},
		err => {
			this.logger.error(`inventory.component : selectTab() :: Error : (${
				err.status}) ${err.message}`);
			this.status.alertLoading = false;
		});
	}

	/**
	 * The SubTab
	 * @param subTab the subtab to select
	 */
	public selectSubTab (subTab: InfoContainer) {
		this.selectedTab.subTabs.forEach(t => {
			if (t.title !== subTab.title) {
				t.selected = false;
			}
		});
		subTab.selected = !subTab.selected;

		this.subTab = (subTab.selected) ? subTab : undefined;
	}

	/**
	 * Performs the API call to retrieve Interactive hardware data
	 */
	public getAssets () {
		this.service.queryAssets()
		.subscribe((results: InventoryResults) => {
			this.assets = results.assets;
			// default all table row to be unselected
			_.each(this.assets, (asset: Asset) => {
				asset.status = false;
			});
		},
		err => {
			this.logger.error(err);
		},
		() => {
			this.cachedAssets = _.cloneDeep(this.assets);
			this.loading = false;
		});
	}

	/**
	 * Performs the API call to retrieve DeviceDetails info
	 * @param assetId : device id
	 */
	public getAssetById (assetId: number) {
		this.loading = true;
		this.service.queryAssetById(assetId)
			.subscribe((results: DeviceDetails) => {
				this.selectedAsset = results;
				this.showSidePanel = results === null ? false : true;
			},
				err => {
					this.logger.error(err);
					this.showSidePanel = false;
				},
				() => {
					this.loading = false;
				});
	}

	/**
	 * Implement onSort function
	 */
 	public onSort () {
		this.assets = _.orderBy(this.assets, ['hostname'], [this.sortDirection]);
		this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
	}

	/**
	 * Initializes the tabs for alerts
	 */
	private initializeTabs () {
		this.tabs = [
			{
				icon: 'warning',
				key: 'vulnerabilities',
				selected: false,
				subTabs: [
					{
						gauges: [
							{
								title: I18n.get('_Critical_'),
							},
							{
								title: I18n.get('_High_'),
							},
							{
								title: I18n.get('_Medium_'),
							},
							{
								title: I18n.get('_Success_'),
							},
							{
								title: I18n.get('_Info_'),
							},
						],
						key: 'advisories',
						table: [
							{
								key: 'severity',
								name: I18n.get('_Sev_'),
								sortable: true,
								sortDirection: 'asc',
								sorting: true,
								template: this.severityTemplate,
								width: '60px',
							},
							{
								key: 'title',
								name: I18n.get('_Summary_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'published',
								name: I18n.get('_Published_'),
								sortable: true,
							},
						],
						title: I18n.get('_SecurityAdvisories_'),
					},
					{
						key: 'fieldNotices',
						table: [
							{
								key: 'title',
								name: I18n.get('_Summary_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'published',
								name: I18n.get('_Published_'),
								sortable: true,
							},
						],
						title: I18n.get('_FieldNotices_'),
					},
				],
				title: '_Vulnerability_',
			},
			{
				key: 'health',
				selected: false,
				subTabs: [
					{
						gauges: [
							{
								title: I18n.get('_Critical_'),
							},
							{
								title: I18n.get('_Degraded_'),
							},
							{
								title: I18n.get('_Impaired_'),
							},
							{
								title: I18n.get('_Info_'),
							},
						],
						key: 'cases',
						table: [
							{
								key: 'severity',
								name: I18n.get('_Sev_'),
								sortable: true,
								sortDirection: 'asc',
								sorting: true,
								template: this.severityTemplate,
								width: '60px',
							},
							{
								key: 'title',
								name: I18n.get('_Summary_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'lastUpdateDate',
								name: I18n.get('_Updated_'),
								sortable: true,
							},
						],
						title: I18n.get('_OpenCases_'),
					},
					{
						key: 'rmas',
						table: [
							{
								key: 'summary',
								name: I18n.get('_Summary_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'lastUpdated',
								name: I18n.get('_Submitted_'),
								sortable: true,
							},
						],
						title: I18n.get('_OpenRMAs_'),
					},
					{
						gauges: [
							{
								title: I18n.get('_SeverityX_', 1),
							},
							{
								title: I18n.get('_SeverityX_', 2),
							},
							{
								title: I18n.get('_SeverityX_', 3),
							},
							{
								title: I18n.get('_SeverityX_', 4),
							},
						],
						key: 'bugs',
						table: [
							{
								key: 'severity',
								name: I18n.get('_Sev_'),
								sortable: true,
								sortDirection: 'asc',
								sorting: true,
								template: this.severityTemplate,
								width: '60px',
							},
							{
								key: 'title',
								name: I18n.get('_Summary_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'lastUpdated',
								name: I18n.get('_Updated_'),
								sortable: true,
							},
						],
						title: I18n.get('_Bugs_'),
					},
				],
				title: '_NetworkHealth_',
			},
			{
				key: 'lifecycle',
				selected: false,
				subTabs: [
					{
						gauges: [
							{
								title: I18n.get('_Active_'),
							},
							{
								title: I18n.get('_Pending_'),
							},
							{
								title: I18n.get('_Expired_'),
							},
						],
						key: 'contracts',
						summary: I18n.get('_ContractsSummary_'),
						table: [
							{
								key: 'id',
								name: I18n.get('_ContractNo_'),
								sortable: true,
								sortDirection: 'asc',
								sorting: true,
								width: '60px',
							},
							{
								key: 'status',
								name: I18n.get('_Status_'),
								sortable: true,
							},
							{
								key: 'title',
								name: I18n.get('_Type_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'expiration',
								name: I18n.get('_Expires_'),
								sortable: true,
							},
						],
						title: I18n.get('_Contracts_'),
					},
					{
						gauges: [
							{
								title: I18n.get('_Active_'),
							},
							{
								title: I18n.get('_Pending_'),
							},
							{
								title: I18n.get('_Expired_'),
							},
						],
						key: 'licenses',
						summary: I18n.get('_LicensesSummary_'),
						table: [
							{
								key: 'id',
								name: I18n.get('_LicenseNo_'),
								sortable: true,
								sortDirection: 'asc',
								sorting: true,
								width: '60px',
							},
							{
								key: 'title',
								name: I18n.get('_Type_'),
								sortable: true,
							},
							{
								key: 'summary',
								name: I18n.get('_Summary_'),
								sortable: true,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'expiration',
								name: I18n.get('_Expires_'),
								sortable: true,
							},
						],
						title: I18n.get('_Licenses_'),
					},
					{
						gauges: [
							{
								title: I18n.get('_LastDayOfSupport_'),
							},
							{
								title: I18n.get('_EndOfSale_'),
							},
							{
								title: I18n.get('_EndOfSoftwareMaintenance_'),
							},
							{
								title: I18n.get('_EndOfServiceRenewal_'),
							},
							{
								title: I18n.get('_ReleaseDate_'),
							},
						],
						key: 'announcements',
						summary: I18n.get('_EndOfLifeSummary_'),
						table: [
							{
								key: 'title',
								name: I18n.get('_Announcement_'),
								sortable: false,
								template: this.lifecycleAnnouncementTemplate,
							},
							{
								key: 'affected',
								name: I18n.get('_ImpactedAssets_'),
								sortable: true,
							},
							{
								key: 'expiration',
								name: I18n.get('_EffectiveDate_'),
								sortable: true,
							},
						],
						title: I18n.get('_EndOfLife_'),
					},
				],
				title: '_LifecycleCoverage_',
			},
		];
	}

	/**
	 * Initialization Function which creates the tabs
	 */
	public ngOnInit () {
		this.initializeTabs();
		this.selectTab(this.tabs[0]);
		this.getAssets();
	}

	/**
	 * Builds and returns the column chart
	 * @param chartData the data points
	 * @param sevMap the severities to use (optional)
	 * @returns Highcharts Chart
	 */
	private buildColumnChart (chartData, sevMap: string[] = []): Chart {
		let max = 0;
		const severities = _.uniq(_.map(chartData, 'severity'));

		const categories = [];
		const data = _.map(severities.sort(), (sev: number) => {
			const count = _.filter(chartData, { severity: sev }).length;

			if (sevMap.length) {
				categories.push(sevMap[sev - 1]);
			} else {
				categories.push(`S${sev}`);
			}

			if (count > max) {
				max = count;
			}

			return {
				color: severityLevelMap[sev].color,
				y: count,
			};
		});

		return new Chart({
			chart: {
				height: '100px',
				type: 'bar',
				width: 125,
			},
			credits: {
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				bar: {
					borderWidth: 0,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						formatter () {
							return `${this.x}`;
						},
					},
					pointPadding: 0,
				},
			},
			series: [{
				data,
				name,
				type: 'bar',
			}],
			title: {
				text: undefined,
			},
			xAxis: {
				categories,
				crosshair: false,
				labels: {
					enabled: false,
				},
				tickLength: 0,
			},
			yAxis: {
				max,
				gridLineWidth: 0,
				labels: {
					enabled: false,
				},
				lineWidth: 0,
				min: 0,
				title: {
					text: undefined,
				},
			},
		});
	}

	/**
	 * Implement selectTab function
	 * @param tab : future active Tab
	 */
	public selectDetailTab (tab: string) {
		this.currentTab = tab;
	}

	/**
 	* Implement showMore function
 	*/
	public showMore () {
		this.less = false;
	}

	/**
 	* Implement showLess function
 	*/
	public showLess () {
		this.less = true;
	}

	/**
	 * Implement clickButton function
	 * @param button : Button Clicked
	 */
	public clickButton (button: string) {
		this.currentButton = button;
	}

	/**
	 * Implement clickTableRow function
	 * @param assetId : the asset selected
 	*/
	public clickTableRow (assetId: number) {
		// clicked the active row, will do nothing
		if (assetId === this.activeAssetId) {
			return;
		}

		// If sidepanel is opened, click the other row should close the side panel first
		if (this.showSidePanel && (this.activeAssetId !== assetId)) {
			this.closeSidePanel();

			return;
		}
		this.showSidePanel = this.showSidePanel ? false : true;
		if (this.activeAssetId > -1) {
			this.assets[this.activeAssetId].status = false;
		}
		this.assets[assetId - 1].status = true;
		this.activeAssetId = assetId;
		// For mock purpose, will alway use assetId = 1 for now
		// this.getAssetById(assetId);
		this.getAssetById(1);
	}

	/**
 	* Implement closeSidePanel function
 	*/
	public closeSidePanel () {
		this.showSidePanel = false;
		for (const asset of this.assets) {
			asset.status = false;
		}

		// For now will reset all of the side panel information when close the side panel
		// In the future another API call will do the same
		this.activeAssetId = 0;
		this.currentButton = 'securityadvisory';
		this.currentTab = 'vulnerability';
		this.less = true;
	}

	/**
	 * Implement toggleSoftwareColumns
	 */
	public toggleSoftwareColumns () {
		this.hideSoftwareColumns = !this.hideSoftwareColumns;
	}
}
