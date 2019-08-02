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

/** Our current customerId */
const customerId = '231215372';

/**
 * Asset Software Details Component
 */
@Component({
	selector: 'asset-details',
	templateUrl: './asset-detail.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit, OnDestroy {
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@Input() public fullscreen;
	@Input() public selectedAsset: OSVAsset;
	public assetDetails: AssetRecommendationsResponse;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public view: 'list' | 'timeline' = 'list';
	public assetDetailsTable: CuiTableOptions;
	public assetDetailsParams: OSVService.GetAssetDetailsParams = {
		customerId,
		id: '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R',
	};
	public selectedRecommendation = {
		name: 'None',
	};

	constructor (
		private logger: LogService,
		private osvService: OSVService,
	) { }

	/**
	 * Resets data fields
	 */
	private clear () {
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
			this.assetDetailsParams.id = this.selectedAsset.id;
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
						key: 'name',
						name: I18n.get('_OsvVersionSummary_'),
						sortable:false, 
						width: '30%',
					},
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						sortable:false, 
						width: '10%',
					},
					{
						key: 'postDate',
						name: I18n.get('_OsvReleaseDate_'),
						render: item =>
							datePipe.transform(item.postDate, 'yyyy MMM dd'),
						sortable:false,
						width: '20%',
					},
					{
						name: I18n.get('_OsvStatusOrAction_'),
						sortable:false, 
						width: '30%',
						template: this.actionsTemplate,
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
	 * accept recommendations
	 * @param item accept recommendations for this selected item
	 */
	public onActionClick (item: AssetRecommendations) {
		const body = {
			customerId,
			id: this.selectedAsset.id,
			optimalVersion: item.swVersion,
		};
		this.status.isLoading = true;
		this.osvService.updateAsset(body)
			.subscribe(() => {
				this.status.isLoading = false;
				this.logger.debug('Updated');
			}, () => {
				this.status.isLoading = false;
				this.logger.debug('Error in updating');
			});
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
	 * Selected Recommendations from timeline view
	 * @param point one of the recommendations on timeline view
	 */
	public selectedPoint (point) {
		if (!point.accepted && point.name !== 'Current') {
			this.selectedRecommendation = point;
		}
	}
}
