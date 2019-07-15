import {
	Component,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Asset Software Details Component
 */
@Component({
	selector: 'asset-software-details',
	templateUrl: './details.component.html',
})

export class AssetSoftwareDetailsComponent implements OnChanges, OnInit {
	public status = {
		loading: {
		},
	};
	public fullscreen = false;

	constructor (
		private logger: LogService,
	) { }

	/**
	 * Resets data fields
	 */
	private clear () {
		//todo clear
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
		//todo
	}
}
