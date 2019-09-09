/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { InsightsCrashesConfiguration as __Configuration } from '../insights-crashes-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { InsightsResponse } from '@sdp-api';

@Injectable({
  providedIn: 'root',
})
class InsightsCrashesService extends __BaseService {

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  
    /**
   * The Vulnerabilities count API retrieves counts for product vulnerabilities. This includes counts for security advisories, field notices, and bugs.
   * @return successful operation
   */
  getInsightsCountsResponse(): __Observable<__StrictHttpResponse<InsightsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/insightsCounts/v1/allCounts/customer/7293498/timePeriod/0`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InsightsResponse>;
      })
    );
  }


  /**
   * The Vulnerabilities count API retrieves counts for product vulnerabilities. This includes counts for security advisories, field notices, and bugs.
   *
   * @return successful operation
   */
  getInsightsCounts(): __Observable<InsightsResponse> {
    return this.getInsightsCountsResponse().pipe(
      __map(_r => _r.body as InsightsResponse)
    );
  }
}

export { InsightsCrashesService }
