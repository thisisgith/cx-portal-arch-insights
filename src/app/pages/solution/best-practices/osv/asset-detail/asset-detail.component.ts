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
import { OSVService, BasicRecommendationsResponse } from '@sdp-api';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { DatePipe } from '@angular/common';

/** Our current customerId */
const customerId = '2431199';

/**
 * Asset Software Details Component
 */
@Component({
	selector: 'asset-details',
	templateUrl: './asset-detail.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit, OnDestroy {
	@ViewChild('recommendationDetail', { static: true })
	private recommendationDetailTemplate: TemplateRef<{ }>;

	@Input() public fullscreen;
	public data: any;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public view: 'list' | 'timeline' = 'timeline';
	public basicRecommendationsTable: CuiTableOptions;

	constructor (
		private logger: LogService,
		private osvService: OSVService,
	) { }

	/**
	 * Resets data fields
	 */
	private clear () {
		// todo clear
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
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
		this.osvService.getBasicRecommendations({ customerId })
			.pipe(
				map((response: BasicRecommendationsResponse) => {
					this.data = response;
				}),
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;
				this.buildTable();
			});
	}

	/**
	 * Table view for basic recommendations
	 */
	public buildTable () {
		const datePipe = new DatePipe('en-US');

		if (!this.basicRecommendationsTable) {
			this.basicRecommendationsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'versionSummary',
						name: I18n.get('_OsvVersionSummary_'),
						width: '30%',
					},
					{
						key: 'version',
						name: I18n.get('_OsvVersion_'),
						width: '10%',
					},
					{
						key: 'status',
						name: I18n.get('_OsvStatusOrAction_'),
						width: '30%',
					},
					{
						key: 'releaseDate',
						name: I18n.get('_OsvReleaseDate_'),
						render: item =>
							datePipe.transform(item.releaseDate, 'yyyy MMM dd'),
						width: '20%',
					},
				],
				rowWellTemplate: this.recommendationDetailTemplate,
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: true,
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
}
