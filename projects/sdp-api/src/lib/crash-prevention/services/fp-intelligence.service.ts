/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { CrashPreventionConfiguration as __Configuration } from '../crash-prevention-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { SimilarDevicesList } from '../models/similar-devices-list';
import { SimilarDevicesDistribution } from '../models/similar-devices-distribution';
import { environment } from '@environment';


@Injectable({
    providedIn: 'root',
})
class FpIntelligenceService extends __BaseService {
    static readonly getSimilarDevicesPath = '/customerportal/fingerprint/v1/similar-devices/';
    static readonly getSimilarDevicesDistributionPath = '/customerportal/fingerprint/v1/similar-devices-distribution/';

    constructor(
        config: __Configuration,
        http: HttpClient
    ) {
        super(config, http);
    }

    /**
     * @param params The `FpIntelligenceService.GetSimilarDevicesParams` containing the following parameters:
     *
     * - `customerId`: Unique identifier of a Cisco customer.
     *
     * @return successful operation
     */
    getSimilarDevicesResponse(params: FpIntelligenceService.GetSimilarDevicesParams): __Observable<__StrictHttpResponse<SimilarDevicesList>> {
        let __params = this.newParams();
        let __headers = new HttpHeaders();
        let __body: any = null;
        __params = __params.set('similarityCriteria',params.similarityCriteria);
        __params = __params.set('page',params.page.toString());
        __params = __params.set('size',params.size.toString());
        let req = new HttpRequest<any>(
            'GET',
            this.rootUrl + FpIntelligenceService.getSimilarDevicesPath + `${params.customerId}/`+ btoa(params.deviceId),
            __body,
            {
                headers: __headers,
                params: __params,
                responseType: 'json',
            });

        return this.http.request<any>(req).pipe(
            __filter(_r => _r instanceof HttpResponse),
            __map((_r) => {
                return _r as __StrictHttpResponse<SimilarDevicesList>;
            })
        );
    }

    /**
   * @param params The `FpIntelligenceService.GetSimilarDevicesParams` containing the following parameters:
   *
   * - `remoteNodeId`: The transaction id of the request
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
    getSimilarDevices(params: FpIntelligenceService.GetSimilarDevicesParams): __Observable<SimilarDevicesList> {
        return this.getSimilarDevicesResponse(params).pipe(
            __map(_r => _r.body as SimilarDevicesList)
        );
    }

    /**
     * @param paramss The `FpIntelligenceService.GetSimilarDevicesParams`
     *
     * - `customerId`: Unique identifier of a Cisco customer.
     *
     * - `productId`: The producct ID of the product family
     *
     * @return successful operation
     */
    getSimilarDevicesDistribution(params: FpIntelligenceService.GetSimilarDevicesParams): __Observable<SimilarDevicesDistribution> {
        return this.getSimilarDevicesDistributionResponse(params).pipe(
            __map(_r => _r.body as SimilarDevicesDistribution)
        );
    }

    /**
 * @param paramss The `FpIntelligenceService.GetFpIntelligenceDevicesParams`
 *
 * - `customerId`: Unique identifier of a Cisco customer.
 *
 * - `productId`: The producct ID of the product family
 *
 * @return successful operation
 */
    getSimilarDevicesDistributionResponse(params: FpIntelligenceService.GetSimilarDevicesParams): __Observable<__StrictHttpResponse<SimilarDevicesDistribution>> {
        let __params = this.newParams();
        let __headers = new HttpHeaders();
		let __body: any = null;
		__params = __params.set('similarityCriteria',params.similarityCriteria);
        __params = __params.set('minMatch',params.minMatch.toString());
        __params = __params.set('deviceCount',params.deviceCount.toString());
        let req = new HttpRequest<any>(
            'GET',
            this.rootUrl + FpIntelligenceService.getSimilarDevicesDistributionPath +`${params.customerId}/`+ btoa(params.deviceId),
            __body,
            {
                headers: __headers,
                params: __params,
                responseType: 'json',
            });

        return this.http.request<any>(req).pipe(
            __filter(_r => _r instanceof HttpResponse),
            __map((_r) => {
                return _r as __StrictHttpResponse<SimilarDevicesDistribution>;
            })
        );
    }
}

module FpIntelligenceService {

    /**
     * Parameters for getSimilarDevices
     */
    export interface GetSimilarDevicesParams {

        /**
         * Indicates generic product families are required
         */
        deviceId: string;

        /**
         * Unique identifier of a Cisco customer.
         */
        customerId: string;

        minMatch?: number;
        deviceCount?: number;
        similarityCriteria: string;
        page?: number;
        size?: number;
    }

}

export { FpIntelligenceService }
