import {
	Component,
	OnChanges,
	OnInit,
	SimpleChanges,
	Input,
	OnDestroy,
	ViewChild,
	TemplateRef,
} from '@angular/core';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import {
	OSVService,
	AssetRecommendations,
	OSVAsset,
} from '@sdp-api';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { CuiTableOptions, CuiModalService } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ActivatedRoute } from '@angular/router';

/**
 * Asset Software Details Component
 */
@Component({
	selector: 'asset-details',
	styleUrls: ['./asset-detail.component.scss'],
	templateUrl: './asset-detail.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit, OnDestroy {
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{  }>;
	@ViewChild('currentTemplate', { static: true }) private currentTemplate: TemplateRef<{ }>;
	@ViewChild('releaseDateTemplate', { static: true })
		private releaseDateTemplate: TemplateRef<{ }>;
	@Input() public fullscreen;
	@Input() public selectedAsset: OSVAsset;
	public assetDetails: AssetRecommendations[];
	public timelineData: AssetRecommendations[];
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public view: 'list' | 'timeline' = 'list';
	public assetDetailsTable: CuiTableOptions;
	public assetDetailsParams: OSVService.GetAssetDetailsParams;
	public customerId: string;
	public currentVersion: AssetRecommendations;
	public alert: any = { };

	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
		private cuiModalService: CuiModalService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.assetDetailsParams = {
			customerId: this.customerId,
			profileName: '7293498_NA',
			image: 'NA',
			pf: 'Cisco_5500',
			pid: 'AIR-CT5520-K9',
			swType: 'IOS',
			swVersion: '8',
			postDate: null,
		};
	}

	/**
	 * Resets data fields
	 */
	public clear () {
		_.invoke(this.alert, 'hide');
		this.assetDetails = null;
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['selectedAsset', 'currentValue']);
		if (currentAsset && !changes.selectedAsset.firstChange) {
			this.refresh();
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();	
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.selectedAsset) {
			this.clear();
			this.assetDetailsParams.profileName = _.get(this.selectedAsset, 'profileName');
			this.assetDetailsParams.pf = _.get(this.selectedAsset, 'productFamily');
			this.assetDetailsParams.pid = _.get(this.selectedAsset, 'productId');
			this.assetDetailsParams.swType = _.get(this.selectedAsset, 'swType');
			this.assetDetailsParams.swVersion = _.get(this.selectedAsset, 'swVersion');
			this.assetDetailsParams.image = _.get(this.selectedAsset, 'imageName');
			this.assetDetailsParams.postDate = _.get(this.selectedAsset, 'postDate');
			this.fetchAssetDetails();
		}
	}

	/**
	 * Fetch Asset details for the selected Asset
	 */
	public fetchAssetDetails () {
		this.status.isLoading = true;
		this.osvService.getAssetDetails(this.assetDetailsParams)
			.pipe(
				map((response: AssetRecommendations[]) => {					
					this.assetDetails = this.groupData(response);
					this.timelineData = this.sortData(response);
					this.buildTable();
				}),
				takeUntil(this.destroy$),
				catchError(err => {
					_.invoke(this.alert, 'show', I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV Asset Recommendations : getAssetDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * group recommendations based on version
	 * @param data Recommendations
	 * @returns grouped data
	 */
	public groupData (data: AssetRecommendations[]) {		
		this.addVersionInfo(data);
		const recommendations = _.filter(data, (detail: AssetRecommendations) =>
			detail.name !== 'current');
		const groups = _.groupBy(recommendations, 'swVersion');
		const groupedData = [];
		_.map(_.keys(groups), swVersion => {
			const detail: AssetRecommendations = _.get(_.filter(recommendations, { swVersion }), 0);
			detail.groupedLabels = _.join(_.map(groups[swVersion], recommendation =>
				_.capitalize(recommendation.name),
			), '/');
			detail.swVersionGroup = _.cloneDeep(groups[swVersion]);
			groupedData.push(detail);
		});
		this.currentVersion = _.get(_.filter(data, { name: 'current' }), 0);

		return this.sortData(groupedData);
	}

	/**
	 * Table view for basic recommendations
	 */
	public buildTable () {
		if (!this.assetDetailsTable) {
			this.assetDetailsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						sortable: false,
						template: this.currentTemplate,
						width: '20%',
					},
					{
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						template: this.versionTemplate,
						width: '65%',
					},
					{
						key: 'postDate',
						name: I18n.get('_OsvReleaseDate_'),
						sortable: false,
						template: this.releaseDateTemplate,
						width: '15%',
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: false,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Sort Asset Recommendations by postDate
	 * @param data AssetDetails
	 * @returns sorted data
	 */
	public sortData (data: AssetRecommendations[]) {
		data.sort((a: AssetRecommendations, b: AssetRecommendations) =>
			<any> new Date(b.postDate) - <any> new Date(a.postDate));

		return data;
	}

	/**
	 * add tooltip info for recommended versions
	 * @param data the asset recommendations
	 */
	public addVersionInfo (data: AssetRecommendations[]) {
		_.map(data, (detail: AssetRecommendations) => {
			switch (detail.name) {
				case 'latest':
					detail.info = I18n.get('_OsvLatestInfo_');
					break;
				case 'current':
					detail.info = I18n.get('_OsvCurrentInfo_');
					break;
				case 'suggested':
					detail.info = I18n.get('_OsvSuggestedInfo_');
					break;
				case 'minimum':
					detail.info = I18n.get('_OsvMinimumInfo_');
					break;
				case 'golden':
					detail.info = I18n.get('_OsvGoldenInfo_');
					break;
				case 'Recommendation #1':
				case 'Recommendation #2':
				case 'Recommendation #3':
					detail.info = I18n.get('_OsvRecommendedInfo_');
					break;
				default:
					break;
			}
		});
	}

	/**
	 * View All Os Version - link to software.cisco.com
	 */
	public viewAllVersions () {		
		const mdfId = _.get(this.selectedAsset, 'mdfId');
		const url = `https://software.cisco.com/research/home?pid=${mdfId}`;
		window.open(`${url}`, '_blank');
	}
	
}
