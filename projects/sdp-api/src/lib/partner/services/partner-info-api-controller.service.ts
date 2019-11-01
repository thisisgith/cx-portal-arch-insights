/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';


/**
 * REST APIs to fetch Partner Info!!!!
 */
@Injectable({
  providedIn: 'root',
})
class PartnerInfoApiControllerService extends __BaseService {
  static readonly aliveUsingGETPath = '/alive';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @return OK
   */
  aliveUsingGETResponse(): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/alive`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }

  /**
   * @return OK
   */
  aliveUsingGET(): __Observable<string> {
    return this.aliveUsingGETResponse().pipe(
      __map(_r => _r.body as string)
    );
  }
}

module PartnerInfoApiControllerService {
}

export { PartnerInfoApiControllerService }
