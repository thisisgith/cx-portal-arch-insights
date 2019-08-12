import {
	Component,
	OnInit,
	Input,
} from '@angular/core';
import {
	Style,
	LngLatLike,
} from 'mapbox-gl';
import { GeoCodeService } from '@services';
import { GeoCodeFeature } from '@interfaces';
import {
	AssetSummary,
} from '@sdp-api';

import * as _ from 'lodash-es';

/**
 * Displays a map with a single device icon
 */
@Component({
	selector: 'asset-map',
	styleUrls: ['./asset-map.component.scss'],
	templateUrl: './asset-map.component.html',
})
export class AssetMapComponent implements OnInit {
	@Input() public assetSummary: AssetSummary;

	public displayAddress: {
		line1: string;
		line2: string;
		name: string;
	};
	public style: Style | string = 'mapbox://styles/mapbox/light-v9';
	public zoom: number[];
	public center: LngLatLike;
	public marker: GeoCodeFeature;
	public loading: boolean;

	constructor (private geoCodeService: GeoCodeService) { }

	/**
	 * Initializes map
	 */
	public ngOnInit () {
		this.updateCenter();
	}

	/**
	 * Updates the map center based on the
	 * provided addresses value.
	 *
	 * API Notes:
	 * Country should be passed in as a query parameter,
	 * not as part of the location string.
	 */
	private updateCenter () {
		if (this.assetSummary) {
			this.loading = true;
			const {
				installSiteName,
				installAddress1,
				installCity,
				installState,
				installProvince,
				installCountry,
			} = _.pick(this.assetSummary, [
				'installSiteName',
				'installAddress1',
				'installCity',
				'installState',
				'installProvince',
				'installCountry',
			]);
			const state = installState || installProvince;
			const addressUrl = `${installAddress1},${installCity},${state}`;
			this.displayAddress = {
				line1: installAddress1,
				line2: `${installCity} ${state} ${installCountry}`,
				name: installSiteName,
			};
			this.geoCodeService.forwardLookup(addressUrl, {
				// TODO: Uncomment country param when SDP fixes
				// their API to return country instead of county
				// country: installCountry,
				limit: 1,
			})
				.subscribe(data => {
					this.loading = false;
					if (data.features && data.features.length) {
						this.marker = data.features[0];
						this.center = data.features[0].center;
						this.zoom = [11];
					} else {
						this.clearMap();
					}
				}, () => {
					this.clearMap();
				});
		} else {
			this.clearMap();
		}
	}

	/**
	 * Resets the map to zero
	 */
	private clearMap () {
		this.center = [0, 0];
		this.zoom = [0];
		this.loading = false;
	}
}
