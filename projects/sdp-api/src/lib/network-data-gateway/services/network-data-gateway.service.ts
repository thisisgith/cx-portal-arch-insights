/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { NetworkDataGatewayConfiguration as __Configuration } from '../network-data-gateway-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { TransactionRequestResponse } from '../models/transaction-request-response';
import { TransactionRequest } from '../models/transaction-request';
import { PendingAction } from '../models/pending-action';
import { Transaction } from '../models/transaction';
import { TransactionStatusBody } from '../models/transaction-status-body';
import { TransactionStatuses } from '../models/transaction-statuses';
import { TransactionStatus } from '../models/transaction-status';
import { Connectivity } from '../models/connectivity';
import { TransactionStatusResponse } from '../models/transaction-status-response';
import { ScanStatus } from '../models/scan-status';
@Injectable({
  providedIn: 'root',
})
class NetworkDataGatewayService extends __BaseService {
  static readonly postDeviceTransactionsScanPath = '/device/transactions/scan';
  static readonly postDeviceTransactionsPath = '/device/transactions';
  static readonly getDeviceTransactionsPath = '/device/transactions/{customerId}/{remoteNodeId}';
  static readonly postStatusPath = '/device/transactions/status';
  static readonly getAllTransactionStatusesPath = '/device/transactions/status/{customerId}';
  static readonly getTransactionStatusPath = '/device/transactions/status/{customerId}/{transactionId}';
  static readonly getEligibilityPath = '/device/connectivity/status/{customerId}/{serialNumber}/{productId}';
  static readonly getDeviceEligibilityPath = '/device/connectivity/status/{serialNumber}/{productId}';
  static readonly getScanStatusByTransactionPath = '/device/scan-request/status/{customerId}/{transactionId}';
  static readonly getScanStatusBySerialPath = '/device/scan-request/status/{customerId}/{serialNumber}/{productId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param transactionRequest undefined
   * @return successful operation
   */
  postDeviceTransactionsScanResponse(transactionRequest: TransactionRequest): __Observable<__StrictHttpResponse<TransactionRequestResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = transactionRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/transactions/scan`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<TransactionRequestResponse>;
      })
    );
  }

  /**
   * @param transactionRequest undefined
   * @return successful operation
   */
  postDeviceTransactionsScan(transactionRequest: TransactionRequest): __Observable<TransactionRequestResponse> {
    return this.postDeviceTransactionsScanResponse(transactionRequest).pipe(
      __map(_r => _r.body as TransactionRequestResponse)
    );
  }

  /**
   * @param transactionRequest undefined
   * @return successful operation
   */
  postDeviceTransactionsResponse(transactionRequest: TransactionRequest): __Observable<__StrictHttpResponse<TransactionRequestResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = transactionRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/transactions`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<TransactionRequestResponse>;
      })
    );
  }

  /**
   * @param transactionRequest undefined
   * @return successful operation
   */
  postDeviceTransactions(transactionRequest: TransactionRequest): __Observable<TransactionRequestResponse> {
    return this.postDeviceTransactionsResponse(transactionRequest).pipe(
      __map(_r => _r.body as TransactionRequestResponse)
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetDeviceTransactionsParams` containing the following parameters:
   *
   * - `remoteNodeId`: The transaction id of the request
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getDeviceTransactionsResponse(params: NetworkDataGatewayService.GetDeviceTransactionsParams): __Observable<__StrictHttpResponse<PendingAction>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/transactions/${params.customerId}/${params.remoteNodeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PendingAction>;
      })
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetDeviceTransactionsParams` containing the following parameters:
   *
   * - `remoteNodeId`: The transaction id of the request
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getDeviceTransactions(params: NetworkDataGatewayService.GetDeviceTransactionsParams): __Observable<PendingAction> {
    return this.getDeviceTransactionsResponse(params).pipe(
      __map(_r => _r.body as PendingAction)
    );
  }

  /**
   * @param statusInfo Post the status of each action
   * @return successful operation
   */
  postStatusResponse(statusInfo: TransactionStatusBody): __Observable<__StrictHttpResponse<Transaction>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = statusInfo;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/transactions/status`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Transaction>;
      })
    );
  }

  /**
   * @param statusInfo Post the status of each action
   * @return successful operation
   */
  postStatus(statusInfo: TransactionStatusBody): __Observable<Transaction> {
    return this.postStatusResponse(statusInfo).pipe(
      __map(_r => _r.body as Transaction)
    );
  }

  /**
   * @param customerId Unique identifier of a Cisco customer.
   * @return successful operation
   */
  getAllTransactionStatusesResponse(customerId: string): __Observable<__StrictHttpResponse<TransactionStatuses>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/transactions/status/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<TransactionStatuses>;
      })
    );
  }

  /**
   * @param customerId Unique identifier of a Cisco customer.
   * @return successful operation
   */
  getAllTransactionStatuses(customerId: string): __Observable<TransactionStatuses> {
    return this.getAllTransactionStatusesResponse(customerId).pipe(
      __map(_r => _r.body as TransactionStatuses)
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetTransactionStatusParams` containing the following parameters:
   *
   * - `transactionId`: The transaction id for the request.
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getTransactionStatusResponse(params: NetworkDataGatewayService.GetTransactionStatusParams): __Observable<__StrictHttpResponse<TransactionStatus>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/transactions/status/${params.customerId}/${params.transactionId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<TransactionStatus>;
      })
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetTransactionStatusParams` containing the following parameters:
   *
   * - `transactionId`: The transaction id for the request.
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getTransactionStatus(params: NetworkDataGatewayService.GetTransactionStatusParams): __Observable<TransactionStatus> {
    return this.getTransactionStatusResponse(params).pipe(
      __map(_r => _r.body as TransactionStatus)
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetEligibilityParams` containing the following parameters:
   *
   * - `serialNumber`: The serial number
   *
   * - `productId`: The product id
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getEligibilityResponse(params: NetworkDataGatewayService.GetEligibilityParams): __Observable<__StrictHttpResponse<Connectivity>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/connectivity/status/${params.customerId}/${params.serialNumber}/${params.productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Connectivity>;
      })
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetEligibilityParams` containing the following parameters:
   *
   * - `serialNumber`: The serial number
   *
   * - `productId`: The product id
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getEligibility(params: NetworkDataGatewayService.GetEligibilityParams): __Observable<Connectivity> {
    return this.getEligibilityResponse(params).pipe(
      __map(_r => _r.body as Connectivity)
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetDeviceEligibilityParams` containing the following parameters:
   *
   * - `serialNumber`: The serial number
   *
   * - `productId`: The product id
   *
   * @return successful operation
   */
  getDeviceEligibilityResponse(params: NetworkDataGatewayService.GetDeviceEligibilityParams): __Observable<__StrictHttpResponse<Connectivity>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/connectivity/status/${params.serialNumber}/${params.productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Connectivity>;
      })
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetDeviceEligibilityParams` containing the following parameters:
   *
   * - `serialNumber`: The serial number
   *
   * - `productId`: The product id
   *
   * @return successful operation
   */
  getDeviceEligibility(params: NetworkDataGatewayService.GetDeviceEligibilityParams): __Observable<Connectivity> {
    return this.getDeviceEligibilityResponse(params).pipe(
      __map(_r => _r.body as Connectivity)
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetScanStatusByTransactionParams` containing the following parameters:
   *
   * - `transactionId`: The transaction id for the request.
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getScanStatusByTransactionResponse(params: NetworkDataGatewayService.GetScanStatusByTransactionParams): __Observable<__StrictHttpResponse<TransactionStatusResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/scan-request/status/${params.customerId}/${params.transactionId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<TransactionStatusResponse>;
      })
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetScanStatusByTransactionParams` containing the following parameters:
   *
   * - `transactionId`: The transaction id for the request.
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getScanStatusByTransaction(params: NetworkDataGatewayService.GetScanStatusByTransactionParams): __Observable<TransactionStatusResponse> {
    return this.getScanStatusByTransactionResponse(params).pipe(
      __map(_r => _r.body as TransactionStatusResponse)
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetScanStatusBySerialParams` containing the following parameters:
   *
   * - `serialNumber`: The serial number
   *
   * - `productId`: The product id
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getScanStatusBySerialResponse(params: NetworkDataGatewayService.GetScanStatusBySerialParams): __Observable<__StrictHttpResponse<ScanStatus>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/ndgw/v1/device/scan-request/status/${params.customerId}/${params.serialNumber}/${params.productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ScanStatus>;
      })
    );
  }

  /**
   * @param params The `NetworkDataGatewayService.GetScanStatusBySerialParams` containing the following parameters:
   *
   * - `serialNumber`: The serial number
   *
   * - `productId`: The product id
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getScanStatusBySerial(params: NetworkDataGatewayService.GetScanStatusBySerialParams): __Observable<ScanStatus> {
    return this.getScanStatusBySerialResponse(params).pipe(
      __map(_r => _r.body as ScanStatus)
    );
  }
}

module NetworkDataGatewayService {

  /**
   * Parameters for getDeviceTransactions
   */
  export interface GetDeviceTransactionsParams {

    /**
     * The transaction id of the request
     */
    remoteNodeId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
  }

  /**
   * Parameters for getTransactionStatus
   */
  export interface GetTransactionStatusParams {

    /**
     * The transaction id for the request.
     */
    transactionId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
  }

  /**
   * Parameters for getEligibility
   */
  export interface GetEligibilityParams {

    /**
     * The serial number
     */
    serialNumber: string;

    /**
     * The product id
     */
    productId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
  }

  /**
   * Parameters for getDeviceEligibility
   */
  export interface GetDeviceEligibilityParams {

    /**
     * The serial number
     */
    serialNumber: string;

    /**
     * The product id
     */
    productId: string;
  }

  /**
   * Parameters for getScanStatusByTransaction
   */
  export interface GetScanStatusByTransactionParams {

    /**
     * The transaction id for the request.
     */
    transactionId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
  }

  /**
   * Parameters for getScanStatusBySerial
   */
  export interface GetScanStatusBySerialParams {

    /**
     * The serial number
     */
    serialNumber: string;

    /**
     * The product id
     */
    productId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
  }
}

export { NetworkDataGatewayService }
