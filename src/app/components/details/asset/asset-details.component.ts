import {
	Component,
	Input,
	OnDestroy,
	EventEmitter,
	Output,
} from '@angular/core';
import {
	Asset,
} from '@sdp-api';

import { Subject } from 'rxjs';
import {
	takeUntil,
} from 'rxjs/operators';
import { UserResolve } from '@utilities';
import { Alert } from '@interfaces';

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

export class AssetDetailsComponent implements OnDestroy {

	@Input('asset') public asset: Asset;
	@Output('close') public close = new EventEmitter<boolean>();

	public alert: any = { };
	public hidden = true;
	public fullscreen = false;
	public customerId: string;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private userResolve: UserResolve,
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
}
