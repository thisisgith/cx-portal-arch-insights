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
	SecurityAdvisoriesResponse,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	mergeMap,
	catchError,
} from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { AssetIds } from '../impacted-assets/impacted-assets.component';
import { Alert } from '@interfaces';

/** Data Interface */
export interface Data {
	advisory?: SecurityAdvisoryInfo;
	notice?: SecurityAdvisory;
	bulletin?: SecurityAdvisoryBulletin;
	assetIds?: AssetIds;
}

/**
 * Security Details Component
 */
@Component({
	selector: 'security-details',
	styleUrls: ['./security-details.component.scss'],
	templateUrl: './security-details.component.html',
})
export class SecurityDetailsComponent implements OnInit, OnChanges {

	@Input('id') public id: string;
	@Input('advisory') public advisory: SecurityAdvisoryInfo;
	@Input('customerId') public customerId: string;
	@Output('details') public details = new EventEmitter<Data>();
	@Output('alert') public alertMessage = new EventEmitter<Alert>();

	private params: {
		advisory?: ProductAlertsService.GetAdvisoriesSecurityAdvisoriesParams;
		notice?: ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin?: ProductAlertsService.GetPSIRTBulletinParams;
	};

	public impactedCount = 0;
	public activeTab = 0;
	public data: Data = { };
	public isLoading = false;

	constructor (
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
	) { }

	/**
	 * Fetches our advisory
	 * @returns the observable
	 */
	private getAdvisory () {
		return this.productAlertsService.getAdvisoriesSecurityAdvisories(this.params.advisory)
		.pipe(
			map((response: SecurityAdvisoriesResponse) => {
				_.set(this.data, 'advisory', _.head(response.data));
			}),
			catchError(err => {
				this.logger.error('security-details.component : getAdvisory() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the security advisories
	 * @returns the data
	 */
	private getSecurityAdvisory () {
		return this.productAlertsService.getSecurityAdvisories(this.params.notice)
		.pipe(
			mergeMap((response: SecurityAdvisoryResponse) => {
				const data = _.get(response, 'data', []);
				_.set(this.data, 'notice', _.head(data));

				const vulAdvisories = _.filter(data, { vulnerabilityStatus: 'VUL' }) || [];
				const vulIds = _.compact(_.map(vulAdvisories, 'managedNeId')) || [];

				if (vulIds.length) {
					_.set(this.data, ['assetIds', 'impacted'], vulIds);
				}
				const potVulAdvisories = _.filter(data, { vulnerabilityStatus: 'POTVUL' }) || [];
				const potVulIds = _.compact(_.map(potVulAdvisories, 'managedNeId')) || [];

				if (potVulIds.length) {
					_.set(this.data, ['assetIds', 'potentiallyImpacted'], potVulIds);
				}

				return this.getSecurityAdvisoryBulletin();
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
					securityAdvisoryInstanceId: [_.toSafeInteger(this.id)],
				},
				notice: {
					advisoryId: [_.toSafeInteger(this.id)],
					customerId: this.customerId,
					vulnerabilityStatus: ['POTVUL', 'VUL'],
				},
			};
			obsBatch.push(this.getSecurityAdvisory());

			if (this.advisory) {
				_.set(this.data, 'advisory', this.advisory);
			} else {
				this.params.advisory = {
					advisoryId: [_.toSafeInteger(this.id)],
					customerId: this.customerId,
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
