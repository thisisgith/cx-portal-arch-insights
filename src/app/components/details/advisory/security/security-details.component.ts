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
	ProductAlertsService,
	SecurityAdvisoryResponse,
	SecurityAdvisory,
	SecurityAdvisoryBulletin,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryInfo,
	InventoryService,
	Assets,
	Asset,
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
	advisory?: SecurityAdvisoryInfo;
	notice?: SecurityAdvisory;
	bulletin?: SecurityAdvisoryBulletin;
	affected?: Asset[];
}

/**
 * Security Details Component
 */
@Component({
	selector: 'security-details',
	templateUrl: './security-details.component.html',
})
export class SecurityDetailsComponent implements OnInit, OnChanges {

	@Input('id') public id: string;
	@Input('advisory') public advisory: SecurityAdvisoryInfo;
	@Input('customerId') public customerId: string;
	@Output('details') public details = new EventEmitter<Data>();

	private params: {
		notice: ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin: ProductAlertsService.GetPSIRTBulletinParams;
		assets?: InventoryService.GetAssetsParams;
	};

	public data: Data = { };
	public isLoading = false;

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private productAlertsService: ProductAlertsService,
	) { }

	/**
	 * Retrieves the security advisories
	 * @returns the data
	 */
	private getSecurityAdvisory () {
		return this.productAlertsService.getSecurityAdvisories(this.params.notice)
		.pipe(
			mergeMap((response: SecurityAdvisoryResponse) => {
				const affected = _.filter(response.data,
						{ advisoryId: _.toSafeInteger(this.id) }) || [];
				_.set(this.data, 'notice', _.head(affected));

				return forkJoin(
					this.getSecurityAdvisoryBulletin(),
					this.getAssets(affected),
				);
			}),
			catchError(err => {
				this.logger.error('security-details.component : getSecurityAdvisory() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the security advisory bulletins
	 * @returns the data
	 */
	private getSecurityAdvisoryBulletin () {
		return this.productAlertsService.getPSIRTBulletin(this.params.bulletin)
		.pipe(
			map((response: SecurityAdvisoryBulletinResponse) => {
				_.set(this.data, 'bulletin', _.head(response.data));
			}),
			catchError(err => {
				this.logger.error('security-details.component : getSecurityAdvisoryBulletin() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the assets affected by the security advisory
	 * @param securityAdvisories the security advisories to look over
	 * @returns the observable
	 */
	private getAssets (securityAdvisories: SecurityAdvisory[]) {
		this.params.assets = {
			customerId: this.customerId,
			hwInstanceId: _.map(securityAdvisories, 'hwInstanceId'),
		};

		return this.inventoryService.getAssets(this.params.assets)
		.pipe(
			map((response: Assets) => {
				_.set(this.data, 'affected', _.get(response, 'data', []));
			}),
			catchError(err => {
				this.logger.error('security-details.component : getAssets() ' +
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
			if (this.advisory) {
				_.set(this.data, 'advisory', this.advisory);
			}

			this.isLoading = true;

			this.params = {
				bulletin: {
					securityAdvisoryInstanceId: [_.toSafeInteger(this.id)],
				},
				notice: {
					advisoryId: [_.toSafeInteger(this.id)],
					customerId: this.customerId,
					vulnerabilityStatus: ['POTVUL', 'VUL'],
				},
			};

			this.getSecurityAdvisory()
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
