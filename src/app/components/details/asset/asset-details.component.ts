import {
	Component,
	Input,
	OnDestroy,
	EventEmitter,
	Output,
	SimpleChanges,
	OnInit,
} from '@angular/core';
import {
	Asset,
	Assets,
	InventoryService,
	NetworkElement,
	NetworkElementResponse,
	TransactionStatusResponse,
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';

import { Subject, of, forkJoin } from 'rxjs';
import {
	takeUntil, catchError, map,
} from 'rxjs/operators';
import { UserResolve } from '@utilities';
import { Alert, Panel360 } from '@interfaces';
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
	@Input('asset') public asset: Asset;
	@Input('element') public element: NetworkElement;
	@Output('close') public close = new EventEmitter<boolean>();
	@Output('scanStatus') public scanStatus = new EventEmitter<TransactionStatusResponse>();

	@Input() public minWidth;
	@Input() public fullscreenToggle;

	public alert: any = { };
	public isLoading = false;
	public hidden = true;
	public fullscreen = false;
	public customerId: string;
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;
	public advisoryReload: EventEmitter<boolean> = new EventEmitter();
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

			this.fetchAsset()
			.subscribe(() => {
				this.isLoading = false;

				if (!this.asset) {
					// In case our refresh fails, use our previously found asset
					this.asset = cachedAsset;
				}
			});
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
	 * Fetches the asset
	 * @returns the observable
	 */
	private fetchAsset () {
		if (this.asset) {
			return of(this.asset);
		}

		return this.serialNumber ?
			this.inventoryService.getAssets({
				customerId: this.customerId,
				page: 1,
				rows: 1,
				serialNumber: [this.serialNumber],
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: Assets) => {
					const asset: Asset = _.head(response.data);

					this.asset = asset ? asset : null;
				}),
				catchError(err => {
					this.logger.error('asset-details.component : fetchAsset()' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			) : of({ });
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

		return this.serialNumber ?
			this.inventoryService.getNetworkElements({
				customerId: this.customerId,
				serialNumber: [this.serialNumber],
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
	 * Refreshes our data
	 */
	private refresh () {
		this.isLoading = true;

		// If our serial number and our asset/element don't match,
		// we need to unset them so we can refetch them
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

		forkJoin(
			this.fetchAsset(),
			this.fetchNetworkElement(),
		)
		.subscribe(() => {
			this.isLoading = false;

			if (!this.serialNumber || !this.asset) {
				// Have to force a cycle so that alert is instantiated correctly
				setTimeout(() => {
					this.handleAlert({
						message: I18n.get('_UnableToRetrieveAssetDetails_'),
						severity: 'danger',
					});
				}, 0);
			}
		});
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
