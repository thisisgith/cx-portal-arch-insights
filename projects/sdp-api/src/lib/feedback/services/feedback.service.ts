/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { FeedbackConfiguration as __Configuration } from '../feedback-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { FeedbackRequest } from '../models/feedback-request';
@Injectable({
  providedIn: 'root',
})
class FeedbackService extends __BaseService {
  static readonly postAdvisoryFeedbackPath = '/device/submit';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param feedbackRequest Post the feedback of each action
   * @return successful operation
   */
  postAdvisoryFeedbackResponse(feedbackRequest: FeedbackRequest): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = feedbackRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/customerportal/ndgw-feedback/v1/device/submit`,
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
   * @param feedbackRequest Post the feedback of each action
   * @return successful operation
   */
  postAdvisoryFeedback(feedbackRequest: FeedbackRequest): __Observable<string> {
    return this.postAdvisoryFeedbackResponse(feedbackRequest).pipe(
      __map(_r => _r.body as string)
    );
  }
}

module FeedbackService {
}

export { FeedbackService }
