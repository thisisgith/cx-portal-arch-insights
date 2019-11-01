/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { RacetrackContentConfiguration as __Configuration } from '../racetrack-content-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ATXResponseModel } from '../models/atxresponse-model';
import { AtxUserRegistrationsSchema } from '../models/atx-user-registrations-schema';
import { ACCResponse } from '../models/accresponse';
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
import { UserFeedbackEntitySchema } from '../models/user-feedback-entity-schema';
import { UserFeedbackRequestSchema } from '../models/user-feedback-request-schema';
@Injectable({
  providedIn: 'root',
})
class RacetrackContentService extends __BaseService {
  static readonly getRacetrackATXPath = '/atx';
  static readonly registerUserToAtxPath = '/atx/registration';
  static readonly cancelSessionATXPath = '/atx/registration';
  static readonly getRacetrackACCPath = '/acc';
  static readonly requestACCPath = '/acc/{accId}/request';
  static readonly getACCUserInfoPath = '/acc/request/user-info';
  static readonly getRacetrackSuccessPathsPath = '/successPaths';
  static readonly getRacetrackCommunitiesPath = '/communities';
  static readonly getRacetrackElearningPath = '/elearning';
  static readonly requestGroupTrainingPath = '/grouptraining/request';
  static readonly getTrainingQuotasPath = '/grouptraining/customer/quotas';
  static readonly getCompletedTrainingsPath = '/grouptraining/customer/trainings/completed';
  static readonly updateBookmarkPath = '/bookmarks';
  static readonly saveFeedbackPath = '/feedback/cxportal';
  static readonly updateFeedbackPath = '/feedback/cxportal/{feedbackId}';

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
   * - `usecase`: Usecase value
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `status`: Comma separated values of status to filter ATXs.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `providerId`: Comma separated values of provider/partner Ids to filter ATXs.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return successful operation
   */
  getRacetrackATXResponse(params: RacetrackContentService.GetRacetrackATXParams): __Observable<__StrictHttpResponse<ATXResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.usecase != null) __params = __params.set('usecase', params.usecase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.suggestedAction != null) __params = __params.set('suggestedAction', params.suggestedAction.toString());
    (params.status || []).forEach(val => {if (val != null) __params = __params.append('status', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.providerId || []).forEach(val => {if (val != null) __params = __params.append('providerId', val.toString())});
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/racetrack/v1/atx`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ATXResponseModel>;
      })
    );
  }

  /**
   * Provides details of Future Webinars which the user can register for. Also, it provides the on-demand for the sessions held in the past
   * @param params The `RacetrackContentService.GetRacetrackATXParams` containing the following parameters:
   *
   * - `usecase`: Usecase value
   *
   * - `solution`: solution value ( ibn )
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `suggestedAction`: suggestedAction for every Pitstop
   *
   * - `status`: Comma separated values of status to filter ATXs.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `providerId`: Comma separated values of provider/partner Ids to filter ATXs.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return successful operation
   */
  getRacetrackATX(params: RacetrackContentService.GetRacetrackATXParams): __Observable<ATXResponseModel> {
    return this.getRacetrackATXResponse(params).pipe(
      __map(_r => _r.body as ATXResponseModel)
    );
  }

  /**
   * @param params The `RacetrackContentService.RegisterUserToAtxParams` containing the following parameters:
   *
   * - `sessionId`: The SessionId of this Atx
   *
   * - `atxId`: The Atx Identifier
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully registered
   */
  registerUserToAtxResponse(params: RacetrackContentService.RegisterUserToAtxParams): __Observable<__StrictHttpResponse<AtxUserRegistrationsSchema>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    if (params.sessionId != null) __params = __params.set('sessionId', params.sessionId.toString());
    if (params.atxId != null) __params = __params.set('atxId', params.atxId.toString());
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/customerportal/racetrack/v1/atx/registration`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AtxUserRegistrationsSchema>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.RegisterUserToAtxParams` containing the following parameters:
   *
   * - `sessionId`: The SessionId of this Atx
   *
   * - `atxId`: The Atx Identifier
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully registered
   */
  registerUserToAtx(params: RacetrackContentService.RegisterUserToAtxParams): __Observable<AtxUserRegistrationsSchema> {
    return this.registerUserToAtxResponse(params).pipe(
      __map(_r => _r.body as AtxUserRegistrationsSchema)
    );
  }

  /**
   * @param params The `RacetrackContentService.CancelSessionATXParams` containing the following parameters:
   *
   * - `sessionId`: Id of the selected session to cancel
   *
   * - `atxId`: Id of the selected ATX
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   */
  cancelSessionATXResponse(params: RacetrackContentService.CancelSessionATXParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    if (params.sessionId != null) __params = __params.set('sessionId', params.sessionId.toString());
    if (params.atxId != null) __params = __params.set('atxId', params.atxId.toString());
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/customerportal/racetrack/v1/atx/registration`,
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
   * @param params The `RacetrackContentService.CancelSessionATXParams` containing the following parameters:
   *
   * - `sessionId`: Id of the selected session to cancel
   *
   * - `atxId`: Id of the selected ATX
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   */
  cancelSessionATX(params: RacetrackContentService.CancelSessionATXParams): __Observable<null> {
    return this.cancelSessionATXResponse(params).pipe(
      __map(_r => _r.body as null)
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
   * - `status`: Comma separated values of status to filter ACCs.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `providerId`: Comma separated values of provider/partner Ids to filter ACCs.
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
    (params.status || []).forEach(val => {if (val != null) __params = __params.append('status', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.providerId || []).forEach(val => {if (val != null) __params = __params.append('providerId', val.toString())});
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/racetrack/v1/acc`,
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
   * - `status`: Comma separated values of status to filter ACCs.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `providerId`: Comma separated values of provider/partner Ids to filter ACCs.
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
      this.rootUrl + `/customerportal/racetrack/v1/acc/${params.accId}/request`,
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
      this.rootUrl + `/customerportal/racetrack/v1/acc/request/user-info`,
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
   * - `sort[0].order`: Sort order/direction for the Field/Column name.
   *
   * - `sort[0].field`: Field/Column name for which sorting needs to be applied.
   *
   * - `solution`: solution value ( ibn )
   *
   * - `rows`: Number of rows of data per page. Default value is 10 and the maximum rows allowed per page is 100.
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `page`: Page number of the response. Default value is 1.
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
    if (params.sort0Order != null) __params = __params.set('sort[0].order', params.sort0Order.toString());
    if (params.sort0Field != null) __params = __params.set('sort[0].field', params.sort0Field.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.pitstop != null) __params = __params.set('pitstop', params.pitstop.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/racetrack/v1/successPaths`,
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
   * - `sort[0].order`: Sort order/direction for the Field/Column name.
   *
   * - `sort[0].field`: Field/Column name for which sorting needs to be applied.
   *
   * - `solution`: solution value ( ibn )
   *
   * - `rows`: Number of rows of data per page. Default value is 10 and the maximum rows allowed per page is 100.
   *
   * - `pitstop`: Pitstop value (onboard | implement | use | engage)
   *
   * - `page`: Page number of the response. Default value is 1.
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
      this.rootUrl + `/customerportal/racetrack/v1/communities`,
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
   * - `rows`: Number of rows of data per page. Default value is 10 and the maximum rows allowed per page is 100.
   *
   * - `page`: Page number of the response. Default value is 1.
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
      this.rootUrl + `/customerportal/racetrack/v1/elearning`,
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
   * - `rows`: Number of rows of data per page. Default value is 10 and the maximum rows allowed per page is 100.
   *
   * - `page`: Page number of the response. Default value is 1.
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
      this.rootUrl + `/customerportal/racetrack/v1/grouptraining/request`,
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
      this.rootUrl + `/customerportal/racetrack/v1/grouptraining/customer/quotas`,
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
      this.rootUrl + `/customerportal/racetrack/v1/grouptraining/customer/trainings/completed`,
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
      this.rootUrl + `/customerportal/racetrack/v1/bookmarks`,
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

  /**
   * @param params The `RacetrackContentService.SaveFeedbackParams` containing the following parameters:
   *
   * - `feedback`: The Feedback object
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully saved feedback
   */
  saveFeedbackResponse(params: RacetrackContentService.SaveFeedbackParams): __Observable<__StrictHttpResponse<UserFeedbackEntitySchema>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.feedback;
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/customerportal/racetrack/v1/feedback/cxportal`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserFeedbackEntitySchema>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.SaveFeedbackParams` containing the following parameters:
   *
   * - `feedback`: The Feedback object
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully saved feedback
   */
  saveFeedback(params: RacetrackContentService.SaveFeedbackParams): __Observable<UserFeedbackEntitySchema> {
    return this.saveFeedbackResponse(params).pipe(
      __map(_r => _r.body as UserFeedbackEntitySchema)
    );
  }

  /**
   * @param params The `RacetrackContentService.UpdateFeedbackParams` containing the following parameters:
   *
   * - `updatedFeedback`: the updated Feedback object
   *
   * - `feedbackId`: Unique identifier of the feedback entry
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully udpated feedback
   */
  updateFeedbackResponse(params: RacetrackContentService.UpdateFeedbackParams): __Observable<__StrictHttpResponse<UserFeedbackEntitySchema>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.updatedFeedback;

    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/customerportal/racetrack/v1/feedback/cxportal/${params.feedbackId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserFeedbackEntitySchema>;
      })
    );
  }

  /**
   * @param params The `RacetrackContentService.UpdateFeedbackParams` containing the following parameters:
   *
   * - `updatedFeedback`: the updated Feedback object
   *
   * - `feedbackId`: Unique identifier of the feedback entry
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully udpated feedback
   */
  updateFeedback(params: RacetrackContentService.UpdateFeedbackParams): __Observable<UserFeedbackEntitySchema> {
    return this.updateFeedbackResponse(params).pipe(
      __map(_r => _r.body as UserFeedbackEntitySchema)
    );
  }
}

module RacetrackContentService {

  /**
   * Parameters for getRacetrackATX
   */
  export interface GetRacetrackATXParams {

    /**
     * Usecase value
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
     * Comma separated values of status to filter ATXs.
     */
    status?: Array<'recommended' | 'requested' | 'scheduled' | 'in-progress' | 'completed'>;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Comma separated values of provider/partner Ids to filter ATXs.
     */
    providerId?: Array<string>;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }

  /**
   * Parameters for registerUserToAtx
   */
  export interface RegisterUserToAtxParams {

    /**
     * The SessionId of this Atx
     */
    sessionId: string;

    /**
     * The Atx Identifier
     */
    atxId: string;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }

  /**
   * Parameters for cancelSessionATX
   */
  export interface CancelSessionATXParams {

    /**
     * Id of the selected session to cancel
     */
    sessionId: string;

    /**
     * Id of the selected ATX
     */
    atxId: string;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
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
     * Comma separated values of status to filter ACCs.
     */
    status?: Array<'recommended' | 'requested' | 'scheduled' | 'in-progress' | 'completed'>;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Comma separated values of provider/partner Ids to filter ACCs.
     */
    providerId?: Array<string>;

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
     * Sort order/direction for the Field/Column name.
     */
    sort0Order?: 'asc' | 'desc';

    /**
     * Field/Column name for which sorting needs to be applied.
     */
    sort0Field?: string;

    /**
     * solution value ( ibn )
     */
    solution?: string;

    /**
     * Number of rows of data per page. Default value is 10 and the maximum rows allowed per page is 100.
     */
    rows?: number;

    /**
     * Pitstop value (onboard | implement | use | engage)
     */
    pitstop?: string;

    /**
     * Page number of the response. Default value is 1.
     */
    page?: number;
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
     * Number of rows of data per page. Default value is 10 and the maximum rows allowed per page is 100.
     */
    rows?: number;

    /**
     * Page number of the response. Default value is 1.
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

  /**
   * Parameters for saveFeedback
   */
  export interface SaveFeedbackParams {

    /**
     * The Feedback object
     */
    feedback: UserFeedbackRequestSchema;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }

  /**
   * Parameters for updateFeedback
   */
  export interface UpdateFeedbackParams {

    /**
     * the updated Feedback object
     */
    updatedFeedback: UserFeedbackRequestSchema;

    /**
     * Unique identifier of the feedback entry
     */
    feedbackId: string;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake?: string;
  }
}

export { RacetrackContentService }
