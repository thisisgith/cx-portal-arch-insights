import {
	Component,
	OnChanges,
	OnInit,
	SimpleChanges,
	Input,
	OnDestroy,
	ViewChild,
	TemplateRef,
	Output,
	EventEmitter,
} from '@angular/core';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import {
	OSVService,
	AssetRecommendationsResponse,
	AssetRecommendations,
	OSVAsset,
	SoftwareGroup,
} from '@sdp-api';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Subject, of, Subscription } from 'rxjs';
import { CuiTableOptions, CuiModalService } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ActivatedRoute } from '@angular/router';
import { CancelConfirmComponent } from '../cancel-confirm/cancel-confirm.component';

/**
 * Asset Software Details Component
 */
@Component({
	selector: 'asset-details',
	styleUrls: ['./asset-detail.component.scss'],
	templateUrl: './asset-detail.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit, OnDestroy {
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{ }>;
	@ViewChild('currentTemplate', { static: true }) private currentTemplate: TemplateRef<{ }>;
	@ViewChild('releaseDateTemplate', { static: true })
	private releaseDateTemplate: TemplateRef<{ }>;
	@Input() public fullscreen;
	@Input() public selectedAsset: OSVAsset;
	/** show accept button if accept is true */
	@Input() public accept = false;
	@Input() public selectedSoftwareGroup: SoftwareGroup;
	/** recommendations from the software group details */
	@Input() public recommendations;
	/** user accepts a machine recommendation */
	@Input() public selectedMachineRecommendation;
	/** return result of accepting recommendation */
	@Output() public onRecommendationAccept = new EventEmitter();
	/** show multiple version */
	@Output() public showMultipleVersions = new EventEmitter();
	public assetDetails: AssetRecommendationsResponse;
	public timelineData: AssetRecommendationsResponse;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public view: 'list' | 'timeline' = 'list';
	public assetDetailsTable: CuiTableOptions;
	public assetDetailsParams: OSVService.GetAssetDetailsParams;
	public customerId: string;
	public currentVersion: AssetRecommendations;
	public onCancelSusbcription: Subscription;
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
			id: '7293498_NA',
			image: 'NA',
			pf: 'Cisco_5500',
			pid: 'AIR-CT5520-K9',
			swType: 'IOS',
			swVersions: '8',
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
		const recommendations = _.get(changes, ['recommendations', 'currentValue']);
		const selectedMachineRecommendation =
			_.get(changes, ['selectedMachineRecommendation', 'currentValue']);
		if (currentAsset && !changes.selectedAsset.firstChange) {
			this.refresh();
		}
		if (recommendations) {
			this.clear();
			this.status.isLoading = false;
			this.assetDetails = this.groupData(recommendations);
			this.buildTable();
		}
		if (selectedMachineRecommendation) {
			this.onAccept(selectedMachineRecommendation);
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
		this.onCancelSusbcription = this.cuiModalService.onCancel
			.subscribe(() => {
				this.logger.info('cancel subscription');
			});
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.selectedAsset) {
			this.clear();
			// this.assetDetailsParams.id = _.get(this.selectedAsset, 'id');
			// this.assetDetailsParams.pf = _.get(this.selectedAsset, 'productFamily');
			// this.assetDetailsParams.pid = _.get(this.selectedAsset, 'productId');
			// this.assetDetailsParams.swType = _.get(this.selectedAsset, 'swType');
			// this.assetDetailsParams.swVersions = _.get(this.selectedAsset, 'swVersion');
			// this.assetDetailsParams.image = _.get(this.selectedAsset, 'imageName');
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
	public groupData (data: AssetRecommendationsResponse) {
		const selectedItem = this.selectedAsset ? this.selectedAsset : this.selectedSoftwareGroup;
		this.setAcceptedVersion(data, selectedItem);
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
	 * @returns columns
	 */
	public getColumns () {
		const columns = [
			{
				sortable: false,
				template: this.currentTemplate,
				width: '20%',
			},
			{
				name: I18n.get('_OsvVersion_'),
				sortable: false,
				template: this.versionTemplate,
				width: this.accept ? '35%' : '65%',
			},
			{
				key: 'postDate',
				name: I18n.get('_OsvReleaseDate_'),
				sortable: false,
				template: this.releaseDateTemplate,
				width: '15%',
			},
		];
		if (this.accept) {
			const acceptColumn = {
				name: I18n.get('_OsvStatusOrAction_'),
				sortable: false,
				template: this.actionsTemplate,
				width: '30%',
			};
			columns.push(acceptColumn);
		}

		return columns;
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		if (this.onCancelSusbcription) {
			_.invoke(this.onCancelSusbcription, 'unsubscribe');
		}
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Sort Asset Recommendations by postDate
	 * @param data AssetDetails
	 * @returns sorted data
	 */
	public sortData (data: AssetRecommendationsResponse) {
		data.sort((a: AssetRecommendations, b: AssetRecommendations) =>
			<any> new Date(b.postDate) - <any> new Date(a.postDate));

		return data;
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
	 * View All Os Version - link to software.cisco.com
	 */
	public viewAllVersions () {
		const selectedItem = this.selectedAsset ? this.selectedAsset : this.selectedSoftwareGroup;
		const mdfId = _.get(selectedItem, 'mdfId');
		const url = `https://software.cisco.com/research/home?pid=${mdfId}`;
		window.open(`${url}`, '_blank');
	}

	/**
	 * Set AcceptedVersion
	 * @param data AssetDetails
	 * @param selectedItem can be selectedAsset or selectedProfileGroup
	 */
	public setAcceptedVersion (data: AssetRecommendationsResponse,
		selectedItem: OSVAsset | SoftwareGroup) {
		_.forEach(data, (recommendation: AssetRecommendations) => {
			recommendation.accepted = recommendation.swVersion === selectedItem.optimalVersion
				? true : false;
		});
	}

	/**
	 * accept recommendations
	 * @param item accept recommendations for this selected profile
	 */
	public onAccept (item: AssetRecommendations) {
		const body = {
			customerId: this.customerId,
			id: this.selectedSoftwareGroup.id,
			optimalVersion: item.swVersion,
		};
		this.status.isLoading = true;
		this.osvService.updateAsset(body)
			.subscribe((response: OSVAsset) => {
				// const response = {
				// 	...this.selectedSoftwareGroup,
				// 	 optimalVersion: '15.7(3)M4b',
				// 	  deployment: 'upgrade',
				// };
				response.statusUpdated = true;
				this.setAcceptedVersion(this.recommendations, response);
				this.recommendations = _.cloneDeep(this.recommendations);
				this.selectedSoftwareGroup.recommAcceptedDate = response.recommAcceptedDate;
				this.onRecommendationAccept.emit({
					recommendation: this.recommendations,
					selectedSoftwareGroup: response,
				});
				this.status.isLoading = false;
				this.logger.debug('Updated');
			}, err => {
				if (this.selectedMachineRecommendation) {
					this.onRecommendationAccept.emit({
						err,
					});
				} else {
					_.invoke(this.alert, 'show', I18n.get('_OsvGenericError_'), 'danger');
				}
				this.status.isLoading = false;
				this.logger.debug('Error in updating');
			});
	}

	/**
	 * show the cancel confirm modal
	 */
	public onCancel () {
		this.cuiModalService.showComponent(CancelConfirmComponent, { });
	}
}
