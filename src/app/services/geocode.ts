import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment';
import { GeoCodeResponse, GeoCodeParams } from '@interfaces';

/**
 * Service for forward geocode lookups.
 */
@Injectable({
	providedIn: 'root',
})
export class GeoCodeService {
	private serviceUrl = `${environment.mapboxHost}${environment.mapboxForwardGeocodePath}`;

	/**
	 * Cache to prevent repeating geocode requests.
	 * Geocodes are rate limited to 600 requests per minute.
	 * TODO: Implement throttling and re-try logic in the
	 * event of a rate limit.
	 */
	private cachedResponses: {
		[key: string]: GeoCodeResponse;
	} = { };

	constructor (private http: HttpClient) { }

	/**
	 * Converts a street address into a GeoJSON response object
	 * with latitude and longitude coordinates.
	 * @param address Street address
	 * @param params Options for the GeoJSON API
	 * @returns Observable resolving the GeoJSON response
	 */
	public forwardLookup (
		address: string,
		params: GeoCodeParams = {
			limit: 1,
		},
	): Observable<GeoCodeResponse> {
		if (this.cachedResponses[address]) {
			return <Observable<GeoCodeResponse>> of(this.cachedResponses[address]);
		}

		const url = `${this.serviceUrl}/${address}.json`;

		// Do not allow overriding of the token
		params.access_token = environment.mapboxToken;

		let httpParams = new HttpParams();
		Object.keys(params)
			.forEach(key => {
				httpParams = httpParams.append(key, params[key]);
			});

		return <Observable<GeoCodeResponse>> this.http.get(url, { params: httpParams })
		.pipe(map((response: GeoCodeResponse) => {
			this.cachedResponses[address] = response;

			return response;
		}));
	}
}
