import {
	Component,
	SimpleChanges,
	Input,
	OnInit,
	OnChanges,
	Output,
	EventEmitter,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	FieldNotice,
	FieldNoticeBulletin,
	FieldNoticeResponse,
	FieldNoticeBulletinResponse,
	ProductAlertsService,
	FieldNoticeAdvisory,
	FieldNoticeAdvisoryResponse,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	mergeMap,
	catchError,
} from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { AssetIds } from '../impacted-assets/impacted-assets.component';

/** Data Interface */
export interface Data {
	notice?: FieldNotice;
	bulletin?: FieldNoticeBulletin;
	advisory?: FieldNoticeAdvisory;
	assetIds?: AssetIds;
}

/**
 * Field Notice Details Component
 */
@Component({
	selector: 'field-notice-details',
	styleUrls: ['./field-notice-details.component.scss'],
	templateUrl: './field-notice-details.component.html',
})
export class FieldNoticeDetailsComponent implements OnInit, OnChanges {

	@Input('id') public id: string;
	@Input('advisory') public advisory: FieldNoticeAdvisory;
	@Input('customerId') public customerId: string;
	@Output('details') public details = new EventEmitter<Data>();

	private params: {
		advisory?: ProductAlertsService.GetAdvisoriesFieldNoticesParams;
		notice: ProductAlertsService.GetFieldNoticeParams;
		bulletin: ProductAlertsService.GetFieldNoticeBulletinParams;
	};

	public impactedCount = 0;
	public activeTab = 0;
	public data: Data = { };
	public isLoading = false;
	public upVoteSelected = false;
	public downVoteSelected = false;

	constructor (
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
	) { }

	/**
	 * Retrieves the field notices
	 * @returns the data
	 */
	private getFieldNotice () {
		return this.productAlertsService.getFieldNotice(this.params.notice)
		.pipe(
			mergeMap((response: FieldNoticeResponse) => {
				const data = _.get(response, 'data', []);
				_.set(this.data, 'notice', _.head(data));

				const vulFieldNotices = _.filter(data, { vulnerabilityStatus: 'VUL' }) || [];
				const vulIds = _.compact(_.map(vulFieldNotices, 'managedNeId')) || [];

				if (vulIds.length) {
					_.set(this.data, ['assetIds', 'impacted'], vulIds);
				}
				const potVulFieldNotices = _.filter(data, { vulnerabilityStatus: 'POTVUL' }) || [];
				const potVulIds = _.compact(_.map(potVulFieldNotices, 'managedNeId')) || [];

				if (potVulIds.length) {
					_.set(this.data, ['assetIds', 'potentiallyImpacted'], potVulIds);
				}

				return this.getFieldNoticeBulletin();
			}),
			catchError(err => {
				this.logger.error('field-notice-details.component : getFieldNotice() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the field notice bulletins
	 * @param append appends the values
	 * @returns the observable
	 */
	private getFieldNoticeBulletin () {
		return this.productAlertsService.getFieldNoticeBulletin(this.params.bulletin)
		.pipe(
			map((response: FieldNoticeBulletinResponse) => {
				_.set(this.data, 'bulletin', _.head(response.data));
			}),
			catchError(err => {
				this.logger.error('field-notice-details.component : getFieldNoticeBulletin() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches our advisory
	 * @returns the observable
	 */
	private getAdvisory () {
		return this.productAlertsService.getAdvisoriesFieldNotices(this.params.advisory)
		.pipe(
			map((response: FieldNoticeAdvisoryResponse) => {
				_.set(this.data, 'advisory', _.head(response.data));
			}),
			catchError(err => {
				this.logger.error('field-notice-details.component : getAdvisory() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Refresh Function
	 */
	public refresh () {
		const advisoryId = _.get(this.advisory, 'id');
		this.data = { };
		this.activeTab = 0;
		this.impactedCount = 0;
		if (this.id || advisoryId) {
			if (!this.id) {
				this.id = advisoryId;
			}
			const obsBatch = [];

			this.params = {
				bulletin: {
					fieldNoticeId: [_.toSafeInteger(this.id)],
				},
				notice: {
					customerId: this.customerId,
					fieldNoticeId: [_.toSafeInteger(this.id)],
					vulnerabilityStatus: ['POTVUL', 'VUL'],
				},
			};
			obsBatch.push(this.getFieldNotice());

			if (this.advisory) {
				_.set(this.data, 'advisory', this.advisory);
			} else {
				this.params.advisory = {
					customerId: this.customerId,
					id: [_.toSafeInteger(this.id)],
				};

				obsBatch.push(this.getAdvisory());
			}

			this.isLoading = true;

			forkJoin(obsBatch)
			.subscribe(() => {
				this.isLoading = false;
				this.details.emit(this.data);
			});
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentId = _.get(changes, ['id', 'currentValue']);
		if (currentId && !changes.id.firstChange) {
			this.refresh();
		}
	}
}
