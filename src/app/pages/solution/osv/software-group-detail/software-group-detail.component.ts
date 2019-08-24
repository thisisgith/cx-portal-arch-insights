import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	Input,
	SimpleChanges,
	OnDestroy,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import {
	OSVService,
	SoftwareGroup,
} from '@sdp-api';
import { forkJoin, Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { DatePipe } from '@angular/common';

/**
 * SoftwareGroupDetail Component
 */
@Component({
	selector: 'app-software-group-detail',
	styleUrls: ['./software-group-detail.component.scss'],
	templateUrl: './software-group-detail.component.html',
})
export class SoftwareGroupDetailComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public selectedProfileGroup: SoftwareGroup;
	@Input() public fullscreen: boolean;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public customerId: string;
	private params: OSVService.GetSoftwareGroupDetailsParam;
	public softwareGroupVersions: SoftwareGroupVersion[];
	public softwareGroupAssets: SoftwareGroupAsset[];
	public profileVersionsTable: CuiTableOptions;
	public profileAssetsTable: CuiTableOptions;
	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params = {
			customerId: this.customerId,
			id: '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R',
		};
		this.logger.debug('SoftwareGroupDetailComponent Created!');
	}
	public recommendations = [];

	/**
	 * Initialization hook
	 */
	public ngOnInit (): void {
		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.selectedProfileGroup) {
			this.clear();
			// this.params.id = this.selectedProfileGroup.id;
			this.loadData();
		}
	}

	/**
	 * load data
	 */
	public loadData () {
		this.status.isLoading = true;
		forkJoin(
			// this.getProfileRecommendations(),
			this.getSoftwareGroupAssets(),
			this.getSoftwareGroupVersions(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;
				this.logger.debug('assets software.component: loadData()::Done Loading');
			});
	}

	/**
	 * get profile recommendations list
	 * @returns profile recommendation observable
	 */
	public getProfileRecommendations () {
		return this.osvService.getProfileRecommendations(this.params)
			.pipe(
				map((response: any) => {
					this.recommendations = response;
				}),
				catchError(err => {
					this.logger.error('OSV Asset Recommendations : getAssetDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * get profile assets list
	 * @returns profile assets list observable
	 */
	public getSoftwareGroupAssets () {
		return this.osvService.getSoftwareGroupAsset(this.params)
			.pipe(
				map((response: any) => {
					this.softwareGroupAssets = response;
					this.buildSoftwareGroupAssetsTable();
				}),
				catchError(err => {
					this.logger.error('OSV SG : getSoftwareGroupAsset() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * get profile versions list
	 * @returns profile versions list observable
	 */
	public getSoftwareGroupVersions () {
		return this.osvService.getSoftwareGroupVersions(this.params)
			.pipe(
				map((response: ProfileVersion[]) => {
					this.softwareGroupVersions = response;
					this.buildSoftwareGroupVersionsTable();
				}),
				catchError(err => {
					this.logger.error('OSV SG : getSoftwareGroupVersions() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * Resets data fields
	 */
	public clear () {
		// this.recommendations = null;
		this.softwareGroupAssets = null;
		this.softwareGroupVersions = null;
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Checks if our currently selected software group has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentSelectedGroup = _.get(changes, ['selectedProfileGroup', 'currentValue']);
		const isFirstChange = _.get(changes, ['selectedProfileGroup', 'firstChange']);
		if (currentSelectedGroup && !isFirstChange) {
			this.refresh();
		}
	}

	/**
	 * build software group versions table
	 */
	public buildSoftwareGroupVersionsTable () {
		const datePipe = new DatePipe('en-US');
		if (!this.profileVersionsTable) {
			this.profileVersionsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						sortable: true,
						sortDirection: 'desc',
						sorting: true,
						width: '10%',
					},
					{
						name: I18n.get('_OsvReleaseDate_'),
						render: item => item.postDate ?
							datePipe.transform(
								new Date(item.postDate), 'yyyy MMM dd') :
							'',
						sortable: false,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvAssetCount_'),
						sortable: false,
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalOSVersion_'),
						sortable: false,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: false,
				sortable: true,
				striped: true,
				wrapText: true,
			});
		}
	}

	/**
	 * build software group assets table
	 */
	public buildSoftwareGroupAssetsTable () {
		const datePipe = new DatePipe('en-US');
		if (!this.profileAssetsTable) {
			this.profileAssetsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'hostName',
						name: I18n.get('_OsvHostName'),
						width: '10%',
						sortable: true,
						sortDirection: 'desc',
						sorting: true,
					},
					{
						key: 'ipAddress',
						name: I18n.get('_OsvIpAddress_'),
						sortable: false,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
					},
					{
						key: 'swVersion',
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable: false,
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersion_'),
						sortable: false,
					},
					{
						key: 'deployment',
						name: I18n.get('_OsvDeploymentStatus_'),
						sortable: false,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: false,
				sortable: true,
				striped: true,
				wrapText: true,
			});
		}
	}
}
