import {
	Component,
	SimpleChanges,
	Input,
	OnInit,
	OnChanges,
	Output,
	EventEmitter,
	OnDestroy,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	ProductAlertsService,
	SecurityAdvisory,
	SecurityAdvisoryBulletin,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryInfo,
	SecurityAdvisoriesResponse,
	RacetrackSolution,
	RacetrackTechnology,
	InventoryService,
	HardwareAssets,
	HardwareAsset,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	catchError,
	takeUntil,
	mergeMap,
} from 'rxjs/operators';
import { of, forkJoin, Subject } from 'rxjs';
import { AssetIds } from '../impacted-assets/impacted-assets.component';
import { Alert } from '@interfaces';
import { RacetrackInfoService } from '@services';

/** Data Interface */
export interface Data {
	advisory?: SecurityAdvisoryInfo;
	notice?: SecurityAdvisory;
	bulletin?: SecurityAdvisoryBulletin;
	assetIds?: AssetIds;
}

/**
 * The interface for our output
 */
export interface Impacted {
	assets: HardwareAsset[];
}

/**
 * Security Details Component
 */
@Component({
	selector: 'security-details',
	styleUrls: ['./security-details.component.scss'],
	templateUrl: './security-details.component.html',
})
export class SecurityDetailsComponent implements OnInit, OnChanges, OnDestroy {

	@Input('id') public id: string;
	@Input('advisory') public advisory: SecurityAdvisoryInfo;
	@Input('customerId') public customerId: string;
	@Output('details') public details = new EventEmitter<Data>();
	@Output('alert') public alertMessage = new EventEmitter<Alert>();
	@Output('assets') public assets = new EventEmitter<Impacted>();
	public impactedAssets: HardwareAsset[] = [];

	private params: {
		advisory?: ProductAlertsService.GetAdvisoriesSecurityAdvisoriesParams;
		notice?: ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin?: ProductAlertsService.GetPSIRTBulletinParams;
		assets?: InventoryService.GetHardwareAssetsParams;
	};

	public impactedCount = 0;
	public potentiallyImpactedCount = 0;
	public activeTab = 0;
	public data: Data = { };
	public isLoading = false;
	private destroyed$: Subject<void> = new Subject<void>();
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	public affectedSystems = [];

	constructor (
		private inventoryService: InventoryService,
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
		private racetrackInfoService: RacetrackInfoService,
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
	 * Fetches our advisory
	 * @returns the observable
	 */
	private getAffectedSystemSupportCoverage () {
		const supportCoverageParams = {
			customerId: this.customerId,
			advisoryId: [_.toSafeInteger(this.id)],
			vulnerabilityStatus: ['POTVUL', 'VUL'],
		};
		return this.productAlertsService.getAdvisoryAffectedSystemSupportCoverage(supportCoverageParams)
			.pipe(
				mergeMap(response => {
					this.affectedSystems = response || [];
					const supportedSystems = _.filter(this.affectedSystems, 'supportCovered');
					if (_.size(supportedSystems)) {
						return this.fetchHardwareAssets(supportedSystems);
					}

					return of({ });
				}),
				catchError(err => {
					this.logger.error('security-details.component : getAffectedSystemSupportCoverage() ' +
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
					solution: this.selectedSolutionName,
					useCase: this.selectedTechnologyName,
					vulnerabilityStatus: ['POTVUL', 'VUL'],
				},
			};
			obsBatch.push(this.getSecurityAdvisoryBulletin());
			obsBatch.push(this.getAffectedSystemSupportCoverage());

			if (this.advisory) {
				_.set(this.data, 'advisory', this.advisory);
			} else {
				this.params.advisory = {
					advisoryId: [_.toSafeInteger(this.id)],
					customerId: this.customerId,
					solution: this.selectedSolutionName,
					useCase: this.selectedTechnologyName,
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
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.refresh();
			}
		});
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

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Fetches the hardware assets from /assets api
	 * @param supportedSystems systems for which support is covered
	 * @returns the observable
	 */
	private fetchHardwareAssets (supportedSystems) {
		_.set(this.params, 'assets', {
			customerId: this.customerId,
			page: 1,
			rows: 100,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		});
		const serials = _.uniq(
			_.map(supportedSystems, 'serialNumber'));

		if (!serials.length) {
			return of({ });
		}
		_.set(this.params.assets, 'serialNumber', serials);

		return this.inventoryService.getHardwareAssets(this.params.assets)
			.pipe(
				map((response: HardwareAssets) => {
					this.impactedAssets = _.get(response, 'data', []);
					this.assets.emit({ assets: this.impactedAssets });

				}),
				catchError(err => {
					this.logger.error('advisory-details:impacted-assets.component : fetchAssets() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);

	}
}
