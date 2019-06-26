import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment';
import { RMAResponse } from '@interfaces';
import * as _ from 'lodash-es';

/**
 * Service which contains all calls to our RMA service
 */
@Injectable({
	providedIn: 'root',
})
export class RMAService {
	private serviceUrl = `${
		environment.rmaServiceOrigin
	}${
		environment.rmaServicePaths.returns
	}`;

	constructor (private http: HttpClient) { }

	/**
	 * Returns detailed information about the specified RMA.
	 * @param rma_number 9 digit RMA number
	 * @returns Observable resolving to an RMA Response object
	 */
	public getByNumber (rma_number: string | number): Observable<RMAResponse> {
		return <Observable<RMAResponse>> this.http.get(
			`${this.serviceUrl}/rma_numbers/${rma_number}`,
		)
		.pipe(map(result => {
			if (_.has(result, 'APIError')) {
				throw new Error('APIError');
			}

			return result;
		}));
	}
}
