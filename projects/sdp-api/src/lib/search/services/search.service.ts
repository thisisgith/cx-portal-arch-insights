/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { SearchConfiguration as __Configuration } from '../search-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CDCSearchResponse } from '../models/cdcsearch-response';
import { CommunitySearchResponse } from '../models/community-search-response';
import { GlobalSearchResponse } from '../models/global-search-response';

/**
 * Search operations for Customer Portal
 */
@Injectable({
  providedIn: 'root',
})
class SearchService extends __BaseService {
  static readonly directCDCSearchPath = '/api/customerportal/search/v1/cdcSearch';
  static readonly directCommunitySearchPath = '/api/customerportal/search/v1/communitySearch';
  static readonly allSearchPath = '/api/customerportal/search/v1/globalSearch';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `SearchService.DirectCDCSearchParams` containing the following parameters:
   *
   * - `searchTokens`: Tokens for search
   *
   * - `webSessionId`: Web Session Id
   *
   * - `offset`: Pagination: offset
   *
   * - `limit`: Pagination: number of expected results
   *
   * - `filters`: Filter CDC results
   *
   * - `context`: Hint to do a special lookup before search
   *
   * @return Successfully retrieved results
   */
  directCDCSearchResponse(params: SearchService.DirectCDCSearchParams): __Observable<__StrictHttpResponse<CDCSearchResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let __formData = new HttpParams();
   if(params.searchTokens !== null && typeof params.searchTokens !== "undefined") { __formData = __formData.append('searchTokens', params.searchTokens as string);}
   if(params.webSessionId !== null && typeof params.webSessionId !== "undefined") { __formData = __formData.append('webSessionId', params.webSessionId as string);}
   if(params.offset !== null && typeof params.offset !== "undefined") { __formData = __formData.append('offset', params.offset as string);}
   if(params.limit !== null && typeof params.limit !== "undefined") { __formData = __formData.append('limit', params.limit as string);}
   if(params.filters !== null && typeof params.filters !== "undefined") { __formData = __formData.append('filters', params.filters.replace(/\\/g, '') as string);}
   if(params.context !== null && typeof params.context !== "undefined") { __formData = __formData.append('context', params.context as string);}
   if(params.customerId !== null && typeof params.customerId !== "undefined") { __formData = __formData.append('customerId', params.customerId as string);}
   __body = __formData;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/search/v1/cdcSearch`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CDCSearchResponse>;
      })
    );
  }
  /**
   * @param params The `SearchService.DirectCDCSearchParams` containing the following parameters:
   *
   * - `searchTokens`: Tokens for search
   *
   * - `webSessionId`: Web Session Id
   *
   * - `offset`: Pagination: offset
   *
   * - `limit`: Pagination: number of expected results
   *
   * - `filters`: Filter CDC results
   *
   * - `context`: Hint to do a special lookup before search
   *
   * @return Successfully retrieved results
   */
  directCDCSearch(params: SearchService.DirectCDCSearchParams): __Observable<CDCSearchResponse> {
    return this.directCDCSearchResponse(params).pipe(
      __map(_r => _r.body as CDCSearchResponse)
    );
  }

  /**
   * @param params The `SearchService.DirectCommunitySearchParams` containing the following parameters:
   *
   * - `searchTokens`: Tokens for search
   *
   * - `webSessionId`: Web Session Id
   *
   * - `offset`: Pagination offset
   *
   * - `limit`: Pagination - number of expected results
   *
   * - `filters`: Filter Community results
   *
   * @return Successfully retrieved results
   */
  directCommunitySearchResponse(params: SearchService.DirectCommunitySearchParams): __Observable<__StrictHttpResponse<CommunitySearchResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let __formData = new HttpParams();
   if(params.searchTokens !== null && typeof params.searchTokens !== "undefined") { __formData = __formData.append('searchTokens', params.searchTokens as string);}
   if(params.webSessionId !== null && typeof params.webSessionId !== "undefined") { __formData = __formData.append('webSessionId', params.webSessionId as string);}
   if(params.offset !== null && typeof params.offset !== "undefined") { __formData = __formData.append('offset', params.offset as string);}
   if(params.limit !== null && typeof params.limit !== "undefined") { __formData = __formData.append('limit', params.limit as string);}
   if(params.filters !== null && typeof params.filters !== "undefined") { __formData = __formData.append('filters', params.filters.replace(/\\/g, '') as string);}
   __body = __formData;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/search/v1/communitySearch`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommunitySearchResponse>;
      })
    );
  }
  /**
   * @param params The `SearchService.DirectCommunitySearchParams` containing the following parameters:
   *
   * - `searchTokens`: Tokens for search
   *
   * - `webSessionId`: Web Session Id
   *
   * - `offset`: Pagination offset
   *
   * - `limit`: Pagination - number of expected results
   *
   * - `filters`: Filter Community results
   *
   * @return Successfully retrieved results
   */
  directCommunitySearch(params: SearchService.DirectCommunitySearchParams): __Observable<CommunitySearchResponse> {
    return this.directCommunitySearchResponse(params).pipe(
      __map(_r => _r.body as CommunitySearchResponse)
    );
  }

  /**
   * @param params The `SearchService.AllSearchParams` containing the following parameters:
   *
   * - `searchTokens`: Tokens for search
   *
   * - `webSessionId`: Web Session Id
   *
   * - `useCase`: Use Case
   *
   * - `solution`: Solution
   *
   * - `pitStop`: Pit Stop
   *
   * - `offset`: CDC Pagination: offset
   *
   * - `limit`: CDC Pagination: number of expected results
   *
   * - `filters`: Filter CDC results
   *
   * - `context`: Hint to do a special lookup before search
   *
   * @return Successfully retrieved results
   */
  allSearchResponse(params: SearchService.AllSearchParams): __Observable<__StrictHttpResponse<GlobalSearchResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let __formData = new HttpParams();
   if(params.searchTokens !== null && typeof params.searchTokens !== "undefined") { __formData = __formData.append('searchTokens', params.searchTokens as string);}
   if(params.webSessionId !== null && typeof params.webSessionId !== "undefined") { __formData = __formData.append('webSessionId', params.webSessionId as string);}
   if(params.useCase !== null && typeof params.useCase !== "undefined") { __formData = __formData.append('useCase', params.useCase as string);}
   if(params.solution !== null && typeof params.solution !== "undefined") { __formData = __formData.append('solution', params.solution as string);}
   if(params.pitStop !== null && typeof params.pitStop !== "undefined") { __formData = __formData.append('pitStop', params.pitStop as string);}
   if(params.offset !== null && typeof params.offset !== "undefined") { __formData = __formData.append('offset', params.offset as string);}
   if(params.limit !== null && typeof params.limit !== "undefined") { __formData = __formData.append('limit', params.limit as string);}
   if(params.filters !== null && typeof params.filters !== "undefined") { __formData = __formData.append('filters', params.filters.replace(/\\/g, '') as string);}
   if(params.context !== null && typeof params.context !== "undefined") { __formData = __formData.append('context', params.context as string);}
   if(params.customerId !== null && typeof params.customerId !== "undefined") { __formData = __formData.append('customerId', params.customerId as string);}
   __body = __formData;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/search/v1/globalSearch`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<GlobalSearchResponse>;
      })
    );
  }
  /**
   * @param params The `SearchService.AllSearchParams` containing the following parameters:
   *
   * - `searchTokens`: Tokens for search
   *
   * - `webSessionId`: Web Session Id
   *
   * - `useCase`: Use Case
   *
   * - `solution`: Solution
   *
   * - `pitStop`: Pit Stop
   *
   * - `offset`: CDC Pagination: offset
   *
   * - `limit`: CDC Pagination: number of expected results
   *
   * - `filters`: Filter CDC results
   *
   * - `context`: Hint to do a special lookup before search
   *
   * @return Successfully retrieved results
   */
  allSearch(params: SearchService.AllSearchParams): __Observable<GlobalSearchResponse> {
    return this.allSearchResponse(params).pipe(
      __map(_r => _r.body as GlobalSearchResponse)
    );
  }
}

module SearchService {

  /**
   * Parameters for directCDCSearch
   */
  export interface DirectCDCSearchParams {

    /**
     * Tokens for search
     */
    searchTokens: string;

    /**
     * Web Session Id
     */
    webSessionId?: string;

    /**
     * Pagination: offset
     */
    offset?: string;

    /**
     * Pagination: number of expected results
     */
    limit?: string;

    /**
     * Filter CDC results
     */
    filters?: string;

    /**
     * Hint to do a special lookup before search
     */
    context?: string;

    /**
     * Unique identifier of a Cisco customer
     */
    customerId?: string;
  }

  /**
   * Parameters for directCommunitySearch
   */
  export interface DirectCommunitySearchParams {

    /**
     * Tokens for search
     */
    searchTokens: string;

    /**
     * Web Session Id
     */
    webSessionId?: string;

    /**
     * Pagination offset
     */
    offset?: string;

    /**
     * Pagination - number of expected results
     */
    limit?: string;

    /**
     * Filter Community results
     */
    filters?: string;
  }

  /**
   * Parameters for allSearch
   */
  export interface AllSearchParams {

    /**
     * Tokens for search
     */
    searchTokens: string;

    /**
     * Web Session Id
     */
    webSessionId?: string;

    /**
     * Use Case
     */
    useCase?: string;

    /**
     * Solution
     */
    solution?: string;

    /**
     * Pit Stop
     */
    pitStop?: string;

    /**
     * CDC Pagination: offset
     */
    offset?: string;

    /**
     * CDC Pagination: number of expected results
     */
    limit?: string;

    /**
     * Filter CDC results
     */
    filters?: string;

    /**
     * Hint to do a special lookup before search
     */
    context?: string;

    /**
     * Unique identifier of a Cisco customer
     */
    customerId?: string;
  }
}

export { SearchService }
