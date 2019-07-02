/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { RacetrackContentConfiguration as __Configuration } from '../racetrack-content-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ATXResponse } from '../models/atxresponse';
import { ACCResponse } from '../models/accresponse';
import { ACCBookmarkSchema } from '../models/accbookmark-schema';
import { SuccessPathsResponse } from '../models/success-paths-response';
import { CommunitiesResponse } from '../models/communities-response';
import { ELearningResponse } from '../models/elearning-response';
@Injectable({
  providedIn: 'root',
})
class RacetrackContentService extends __BaseService {
  static readonly getRacetrackATXPath = '/api/customerportal/racetrack/v1/atx';
  static readonly getRacetrackACCPath = '/api/customerportal/racetrack/v1/acc';
  static readonly updateACCBookmarkPath = '/api/customerportal/racetrack/v1/acc/{accId}/bookmark';
  static readonly getRacetrackSuccessPathsPath = '/api/customerportal/racetrack/v1/successPaths';
  static readonly getRacetrackCommunitiesPath = '/api/customerportal/racetrack/v1/communities';
  static readonly getRacetrackElearningPath = '/api/customerportal/racetrack/v1/elearning';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Provides details of Future Webinars which the user can register for. Also, it provides the on-demand for the sessions held in the past
   * @param params The `RacetrackContentService.GetRacetrackATXParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackATXResponse(params: RacetrackContentService.GetRacetrackATXParams): __Observable<__StrictHttpResponse<ATXResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/racetrack/v1/atx`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ATXResponse>;
      })
    );
  }

  /**
   * Provides details of Future Webinars which the user can register for. Also, it provides the on-demand for the sessions held in the past
   * @param params The `RacetrackContentService.GetRacetrackATXParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackATX(params: RacetrackContentService.GetRacetrackATXParams): __Observable<ATXResponse> {
    return this.getRacetrackATXResponse(params).pipe(
      __map(_r => _r.body as ATXResponse)
    );
  }

  /**
   * Provides list of Accelerators for given Pitstop and Use Case
   * @param params The `RacetrackContentService.GetRacetrackACCParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackACCResponse(params: RacetrackContentService.GetRacetrackACCParams): __Observable<__StrictHttpResponse<ACCResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/racetrack/v1/acc`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ACCResponse>;
      })
    );
  }

  /**
   * Provides list of Accelerators for given Pitstop and Use Case
   * @param params The `RacetrackContentService.GetRacetrackACCParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackACC(params: RacetrackContentService.GetRacetrackACCParams): __Observable<ACCResponse> {
    return this.getRacetrackACCResponse(params).pipe(
      __map(_r => _r.body as ACCResponse)
    );
  }

  /**
   * Ability to add or remove bookmark for an accelerator.
   * @param params The `RacetrackContentService.UpdateACCBookmarkParams` containing the following parameters:
   *
   * - `bookmark`: Payload to take action on the bookmark for an accelerator
   *
   * - `accId`: Unique identifier of the accelerator that was marked or removed favorite
   */
  updateACCBookmarkResponse(params: RacetrackContentService.UpdateACCBookmarkParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append("Content-Type", "application/json");
    __body = params.bookmark;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/racetrack/v1/acc/${params.accId}/bookmark`,
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
   * Ability to add or remove bookmark for an accelerator.
   * @param params The `RacetrackContentService.UpdateACCBookmarkParams` containing the following parameters:
   *
   * - `bookmark`: Payload to take action on the bookmark for an accelerator
   *
   * - `accId`: Unique identifier of the accelerator that was marked or removed favorite
   */
  updateACCBookmark(params: RacetrackContentService.UpdateACCBookmarkParams): __Observable<null> {
    return this.updateACCBookmarkResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Provides product documentation ,videos,tutorial, pdf
   * @param params The `RacetrackContentService.GetRacetrackSuccessPathsParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackSuccessPathsResponse(params: RacetrackContentService.GetRacetrackSuccessPathsParams): __Observable<__StrictHttpResponse<SuccessPathsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/racetrack/v1/successPaths`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SuccessPathsResponse>;
      })
    );
  }

  /**
   * Provides product documentation ,videos,tutorial, pdf
   * @param params The `RacetrackContentService.GetRacetrackSuccessPathsParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackSuccessPaths(params: RacetrackContentService.GetRacetrackSuccessPathsParams): __Observable<SuccessPathsResponse> {
    return this.getRacetrackSuccessPathsResponse(params).pipe(
      __map(_r => _r.body as SuccessPathsResponse)
    );
  }

  /**
   * Provides list of communities based on contexual Pitstop and Use Case
   * @param params The `RacetrackContentService.GetRacetrackCommunitiesParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackCommunitiesResponse(params: RacetrackContentService.GetRacetrackCommunitiesParams): __Observable<__StrictHttpResponse<CommunitiesResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/racetrack/v1/communities`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommunitiesResponse>;
      })
    );
  }

  /**
   * Provides list of communities based on contexual Pitstop and Use Case
   * @param params The `RacetrackContentService.GetRacetrackCommunitiesParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackCommunities(params: RacetrackContentService.GetRacetrackCommunitiesParams): __Observable<CommunitiesResponse> {
    return this.getRacetrackCommunitiesResponse(params).pipe(
      __map(_r => _r.body as CommunitiesResponse)
    );
  }

  /**
   * Provides eLearning content ( Certifications ,Courses, Training material etc)
   * @param params The `RacetrackContentService.GetRacetrackElearningParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackElearningResponse(params: RacetrackContentService.GetRacetrackElearningParams): __Observable<__StrictHttpResponse<ELearningResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/racetrack/v1/elearning`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ELearningResponse>;
      })
    );
  }

  /**
   * Provides eLearning content ( Certifications ,Courses, Training material etc)
   * @param params The `RacetrackContentService.GetRacetrackElearningParams` containing the following parameters:
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getRacetrackElearning(params: RacetrackContentService.GetRacetrackElearningParams): __Observable<ELearningResponse> {
    return this.getRacetrackElearningResponse(params).pipe(
      __map(_r => _r.body as ELearningResponse)
    );
  }
}

module RacetrackContentService {

  /**
   * Parameters for getRacetrackATX
   */
  export interface GetRacetrackATXParams {

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase: string;

    /**
     * solution value ( ibn )
     */
    solution: string;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * suggestedAction for every Pitstop
     */
    suggestedAction?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for getRacetrackACC
   */
  export interface GetRacetrackACCParams {

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase: string;

    /**
     * solution value ( ibn )
     */
    solution: string;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * suggestedAction for every Pitstop
     */
    suggestedAction?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for updateACCBookmark
   */
  export interface UpdateACCBookmarkParams {

    /**
     * Payload to take action on the bookmark for an accelerator
     */
    bookmark: ACCBookmarkSchema;

    /**
     * Unique identifier of the accelerator that was marked or removed favorite
     */
    accId: string;
  }

  /**
   * Parameters for getRacetrackSuccessPaths
   */
  export interface GetRacetrackSuccessPathsParams {

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase: string;

    /**
     * solution value ( ibn )
     */
    solution: string;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * suggestedAction for every Pitstop
     */
    suggestedAction?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for getRacetrackCommunities
   */
  export interface GetRacetrackCommunitiesParams {

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase: string;

    /**
     * solution value ( ibn )
     */
    solution: string;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * suggestedAction for every Pitstop
     */
    suggestedAction?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for getRacetrackElearning
   */
  export interface GetRacetrackElearningParams {

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase: string;

    /**
     * solution value ( ibn )
     */
    solution: string;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * suggestedAction for every Pitstop
     */
    suggestedAction?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;
  }
}

export { RacetrackContentService }
