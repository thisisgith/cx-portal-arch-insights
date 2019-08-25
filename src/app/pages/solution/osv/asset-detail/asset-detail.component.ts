import {
	Component,
	OnChanges,
	OnInit,
	SimpleChanges,
	Input,
	OnDestroy,
	ViewChild,
	TemplateRef,
	EventEmitter,
	Output,
} from '@angular/core';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { OSVService, AssetRecommendationsResponse, AssetRecommendations, OSVAsset, SoftwareGroup } from '@sdp-api';
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
	styleUrls: ['./asset-detail.component.scss'],
	templateUrl: './asset-detail.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit, OnDestroy {
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{}>;
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{}>;
	@Input() public fullscreen;
	@Input() public selectedAsset: OSVAsset;
	@Input() public selectedSoftwareGroup: SoftwareGroup;
	@Input() public accept = false;
	public assetDetails: AssetRecommendationsResponse;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public view: 'list' | 'timeline' = 'list';
	public assetDetailsTable: CuiTableOptions;
	public assetDetailsParams: OSVService.GetAssetDetailsParams;
	public customerId: string;
	public selectedRecommendation = {
		name: 'None',
	};

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
		if (this.selectedAsset) {
			this.clear();
			// this.assetDetailsParams.id = this.selectedAsset.id;
			this.fetchAssetDetails();
		} else if (this.selectedSoftwareGroup) {
			this.clear();
			this.fetchSoftwareGroupDetails();
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

					return of({});
				}),
			)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Fetch Software Group details for the selected SoftwareGroup
	 */
	public fetchSoftwareGroupDetails () {
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

					return of({});
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
		if (!this.assetDetailsTable) {
			this.assetDetailsTable = new CuiTableOptions({
				bordered: true,
				columns: this.getColumns(),
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
	 * get columns for the table view
	 */
	public getColumns () {
		const datePipe = new DatePipe('en-US');
		const columns = [
			{
				key: 'swVersion',
				name: I18n.get('_OsvVersion_'),
				sortable: false,
				width: '23%',
			},
			{
				name: I18n.get('_OsvVersionSummary_'),
				sortable: false,
				template: this.versionTemplate,
				width: '25%',
			},
			{
				key: 'postDate',
				name: I18n.get('_OsvReleaseDate_'),
				render: item => _.isNull(item.error) ?
					datePipe.transform(item.postDate, 'yyyy MMM dd') : 'N/A',
				sortable: false,
				width: '25%',
			},
		];
		if (this.accept) {
			const acceptColumn = {
				name: I18n.get('_OsvStatusOrAction_'),
				sortable: false,
				template: this.actionsTemplate,
				width: '25%',
			};
			columns.splice(2, 0, acceptColumn);
		}
		return columns;

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
			<any>new Date(b.postDate) - <any>new Date(a.postDate));
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

	/**
	 * Selected Recommendations from timeline view
	 * @param point one of the recommendations on timeline view
	 */
	public selectedPoint (point) {
		if (this.accept && !point.accepted && point.label !== _.get(this.selectedAsset, 'swVersion')) {
			this.selectedRecommendation = point;
		}
	}
}
