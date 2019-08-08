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
	InventoryService,
	Assets,
	Asset,
	FieldNoticeAdvisoryResponse,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	mergeMap,
	catchError,
} from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

/** Data Interface */
export interface Data {
	notice?: FieldNotice;
	bulletin?: FieldNoticeBulletin;
	advisory?: FieldNoticeAdvisory;
	impacted?: Asset[];
	potentiallyImpacted?: Asset[];
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
		assets?: InventoryService.GetAssetsParams;
	};

	public data: Data = { };
	public isLoading = false;
	public upVoteSelected = false;
	public downVoteSelected = false;

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
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
				const affected = _.filter(response.data,
					{ fieldNoticeId: _.toSafeInteger(this.id) }) || [];

				_.set(this.data, 'notice', _.head(affected));

				return forkJoin(
					this.getFieldNoticeBulletin(),
					this.getAssets(affected),
				);
			}),
			catchError(err => {
				this.logger.error('field-notice-details.component : getFieldNotice() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the assets affected by the field notice
	 * @param fieldNotices the field notices to look over
	 * @returns the observable
	 */
	private getAssets (fieldNotices: FieldNotice[]) {
		const vulFieldNotices = _.filter(fieldNotices, x => x.vulnerabilityStatus === 'VUL', []);
		const vulHwIds = _.flatMap(vulFieldNotices, x => _.get(x, 'hwInstanceId'));
		const potvulFieldNotices =
			_.filter(fieldNotices, x => x.vulnerabilityStatus === 'POTVUL', []);
		const potvulHwIds = _.flatMap(potvulFieldNotices, x => _.get(x, 'hwInstanceId'));

		this.params.assets = {
			customerId: this.customerId,
			hwInstanceId: _.map(fieldNotices, 'hwInstanceId'),
		};

		return this.inventoryService.getAssets(this.params.assets)
		.pipe(
			map((response: Assets) => {
				const data = _.get(response, 'data', []);
				const vulData =
					_.filter(data, x => _.includes(vulHwIds, _.get(x, 'hwInstanceId')));
				_.set(this.data, 'impacted', vulData);

				const potvulData =
					_.filter(data, x => _.includes(potvulHwIds, _.get(x, 'hwInstanceId')));
				_.set(this.data, 'potentiallyImpacted', potvulData);
			}),
			catchError(err => {
				this.logger.error('field-notice-details.component : getAssets() ' +
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

	/**
	 * Handles the clicking of vote buttons
	 * @param event click event
	 */
	public voteClicked (event: Event) {
		const btnId = _.get(event, 'toElement.id');
		if (btnId === 'upVoteBtn') {
			this.upVoteSelected = !this.upVoteSelected;
			if (this.downVoteSelected) {
				this.downVoteSelected = false;
			}
		}
		if (btnId === 'downVoteBtn') {
			this.downVoteSelected = !this.downVoteSelected;
			if (this.upVoteSelected) {
				this.upVoteSelected = false;
			}
		}
	}
}
