/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { UserConfiguration as __Configuration } from '../user-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable, of } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { UserResponse } from '../models/user-response';
@Injectable({
  providedIn: 'root',
})
class UserService extends __BaseService {
  static readonly getUserPath = '/system/users';
	private userResponse: UserResponse;

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Returns information for this user (identified by ccoId). This incldues the user's role and party affiliation
   * @return successful operation
   */
  getUserResponse(): __Observable<__StrictHttpResponse<UserResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/party/v1/system/users`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserResponse>;
      })
    );
  }

  /**
   * Returns information for this user (identified by ccoId). This incldues the user's role and party affiliation
   * @return successful operation
   */
  getUser(): __Observable<UserResponse> {
    if (!this.userResponse){
      return this.getUserResponse().pipe(
        __map(_r => _r.body as UserResponse)
      );
    } else {
      return of(this.userResponse);
    }
  }
}

module UserService {
}

export { UserService }
