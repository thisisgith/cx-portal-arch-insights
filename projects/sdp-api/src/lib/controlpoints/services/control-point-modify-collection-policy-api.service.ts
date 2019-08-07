/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CollectionPolicyResponseModel } from '../models/collection-policy-response-model';
import { CollectionPolicyUpdateRequestModel } from '../models/collection-policy-update-request-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointModifyCollectionPolicyAPIService extends __BaseService {
  static readonly updateCollectionPolicyUsingPATCHPath = '/collectionPolicy';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param collectionPolicyUpdateRequestModel collectionPolicyUpdateRequestModel
   * @return OK
   */
  updateCollectionPolicyUsingPATCHResponse(collectionPolicyUpdateRequestModel: CollectionPolicyUpdateRequestModel): __Observable<__StrictHttpResponse<CollectionPolicyResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = collectionPolicyUpdateRequestModel;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/controlpoint/v1/collectionPolicy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CollectionPolicyResponseModel>;
      })
    );
  }

  /**
   * @param collectionPolicyUpdateRequestModel collectionPolicyUpdateRequestModel
   * @return OK
   */
  updateCollectionPolicyUsingPATCH(collectionPolicyUpdateRequestModel: CollectionPolicyUpdateRequestModel): __Observable<CollectionPolicyResponseModel> {
    return this.updateCollectionPolicyUsingPATCHResponse(collectionPolicyUpdateRequestModel).pipe(
      __map(_r => _r.body as CollectionPolicyResponseModel)
    );
  }
}

module ControlPointModifyCollectionPolicyAPIService {
}

export { ControlPointModifyCollectionPolicyAPIService }
