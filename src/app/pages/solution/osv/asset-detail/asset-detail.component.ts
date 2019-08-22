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
import { OSVService, AssetRecommendationsResponse, AssetRecommendations, OSVAsset } from '@sdp-api';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

/**
 * Asset Software Details Component
 */
@Component({
	selector: 'asset-details',
	templateUrl: './asset-detail.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit, OnDestroy {
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{ }>;
	@Input() public fullscreen;
	@Input() public selectedAsset: OSVAsset;
	public assetDetails: AssetRecommendationsResponse;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public view: 'list' | 'timeline' = 'list';
	public assetDetailsTable: CuiTableOptions;
	public assetDetailsParams: OSVService.GetAssetDetailsParams;
	public customerId: string;

	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.assetDetailsParams = {
			customerId: this.customerId,
			id: '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R',
		};
	}

	/**
	 * Resets data fields
	 */
	public clear () {
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
		if (this.selectedAsset && !this.selectedAsset.statusUpdated) {
			this.clear();
			// this.assetDetailsParams.id = this.selectedAsset.id;
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
				map((response: AssetRecommendationsResponse) => {
					this.sortData(response);
					this.addVersionInfo(response);
					this.assetDetails = response;
					this.buildTable();
				}),
				takeUntil(this.destroy$),
				catchError(err => {
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
	 * Table view for basic recommendations
	 */
	public buildTable () {
		const datePipe = new DatePipe('en-US');

		if (!this.assetDetailsTable) {
			this.assetDetailsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						width: '20%',
					},
					{
						name: I18n.get('_OsvVersionSummary_'),
						sortable: false,
						template : this.versionTemplate,
						width: '50%',
					},
					{
						key: 'postDate',
						name: I18n.get('_OsvReleaseDate_'),
						render: item => _.isNull(item.error) ?
							datePipe.transform(item.postDate, 'yyyy MMM dd') : 'N/A',
						sortable: false,
						width: '30%',
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
	 */
	public sortData (data: AssetRecommendationsResponse) {
		data.sort((a: AssetRecommendations, b: AssetRecommendations) =>
			<any> new Date(b.postDate) - <any> new Date(a.postDate));
	}

	/**
	 * add tooltip info for recommended versions
	 * @param data the asset recommendations
	 */
	public addVersionInfo (data: AssetRecommendationsResponse) {
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
				case 'recommended':
					detail.info = I18n.get('_OsvRecommendedInfo_');
					break;
				default:
					break;
			}
		});
	}
}
