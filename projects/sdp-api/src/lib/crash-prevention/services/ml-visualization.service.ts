/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { CrashPreventionConfiguration as __Configuration } from '../crash-prevention-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { ProductFamiliesList } from '../models/product-families-list';
import { CPProductFamily } from '../models/product-family';
import { MlVisualizationDevices } from '../models/ml-visualization-devices';

@Injectable({
    providedIn: 'root',
})
class MlVisualizationService extends __BaseService {
    static readonly getMlVisualizationDevicesPath = '/customerportal/fingerprint/v1/ml-visualization-devices/';
    static readonly getProductFamiliesPath = '/customerportal/fingerprint/v1/list-ml-product-families/';

    constructor(
        config: __Configuration,
        http: HttpClient
    ) {
        super(config, http);
    }

    /**
     * @param params The `MlVisualizationService.GetProductFamiliesParams` containing the following parameters:
     *
     * - `customerId`: Unique identifier of a Cisco customer.
     *
     * @return successful operation
     */
    getProductFamiliesResponse(params: MlVisualizationService.GetProductFamiliesParams): __Observable<__StrictHttpResponse<ProductFamiliesList>> {
        let __params = this.newParams();
        let __headers = new HttpHeaders();
        let __body: any = null;
        let req = new HttpRequest<any>(
            'GET',
            this.rootUrl + MlVisualizationService.getProductFamiliesPath + params.customerId,
            __body,
            {
                headers: __headers,
                params: __params,
                responseType: 'json',
            });

        return this.http.request<any>(req).pipe(
            __filter(_r => _r instanceof HttpResponse),
            __map((_r) => {
                return _r as __StrictHttpResponse<ProductFamiliesList>;
            })
        );
    }

    /**
   * @param params The `MlVisualizationService.GetProductFamiliesParams` containing the following parameters:
   *
   * - `remoteNodeId`: The transaction id of the request
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
    getProductFamilies(params:MlVisualizationService.GetProductFamiliesParams): __Observable<ProductFamiliesList> {
        return this.getProductFamiliesResponse(params).pipe(
            __map(_r => _r.body as ProductFamiliesList)
        );
    }

    /**
     * @param paramss The `MlVisualizationService.GetMlVisualizationDevicesParams`
     *
     * - `customerId`: Unique identifier of a Cisco customer.
     *
     * - `productId`: The producct ID of the product family
     *
     * @return successful operation
     */
    getMlVisualizationDevices(params:MlVisualizationService.GetMlVisualizationDevicesParams): __Observable<MlVisualizationDevices> {
        return this.getMlVisualizationDevicesResponse(params).pipe(
            __map(_r => _r.body as MlVisualizationDevices)
        );
    }

        /**
     * @param paramss The `MlVisualizationService.GetMlVisualizationDevicesParams`
     *
     * - `customerId`: Unique identifier of a Cisco customer.
     *
     * - `productId`: The producct ID of the product family
     *
     * @return successful operation
     */
    getMlVisualizationDevicesResponse(params:MlVisualizationService.GetMlVisualizationDevicesParams): __Observable<__StrictHttpResponse<MlVisualizationDevices>> {
        let __params = this.newParams();
        let __headers = new HttpHeaders();
		let __body: any = null;
        let req = new HttpRequest<any>(
            'GET',
            this.rootUrl + MlVisualizationService.getMlVisualizationDevicesPath +`${params.customerId}/${params.productId}`,
            __body,
            {
                headers: __headers,
                params: __params,
                responseType: 'json',
            });

        return this.http.request<any>(req).pipe(
            __filter(_r => _r instanceof HttpResponse),
            __map((_r) => {
                return _r as __StrictHttpResponse<MlVisualizationDevices>;
            })
        );
    }
}

module MlVisualizationService {

    /**
     * Parameters for getProductFamilies
     */
    export interface GetProductFamiliesParams {
        /**
         * Unique identifier of a Cisco customer.
         */
        customerId: string;
    }

    /**
     * Parameters for Scatter plot getMlVisualizationDevices
     */
    export interface GetMlVisualizationDevicesParams {
        customerId: string;
        productId: string;
    }

}

export { MlVisualizationService }
