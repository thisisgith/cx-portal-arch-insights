import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	EventEmitter,
	Output,
	SimpleChanges,
	ElementRef,
} from '@angular/core';
import {
	Asset, NetworkElement, InventoryService, Assets, NetworkElementResponse,
} from '@sdp-api';

import { Subject, of } from 'rxjs';
import {
	takeUntil, catchError, map, mergeMap,
} from 'rxjs/operators';
import { UserResolve } from '@utilities';
import { Alert, Panel360 } from '@interfaces';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import { DetailsPanelStackService } from '@services';

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
export class AssetDetailsComponent implements OnInit, OnDestroy, Panel360 {

	@Input('serialNumber') public serialNumber: string;
	@Input('asset') public asset: Asset;
	@Input('element') public element: NetworkElement;
	@Output('close') public close = new EventEmitter<boolean>();

	public alert: any = { };
	public isLoading = false;
	public hidden = true;
	public fullscreen = false;
	public customerId: string;
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;
	private destroyed$: Subject<void> = new Subject<void>();
	@Input() public minWidth;
	@Input() public fullscreenToggle;

	constructor (
		private inventoryService: InventoryService,
		private logger: LogService,
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
		private _elementRef: ElementRef,
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
	}

	/**
	 * Handles displaying an alert from its child components
	 * @param alert the alert to display
	 */
	public handleAlert (alert: Alert) {
		this.alert.show(alert.message, alert.severity);
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

		return this.inventoryService.getAssets({
			customerId: this.customerId,
			page: 1,
			rows: 1,
			serialNumber: [this.serialNumber],
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
		);
	}

	/**
	 * Fetches the network element
	 * @param asset the asset to use for lookup
	 * @returns the observable
	 */
	private fetchNetworkElement (asset: Asset) {
		if (this.element) {
			return of(this.element);
		}

		return this.inventoryService.getNetworkElements({
			customerId: this.customerId,
			serialNumber: [asset.serialNumber],
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
		);
	}

	/**
	 * Refreshes our data
	 */
	private refresh () {
		this.isLoading = true;

		// If our serial number and our asset/element don't match,
		// we need to unset them so we can refetch them
		const serial = this.serialNumber ? this.serialNumber : _.get(this.asset, 'serialNumber');
		if (serial && this.element && _.get(this.element, 'serialNumber') !== serial) {
			this.element = null;
		}
		if (serial && this.asset && _.get(this.asset, 'serialNumber') !== serial) {
			this.asset = null;
		}

		this.fetchAsset()
		.pipe(
			mergeMap((asset: Asset) => this.fetchNetworkElement(asset)),
		)
		.subscribe(() => {
			this.isLoading = false;
		});
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.detailsPanelStackService.push(this);
		this.refresh();
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

	/**
	 * Determines whether target is contained by this component
	 * @param target target ElementRef
	 * @returns true if component contains target
	 */
	public contains (target: ElementRef) {
		return this._elementRef.nativeElement.contains(target);
	}
}
