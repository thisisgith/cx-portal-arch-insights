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
   */
  postAdvisoryFeedbackResponse(feedbackRequest: FeedbackRequest): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = feedbackRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/feedback/v1/device/submit`,
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
   * @param feedbackRequest Post the feedback of each action
   */
  postAdvisoryFeedback(feedbackRequest: FeedbackRequest): __Observable<null> {
    return this.postAdvisoryFeedbackResponse(feedbackRequest).pipe(
      __map(_r => _r.body as null)
    );
  }
}

module FeedbackService {
}

export { FeedbackService }
