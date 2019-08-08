/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { RacetrackContentConfiguration as __Configuration } from '../racetrack-content-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ATXResponse } from '../models/atxresponse';
import { ACCResponse } from '../models/accresponse';
import { ACCBookmarkSchema } from '../models/accbookmark-schema';
import { ACCRequestSessionSchema } from '../models/accrequest-session-schema';
import { ACCUserInfoSchema } from '../models/accuser-info-schema';
import { SuccessPathsResponse } from '../models/success-paths-response';
import { CommunitiesResponse } from '../models/communities-response';
import { ELearningResponse } from '../models/elearning-response';
import { GroupTrainingEntitySchema } from '../models/group-training-entity-schema';
import { GroupTrainingRequestSchema } from '../models/group-training-request-schema';
import { ContractQuota } from '../models/contract-quota';
import { UserTraining } from '../models/user-training';
import { BookmarkResponseSchema } from '../models/bookmark-response-schema';
import { BookmarkRequestSchema } from '../models/bookmark-request-schema';
@Injectable({
  providedIn: 'root',
})
class RacetrackContentService extends __BaseService {
  static readonly getRacetrackATXPath = '/atx';
  static readonly getRacetrackACCPath = '/acc';
  static readonly updateACCBookmarkPath = '/acc/{accId}/bookmark';
  static readonly requestACCPath = '/acc/{accId}/request';
  static readonly getACCUserInfoPath = '/acc/request/user-info';
  static readonly getRacetrackSuccessPathsPath = '/successPaths';
  static readonly getRacetrackCommunitiesPath = '/communities';
  static readonly getRacetrackElearningPath = '/elearning';
  static readonly requestGroupTrainingPath = '/grouptraining/request';
  static readonly getTrainingQuotasPath = '/grouptraining/customer/quotas';
  static readonly getCompletedTrainingsPath = '/grouptraining/customer/trainings/completed';
  static readonly updateBookmarkPath = '/bookmarks';

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
      this.rootUrl + `/racetrack/v1/atx`,
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
      this.rootUrl + `/racetrack/v1/acc`,
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

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.bookmark;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/racetrack/v1/acc/${params.accId}/bookmark`,
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
   * Request to schedule a one to one session with Cisco.
   * @param params The `RacetrackContentService.RequestACCParams` containing the following parameters:
   *
   * - `request`: Payload to submit a 1:1 request with Cisco
   *
   * - `accId`: Unique identifier of the accelerator for which 1:1 is requested.
   */
  requestACCResponse(params: RacetrackContentService.RequestACCParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.request;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/racetrack/v1/acc/${params.accId}/request`,
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
   * Request to schedule a one to one session with Cisco.
   * @param params The `RacetrackContentService.RequestACCParams` containing the following parameters:
   *
   * - `request`: Payload to submit a 1:1 request with Cisco
   *
   * - `accId`: Unique identifier of the accelerator for which 1:1 is requested.
   */
  requestACC(params: RacetrackContentService.RequestACCParams): __Observable<null> {
    return this.requestACCResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Get user information to pre-fill the request 1:1 form
   * @return successful operation
   */
  getACCUserInfoResponse(): __Observable<__StrictHttpResponse<ACCUserInfoSchema>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/racetrack/v1/acc/request/user-info`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ACCUserInfoSchema>;
      })
    );
  }

  /**
   * Get user information to pre-fill the request 1:1 form
   * @return successful operation
   */
  getACCUserInfo(): __Observable<ACCUserInfoSchema> {
    return this.getACCUserInfoResponse().pipe(
      __map(_r => _r.body as ACCUserInfoSchema)
    );
  }

  /**
   * Provides product documentation ,videos,tutorial, pdf
   * @param params The `RacetrackContentService.GetRacetrackSuccessPathsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: solution value ( ibn )
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
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

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/racetrack/v1/successPaths`,
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
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `usecase`: Usecase value ( assurance | sd-access | automation )
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: solution value ( ibn )
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
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
      this.rootUrl + `/racetrack/v1/communities`,
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
      this.rootUrl + `/racetrack/v1/elearning`,
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

  /**
   * @param params The `RacetrackContentService.RequestGroupTrainingParams` containing the following parameters:
   *
   * - `gtRequest`: JSON Body for the Group Training Request
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully retrieved results
   */
  requestGroupTrainingResponse(params: RacetrackContentService.RequestGroupTrainingParams): __Observable<__StrictHttpResponse<GroupTrainingEntitySchema>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.gtRequest;
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/racetrack/v1/grouptraining/request`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<GroupTrainingEntitySchema>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.RequestGroupTrainingParams` containing the following parameters:
   *
   * - `gtRequest`: JSON Body for the Group Training Request
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully retrieved results
   */
  requestGroupTraining(params: RacetrackContentService.RequestGroupTrainingParams): __Observable<GroupTrainingEntitySchema> {
    return this.requestGroupTrainingResponse(params).pipe(
      __map(_r => _r.body as GroupTrainingEntitySchema)
    );
  }

  /**
   * @param params The `RacetrackContentService.GetTrainingQuotasParams` containing the following parameters:
   *
   * - `customerId`: Customer Id
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully retrieved results
   */
  getTrainingQuotasResponse(params: RacetrackContentService.GetTrainingQuotasParams): __Observable<__StrictHttpResponse<Array<ContractQuota>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/racetrack/v1/grouptraining/customer/quotas`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ContractQuota>>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.GetTrainingQuotasParams` containing the following parameters:
   *
   * - `customerId`: Customer Id
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully retrieved results
   */
  getTrainingQuotas(params: RacetrackContentService.GetTrainingQuotasParams): __Observable<Array<ContractQuota>> {
    return this.getTrainingQuotasResponse(params).pipe(
      __map(_r => _r.body as Array<ContractQuota>)
    );
  }

  /**
   * @param params The `RacetrackContentService.GetCompletedTrainingsParams` containing the following parameters:
   *
   * - `customerId`: Customer Id
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully retrieved results
   */
  getCompletedTrainingsResponse(params: RacetrackContentService.GetCompletedTrainingsParams): __Observable<__StrictHttpResponse<Array<UserTraining>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/racetrack/v1/grouptraining/customer/trainings/completed`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UserTraining>>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.GetCompletedTrainingsParams` containing the following parameters:
   *
   * - `customerId`: Customer Id
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully retrieved results
   */
  getCompletedTrainings(params: RacetrackContentService.GetCompletedTrainingsParams): __Observable<Array<UserTraining>> {
    return this.getCompletedTrainingsResponse(params).pipe(
      __map(_r => _r.body as Array<UserTraining>)
    );
  }

  /**
   * @param params The `RacetrackContentService.UpdateBookmarkParams` containing the following parameters:
   *
   * - `bookmarkRequestSchema`: JSON Body to Bookmark
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully updated
   */
  updateBookmarkResponse(params: RacetrackContentService.UpdateBookmarkParams): __Observable<__StrictHttpResponse<BookmarkResponseSchema>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.bookmarkRequestSchema;
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/racetrack/v1/bookmarks`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BookmarkResponseSchema>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.UpdateBookmarkParams` containing the following parameters:
   *
   * - `bookmarkRequestSchema`: JSON Body to Bookmark
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully updated
   */
  updateBookmark(params: RacetrackContentService.UpdateBookmarkParams): __Observable<BookmarkResponseSchema> {
    return this.updateBookmarkResponse(params).pipe(
      __map(_r => _r.body as BookmarkResponseSchema)
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
   * Parameters for requestACC
   */
  export interface RequestACCParams {

    /**
     * Payload to submit a 1:1 request with Cisco
     */
    request: ACCRequestSessionSchema;

    /**
     * Unique identifier of the accelerator for which 1:1 is requested.
     */
    accId: string;
  }

  /**
   * Parameters for getRacetrackSuccessPaths
   */
  export interface GetRacetrackSuccessPathsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Usecase value ( assurance | sd-access | automation )
     */
    usecase?: string;

    /**
     * suggestedAction for every Pitstop
     */
    suggestedAction?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * solution value ( ibn )
     */
    solution?: string;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop?: string;

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

  /**
   * Parameters for requestGroupTraining
   */
  export interface RequestGroupTrainingParams {

    /**
     * JSON Body for the Group Training Request
     */
    gtRequest: GroupTrainingRequestSchema;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }

  /**
   * Parameters for getTrainingQuotas
   */
  export interface GetTrainingQuotasParams {

    /**
     * Customer Id
     */
    customerId?: string;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }

  /**
   * Parameters for getCompletedTrainings
   */
  export interface GetCompletedTrainingsParams {

    /**
     * Customer Id
     */
    customerId?: string;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }

  /**
   * Parameters for updateBookmark
   */
  export interface UpdateBookmarkParams {

    /**
     * JSON Body to Bookmark
     */
    bookmarkRequestSchema: BookmarkRequestSchema;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }
}

export { RacetrackContentService }
