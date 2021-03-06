/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { RacetrackConfiguration as __Configuration } from '../racetrack-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { RacetrackResponse } from '../models/racetrack-response';
import { PitstopActionUpdateRequestObject } from '../models/pitstop-action-update-request-object';
@Injectable({
  providedIn: 'root',
})
class RacetrackService extends __BaseService {
  static readonly getRacetrackPath = '/info';
  static readonly updatePitstopActionPath = '/action/status';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Racetrack information for a customer solution, use-case, pitstop, exit crtieria completion status
   * @param params The `RacetrackService.GetRacetrackParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage | adopt | optimize)
   *
   * - `page`: Page number of the response
   *
   * @return successful operation
   */
  getRacetrackResponse(params: RacetrackService.GetRacetrackParams): __Observable<__StrictHttpResponse<RacetrackResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/pitstop/v1/info`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<RacetrackResponse>;
      })
    );
  }

  /**
   * Racetrack information for a customer solution, use-case, pitstop, exit crtieria completion status
   * @param params The `RacetrackService.GetRacetrackParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage | adopt | optimize)
   *
   * - `page`: Page number of the response
   *
   * @return successful operation
   */
  getRacetrack(params: RacetrackService.GetRacetrackParams): __Observable<RacetrackResponse> {
    return this.getRacetrackResponse(params).pipe(
      __map(_r => _r.body as RacetrackResponse)
    );
  }

  /**
   * API to writeback the racetrack data
   * @param actionUpdate The action update set by the user
   */
  updatePitstopActionResponse(actionUpdate?: PitstopActionUpdateRequestObject): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = actionUpdate;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/customerportal/pitstop/v1/action/status`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }

  /**
   * API to writeback the racetrack data
   * @param actionUpdate The action update set by the user
   */
  updatePitstopAction(actionUpdate?: PitstopActionUpdateRequestObject): __Observable<null> {
    return this.updatePitstopActionResponse(actionUpdate).pipe(
      __map(_r => _r.body as null)
    );
  }
}

module RacetrackService {

  /**
   * Parameters for getRacetrack
   */
  export interface GetRacetrackParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase?: string;

    /**
     * solution value ( ibn )
     */
    solution?: string;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Pitstop value (onboard | implement | use | engage | adopt | optimize)
     */
    pitstop?: string;

    /**
     * Page number of the response
     */
    page?: number;
  }
}

export { RacetrackService }
