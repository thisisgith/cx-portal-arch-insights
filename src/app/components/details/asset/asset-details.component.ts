import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	InventoryService,
	NetworkElement,
	NetworkElementResponse,
	PolicyResponseModel,
	RacetrackSolution,
	RacetrackTechnology,
	TransactionStatusResponse,
	HardwareAsset,
	SystemAsset,
	AssetSummary,
	Asset,
	HardwareAssets,
} from '@sdp-api';

import { Subject, of, forkJoin } from 'rxjs';
import {
	catchError,
	map,
	mergeMap,
	takeUntil,
} from 'rxjs/operators';
import { UserResolve } from '@utilities';
import { Alert, Panel360, ModSystemAsset, ModHardwareAsset } from '@interfaces';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import { DetailsPanelStackService, RacetrackInfoService } from '@services';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Asset Details Component
 */
@Component({
	host: {
		'[class.hidden]': 'hidden',
	},
	selector: 'asset-details',
	styleUrls: ['./asset-details.component.scss'],
	templateUrl: './asset-details.component.html',
})
export class AssetDetailsComponent implements OnDestroy, OnInit, Panel360 {

	@Input('serialNumber') public serialNumber: string;
	@Input('asset') public asset: Asset | SystemAsset | HardwareAsset;
	@Input('element') public element: NetworkElement;
	@Input('scanPolicy') public scanPolicy: PolicyResponseModel;
	@Input() public minWidth;
	@Input() public fullscreenToggle;

	@Output('close') public close = new EventEmitter<boolean>();
	@Output('scanStatus') public scanStatus = new EventEmitter<TransactionStatusResponse>();

	public alert: any = { };
	public isLoading = false;
	public hidden = true;
	public fullscreen = false;
	public customerId: string;
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;
	public advisoryReload: EventEmitter<boolean> = new EventEmitter();
	public systemAsset: ModSystemAsset;
	public hardwareAsset: ModHardwareAsset;
	public hardwareAssets: ModHardwareAsset[];
	// Change tab index to determine the currently opened tab
	public tabIndex = 0;
	public headerScanStatus: { error: boolean; inProgress: boolean; } = {
		error: false, inProgress: false,
	};

	private destroyed$: Subject<void> = new Subject<void>();
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	constructor (
		private inventoryService: InventoryService,
		private logger: LogService,
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	/**
	 * Clears the variables
	 */
	private clear () {
		this.asset = null;
		this.element = null;
		this.serialNumber = null;
	}

	/**
	 * Handles displaying an alert from its child components
	 * @param alert the alert to display
	 */
	public handleAlert (alert: Alert) {
		this.alert.show(alert.message, alert.severity);
	}

	/**
	 * Will handle sending an update to a component based on the scan status
	 * @param transaction the transaction status of the completed or failed scan
	 */
	public handleScanStatus (transaction: TransactionStatusResponse) {
		if (transaction.status === 'SUCCESS') {
			this.advisoryReload.next(true);

			this.scanStatus.emit(transaction);

			const cachedAsset = _.cloneDeep(this.asset);
			this.asset = null;
			this.isLoading = true;

			this.headerScanStatus = {
				error: false,
				inProgress: false,
			};

			this.fetchSystem()
			.subscribe(() => {
				this.isLoading = false;

				if (!this.asset) {
					// In case our refresh fails, use our previously found asset
					this.asset = cachedAsset;
				}
			});
		} else if (transaction.status === 'FAILURE') {
			this.headerScanStatus = {
				error: true,
				inProgress: false,
			};
		} else {
			this.headerScanStatus = {
				error: false,
				inProgress: true,
			};
		}
	}

	/**
	 * determine if close from child data
	 * @param $event gets the boolean value
	 */
	public onPanelClose () {
		this.clear();
		this.close.emit(true);
	}

	/**
	 * Destroys the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Fetches the system
	 * @returns the observable
	 */
	private fetchSystem () {
		if (!this.asset) {
			return of({ });
		}

		const params = {
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};

		const neId = _.get(this.asset, 'neId');

		/**
		 * First we have to fetch the system based on the neId,
		 * if our serial number matches we are a 'System' and stay
		 * on the summary tab, else we redirect to the 'Hardware' tab,
		 * then we fetch all of the hardware based on the neId.
		 * After we have all of the hardware assets, we fetch the summary
		 * information for all of the hardware.
		 */
		return forkJoin([
			this.inventoryService.getSystemAssets({
				...params,
				neId,
				page: 1,
				rows: 1,
			}),
			this.inventoryService.getAssetSystemSummary({
				neId,
				customerId: this.customerId,
			}),
			this.inventoryService.getHardwareAssets({
				...params,
				neId,
				page: 1,
				rows: 100,
			}),
			this.fetchNetworkElement(),
		])
		.pipe(
			mergeMap(responses => {
				this.systemAsset = _.head(responses[0].data);
				this.systemAsset.summary = responses[1];

				this.hardwareAssets = _.get(responses[2], 'data');
				this.hardwareAsset = _.find(this.hardwareAssets,
					{ serialNumber: _.get(this.systemAsset, 'serialNumber') });

				const systemSn = _.get(this.systemAsset, 'serialNumber');
				if (systemSn !== this.serialNumber) {
					this.tabIndex = 1;
				} else {
					this.tabIndex = 0;
				}

				const observables = [];
				this.hardwareAssets.forEach((asset: HardwareAsset) => {
					observables.push(this.inventoryService.getAssetSummary({
						customerId: this.customerId,
						hwInstanceId: asset.hwInstanceId,
					}));
				});

				return forkJoin(observables);
			}),
			map((response: AssetSummary[]) => {
				this.hardwareAssets.forEach((asset: ModHardwareAsset) => {
					asset.summary = _.find(response,
						(as: AssetSummary) => as.hwInstanceId === asset.hwInstanceId,
					);
				});
			}),
			catchError(err => {
				this.logger.error('asset-details.component : fetchSystem()' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the network element
	 * @param asset the asset to use for lookup
	 * @returns the observable
	 */
	private fetchNetworkElement () {
		if (this.element) {
			return of(this.element);
		}

		return this.asset.neId ?
			this.inventoryService.getNetworkElements({
				customerId: this.customerId,
				managedNeId: [this.asset.neId],
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: NetworkElementResponse) => {
					const networkElement: NetworkElement = _.head(response.data);

					this.element = networkElement ? networkElement : null;
				}),
				catchError(err => {
					this.logger.error('asset-details.component : fetchNetworkElement()' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			) : of({ });
	}

	/**
	 * Fetches our hardware asset if we come in with only a serial number
	 * @returns the hardware asset
	 */
	private fetchAsset () {
		return this.inventoryService.getHardwareAssets({
			customerId: this.customerId,
			page: 1,
			rows: 1,
			serialNumber: [this.serialNumber],
		})
		.pipe(
			map((response: HardwareAssets) => {
				const asset = _.head(response.data);

				if (asset) {
					this.asset = asset;
				}
			}),
			catchError(err => {
				this.logger.error('asset-details.component : fetchAsset()' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Refreshes our data
	 */
	private refresh () {
		this.isLoading = true;

		// If our serial number and our asset/element don't match,
		// we need to unset them so we can re-fetch them
		const assetSerial = _.get(this.asset, 'serialNumber');
		const elementSerial = _.get(this.element, 'serialNumber');

		const serial = this.serialNumber || assetSerial || elementSerial;

		if (serial && this.element && elementSerial !== serial) {
			this.element = null;
		}
		if (serial && this.asset && assetSerial !== serial) {
			this.asset = null;
		}
		if (serial && !this.serialNumber) {
			this.serialNumber = serial;
		}

		// Don't even try an fetch asset or NE if we don't have at least a serial number
		if (serial) {
			const neId = _.get(this.asset, 'neId');

			(neId ? of({ }) : this.fetchAsset())
			.pipe(
				mergeMap(() => this.fetchSystem()),
			)
			.subscribe(() => {
				this.isLoading = false;

				if (!this.serialNumber || !this.asset) {
					// Have to force a cycle so that alert is instantiated correctly
					// tslint:disable-next-line
					setTimeout(() => {
						this.handleAlert({
							message: I18n.get('_UnableToRetrieveAssetDetails_'),
							severity: 'danger',
						});
					}, 0);
				}
			});
		} else {
			this.isLoading = false;
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

		this.detailsPanelStackService.push(this);
		this.hidden = false;
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		const currentSerial = _.get(changes, ['serialNumber', 'currentValue']);

		if ((currentAsset && !changes.asset.firstChange) ||
			(currentSerial && !changes.serialNumber.firstChange)) {

			if (currentAsset && !currentSerial) {
				this.serialNumber = _.get(currentAsset, 'serialNumber');
			}
			_.invoke(this.alert, 'hide');
			this.refresh();
		}
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onAllPanelsClose();
		}
	}

	/**
	 * Removes the 360 panel from the stack when the back button is pressed
	 */
	public onPanelBack () {
		this.detailsPanelStackService.pop();
	}

	/**
	 * Closes all 360 panels
	 */
	public onAllPanelsClose () {
		this.detailsPanelStackService.reset();
	}
}
