/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { InventoryConfiguration as __Configuration } from '../inventory-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { Assets } from '../models/assets';
import { AssetSummary } from '../models/asset-summary';
import { SystemAssets } from '../models/system-assets';
import { HardwareResponse } from '../models/hardware-response';
import { NetworkElementResponse } from '../models/network-element-response';
import { SoftwareResponse } from '../models/software-response';
import { RoleCountResponse } from '../models/role-count-response';
@Injectable({
  providedIn: 'root',
})
class InventoryService extends __BaseService {
  static readonly headAssetsPath = '/assets';
  static readonly getAssetsPath = '/assets';
  static readonly getAssetSummaryPath = '/assets/summary';
  static readonly headSystemAssetsPath = '/assets/system';
  static readonly getSystemAssetsPath = '/assets/system';
  static readonly headHardwarePath = '/hardware';
  static readonly getHardwarePath = '/hardware';
  static readonly headNetworkElementsPath = '/network-elements';
  static readonly getNetworkElementsPath = '/network-elements';
  static readonly headSoftwarePath = '/software';
  static readonly getSoftwarePath = '/software';
  static readonly getRoleCountPath = '/role/device/count';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * API to get all the assets
   * @param params The `InventoryService.HeadAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The serial number of the device
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `role`: The device role
   *
   * - `managedNeId`:
   *
   * - `lastDateOfSupportRange`: A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
   *
   * - `hwInstanceId`:
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasFieldNotices`: Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `cxLevel`: A customer support level
   *
   * - `coverage`: The coverage
   *
   * - `contractNumber`: The contract numbers
   */
  headAssetsResponse(params: InventoryService.HeadAssetsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    (params.role || []).forEach(val => {if (val != null) __params = __params.append('role', val.toString())});
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.lastDateOfSupportRange || []).forEach(val => {if (val != null) __params = __params.append('lastDateOfSupportRange', val.toString())});
    (params.hwInstanceId || []).forEach(val => {if (val != null) __params = __params.append('hwInstanceId', val.toString())});
    if (params.hasSecurityAdvisories != null) __params = __params.set('hasSecurityAdvisories', params.hasSecurityAdvisories.toString());
    if (params.hasFieldNotices != null) __params = __params.set('hasFieldNotices', params.hasFieldNotices.toString());
    if (params.hasBugs != null) __params = __params.set('hasBugs', params.hasBugs.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    (params.coverage || []).forEach(val => {if (val != null) __params = __params.append('coverage', val.toString())});
    (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/customerportal/inventory/v1/assets`,
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
   * API to get all the assets
   * @param params The `InventoryService.HeadAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The serial number of the device
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `role`: The device role
   *
   * - `managedNeId`:
   *
   * - `lastDateOfSupportRange`: A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
   *
   * - `hwInstanceId`:
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasFieldNotices`: Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `cxLevel`: A customer support level
   *
   * - `coverage`: The coverage
   *
   * - `contractNumber`: The contract numbers
   */
  headAssets(params: InventoryService.HeadAssetsParams): __Observable<null> {
    return this.headAssetsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * API to get all the assets
   * @param params The `InventoryService.GetAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The serial number of the device
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `role`: The device role
   *
   * - `page`: The page number of the response
   *
   * - `managedNeId`:
   *
   * - `lastDateOfSupportRange`: A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
   *
   * - `hwInstanceId`:
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasFieldNotices`: Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `cxLevel`: A customer support level
   *
   * - `coverage`: The coverage
   *
   * - `contractNumber`: The contract numbers
   *
   * @return successful operation
   */
  getAssetsResponse(params: InventoryService.GetAssetsParams): __Observable<__StrictHttpResponse<Assets>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.role || []).forEach(val => {if (val != null) __params = __params.append('role', val.toString())});
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.lastDateOfSupportRange || []).forEach(val => {if (val != null) __params = __params.append('lastDateOfSupportRange', val.toString())});
    (params.hwInstanceId || []).forEach(val => {if (val != null) __params = __params.append('hwInstanceId', val.toString())});
    if (params.hasSecurityAdvisories != null) __params = __params.set('hasSecurityAdvisories', params.hasSecurityAdvisories.toString());
    if (params.hasFieldNotices != null) __params = __params.set('hasFieldNotices', params.hasFieldNotices.toString());
    if (params.hasBugs != null) __params = __params.set('hasBugs', params.hasBugs.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    (params.coverage || []).forEach(val => {if (val != null) __params = __params.append('coverage', val.toString())});
    (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/assets`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Assets>;
      })
    );
  }

  /**
   * API to get all the assets
   * @param params The `InventoryService.GetAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The serial number of the device
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `role`: The device role
   *
   * - `page`: The page number of the response
   *
   * - `managedNeId`:
   *
   * - `lastDateOfSupportRange`: A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
   *
   * - `hwInstanceId`:
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasFieldNotices`: Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `cxLevel`: A customer support level
   *
   * - `coverage`: The coverage
   *
   * - `contractNumber`: The contract numbers
   *
   * @return successful operation
   */
  getAssets(params: InventoryService.GetAssetsParams): __Observable<Assets> {
    return this.getAssetsResponse(params).pipe(
      __map(_r => _r.body as Assets)
    );
  }

  /**
   * API to get summary details for a particular device. Summary details includes device,contract & alert details.
   * @param params The `InventoryService.GetAssetSummaryParams` containing the following parameters:
   *
   * - `hwInstanceId`: The unique identifier for a hardware device
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `search`: Searchable fields - deviceName, ipAddress, serialNumber, osType, osVersion, role. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `cxLevel`: A customer support level
   *
   * @return successful operation
   */
  getAssetSummaryResponse(params: InventoryService.GetAssetSummaryParams): __Observable<__StrictHttpResponse<AssetSummary>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.hwInstanceId != null) __params = __params.set('hwInstanceId', params.hwInstanceId.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/assets/summary`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AssetSummary>;
      })
    );
  }

  /**
   * API to get summary details for a particular device. Summary details includes device,contract & alert details.
   * @param params The `InventoryService.GetAssetSummaryParams` containing the following parameters:
   *
   * - `hwInstanceId`: The unique identifier for a hardware device
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `search`: Searchable fields - deviceName, ipAddress, serialNumber, osType, osVersion, role. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `cxLevel`: A customer support level
   *
   * @return successful operation
   */
  getAssetSummary(params: InventoryService.GetAssetSummaryParams): __Observable<AssetSummary> {
    return this.getAssetSummaryResponse(params).pipe(
      __map(_r => _r.body as AssetSummary)
    );
  }

  /**
   * API to get all the system assets
   * @param params The `InventoryService.HeadSystemAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasFieldNotices`: Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `cxLevel`: A customer support level
   */
  headSystemAssetsResponse(params: InventoryService.HeadSystemAssetsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.hasSecurityAdvisories != null) __params = __params.set('hasSecurityAdvisories', params.hasSecurityAdvisories.toString());
    if (params.hasFieldNotices != null) __params = __params.set('hasFieldNotices', params.hasFieldNotices.toString());
    if (params.hasBugs != null) __params = __params.set('hasBugs', params.hasBugs.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/customerportal/inventory/v1/assets/system`,
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
   * API to get all the system assets
   * @param params The `InventoryService.HeadSystemAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasFieldNotices`: Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `cxLevel`: A customer support level
   */
  headSystemAssets(params: InventoryService.HeadSystemAssetsParams): __Observable<null> {
    return this.headSystemAssetsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * API to get all the system assets
   * @param params The `InventoryService.GetSystemAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: Serial Number of the device
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `role`: Role of the device
   *
   * - `productType`: Filter by device's product type
   *
   * - `productName`: Filter by device's product name
   *
   * - `productId`: Devices Product ID
   *
   * - `page`: The page number of the response
   *
   * - `osVersion`: Software Version of the device
   *
   * - `neId`: Network Element Id
   *
   * - `managedNeId`: Devices Management Network Element ID
   *
   * - `isManagedNe`: Filter by managed Network Element
   *
   * - `ipAddress`: IP Address of the device
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `deviceName`: Hostname of the device
   *
   * - `cxLevel`: A customer support level
   *
   * - `criticalAdvisoryCount`: Filter by number of critical advisories
   *
   * @return successful operation
   */
  getSystemAssetsResponse(params: InventoryService.GetSystemAssetsParams): __Observable<__StrictHttpResponse<SystemAssets>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.serialNumber != null) __params = __params.set('serialNumber', params.serialNumber.toString());
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.role != null) __params = __params.set('role', params.role.toString());
    if (params.productType != null) __params = __params.set('productType', params.productType.toString());
    if (params.productName != null) __params = __params.set('productName', params.productName.toString());
    if (params.productId != null) __params = __params.set('productId', params.productId.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.osVersion != null) __params = __params.set('osVersion', params.osVersion.toString());
    if (params.neId != null) __params = __params.set('neId', params.neId.toString());
    if (params.managedNeId != null) __params = __params.set('managedNeId', params.managedNeId.toString());
    if (params.isManagedNe != null) __params = __params.set('isManagedNe', params.isManagedNe.toString());
    if (params.ipAddress != null) __params = __params.set('ipAddress', params.ipAddress.toString());
    if (params.hasSecurityAdvisories != null) __params = __params.set('hasSecurityAdvisories', params.hasSecurityAdvisories.toString());
    if (params.hasBugs != null) __params = __params.set('hasBugs', params.hasBugs.toString());
    if (params.deviceName != null) __params = __params.set('deviceName', params.deviceName.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    if (params.criticalAdvisoryCount != null) __params = __params.set('criticalAdvisoryCount', params.criticalAdvisoryCount.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/assets/system`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SystemAssets>;
      })
    );
  }

  /**
   * API to get all the system assets
   * @param params The `InventoryService.GetSystemAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: Serial Number of the device
   *
   * - `search`: Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `role`: Role of the device
   *
   * - `productType`: Filter by device's product type
   *
   * - `productName`: Filter by device's product name
   *
   * - `productId`: Devices Product ID
   *
   * - `page`: The page number of the response
   *
   * - `osVersion`: Software Version of the device
   *
   * - `neId`: Network Element Id
   *
   * - `managedNeId`: Devices Management Network Element ID
   *
   * - `isManagedNe`: Filter by managed Network Element
   *
   * - `ipAddress`: IP Address of the device
   *
   * - `hasSecurityAdvisories`: Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `hasBugs`: Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
   *
   * - `deviceName`: Hostname of the device
   *
   * - `cxLevel`: A customer support level
   *
   * - `criticalAdvisoryCount`: Filter by number of critical advisories
   *
   * @return successful operation
   */
  getSystemAssets(params: InventoryService.GetSystemAssetsParams): __Observable<SystemAssets> {
    return this.getSystemAssetsResponse(params).pipe(
      __map(_r => _r.body as SystemAssets)
    );
  }

  /**
   * Returns the number of total number of hardware entries for the identified customer along with query metadata (e.g. rows/page)
   * @param params The `InventoryService.HeadHardwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `cxLevel`: A customer support level
   */
  headHardwareResponse(params: InventoryService.HeadHardwareParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/customerportal/inventory/v1/hardware`,
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
   * Returns the number of total number of hardware entries for the identified customer along with query metadata (e.g. rows/page)
   * @param params The `InventoryService.HeadHardwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `cxLevel`: A customer support level
   */
  headHardware(params: InventoryService.HeadHardwareParams): __Observable<null> {
    return this.headHardwareResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Hardware API retrieves hardware inventory details based on the device IDs. This API can be used to return hardware details for a specific customer. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain hardware information for all device IDs associated with customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `InventoryService.GetHardwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The recognized/validated Serial Number
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `productId`: The vendor-specific model name identifier string associated with this physical component
   *
   * - `page`: Page number of the response
   *
   * - `managedNeId`: The unique, generated ID of the managed network element
   *
   * - `hwInstanceId`: hardware instance ID
   *
   * - `fields`: Requested fields in the response.
   *
   * - `equipmentType`: An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   *
   * - `cxLevel`: A customer support level
   *
   * - `containingHwId`: This is a reference to the physical container (equipment holder). For example, module’s container is the chassis.
   *
   * @return successful operation
   */
  getHardwareResponse(params: InventoryService.GetHardwareParams): __Observable<__StrictHttpResponse<HardwareResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.productId || []).forEach(val => {if (val != null) __params = __params.append('productId', val.toString())});
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.hwInstanceId || []).forEach(val => {if (val != null) __params = __params.append('hwInstanceId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.equipmentType || []).forEach(val => {if (val != null) __params = __params.append('equipmentType', val.toString())});
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    (params.containingHwId || []).forEach(val => {if (val != null) __params = __params.append('containingHwId', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/hardware`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<HardwareResponse>;
      })
    );
  }

  /**
   * The Hardware API retrieves hardware inventory details based on the device IDs. This API can be used to return hardware details for a specific customer. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain hardware information for all device IDs associated with customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `InventoryService.GetHardwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The recognized/validated Serial Number
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `productId`: The vendor-specific model name identifier string associated with this physical component
   *
   * - `page`: Page number of the response
   *
   * - `managedNeId`: The unique, generated ID of the managed network element
   *
   * - `hwInstanceId`: hardware instance ID
   *
   * - `fields`: Requested fields in the response.
   *
   * - `equipmentType`: An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   *
   * - `cxLevel`: A customer support level
   *
   * - `containingHwId`: This is a reference to the physical container (equipment holder). For example, module’s container is the chassis.
   *
   * @return successful operation
   */
  getHardware(params: InventoryService.GetHardwareParams): __Observable<HardwareResponse> {
    return this.getHardwareResponse(params).pipe(
      __map(_r => _r.body as HardwareResponse)
    );
  }

  /**
   * Returns the number of total number of managed NetworkElements along with query metadata (e.g. rows/page)
   * @param params The `InventoryService.HeadNetworkElementsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `cxLevel`: A customer support level
   */
  headNetworkElementsResponse(params: InventoryService.HeadNetworkElementsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/customerportal/inventory/v1/network-elements`,
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
   * Returns the number of total number of managed NetworkElements along with query metadata (e.g. rows/page)
   * @param params The `InventoryService.HeadNetworkElementsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `cxLevel`: A customer support level
   */
  headNetworkElements(params: InventoryService.HeadNetworkElementsParams): __Observable<null> {
    return this.headNetworkElementsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Network-Element API retrieves a list of devices along with specific details. All request parameters are optional other than customerId.
   * This API can be used to return the list of device IDs for a specific customer associated with the Party ID in header meta-data.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://apx.cisco.com/cs/api/v1/inventory/network-elements
   * @param params The `InventoryService.GetNetworkElementsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `swVersion`: The specific version of the software (Software Type) that is installed on the Network Element.
   *
   * - `swType`: Software Type identifies the specific type of software that is installed on this host/system.
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The serial number of the device
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `productId`: The vendor-specific model name identifier string associated with this physical component
   *
   * - `productFamily`: Unique identifier of a Cisco customer.
   *
   * - `page`: The page number of the response
   *
   * - `neRegistrationStatus`: NE registration status
   *
   * - `neInstanceId`: The unique, generated ID of the network element.
   *
   * - `managedNeId`: Unique identifier of a Network Resource ID
   *
   * - `installedMemory`: Software Type identifies the specific type of software that is installed on this host/system. Unit is bytes.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `cxLevel`: A customer support level
   *
   * @return successful operation
   */
  getNetworkElementsResponse(params: InventoryService.GetNetworkElementsParams): __Observable<__StrictHttpResponse<NetworkElementResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    (params.swVersion || []).forEach(val => {if (val != null) __params = __params.append('swVersion', val.toString())});
    (params.swType || []).forEach(val => {if (val != null) __params = __params.append('swType', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.productId || []).forEach(val => {if (val != null) __params = __params.append('productId', val.toString())});
    if (params.productFamily != null) __params = __params.set('productFamily', params.productFamily.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.neRegistrationStatus || []).forEach(val => {if (val != null) __params = __params.append('neRegistrationStatus', val.toString())});
    (params.neInstanceId || []).forEach(val => {if (val != null) __params = __params.append('neInstanceId', val.toString())});
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.installedMemory || []).forEach(val => {if (val != null) __params = __params.append('installedMemory', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/network-elements`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<NetworkElementResponse>;
      })
    );
  }

  /**
   * The Network-Element API retrieves a list of devices along with specific details. All request parameters are optional other than customerId.
   * This API can be used to return the list of device IDs for a specific customer associated with the Party ID in header meta-data.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://apx.cisco.com/cs/api/v1/inventory/network-elements
   * @param params The `InventoryService.GetNetworkElementsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `swVersion`: The specific version of the software (Software Type) that is installed on the Network Element.
   *
   * - `swType`: Software Type identifies the specific type of software that is installed on this host/system.
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `serialNumber`: The serial number of the device
   *
   * - `saId`: Smart Account Identifier. This id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `productId`: The vendor-specific model name identifier string associated with this physical component
   *
   * - `productFamily`: Unique identifier of a Cisco customer.
   *
   * - `page`: The page number of the response
   *
   * - `neRegistrationStatus`: NE registration status
   *
   * - `neInstanceId`: The unique, generated ID of the network element.
   *
   * - `managedNeId`: Unique identifier of a Network Resource ID
   *
   * - `installedMemory`: Software Type identifies the specific type of software that is installed on this host/system. Unit is bytes.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `cxLevel`: A customer support level
   *
   * @return successful operation
   */
  getNetworkElements(params: InventoryService.GetNetworkElementsParams): __Observable<NetworkElementResponse> {
    return this.getNetworkElementsResponse(params).pipe(
      __map(_r => _r.body as NetworkElementResponse)
    );
  }

  /**
   * Returns the number of total number of software entries for the NetworkElements in the inventory along with query metadata (e.g. rows/page)
   * @param params The `InventoryService.HeadSoftwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   */
  headSoftwareResponse(params: InventoryService.HeadSoftwareParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/customerportal/inventory/v1/software`,
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
   * Returns the number of total number of software entries for the NetworkElements in the inventory along with query metadata (e.g. rows/page)
   * @param params The `InventoryService.HeadSoftwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   */
  headSoftware(params: InventoryService.HeadSoftwareParams): __Observable<null> {
    return this.headSoftwareResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Software API retrieves software details based on device IDs. This API can be used to return software details for a specific customer associated with the Party ID in header meta-data. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain system software information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://apx.cisco.com/cs/api/v1/inventory/software
   * @param params The `InventoryService.GetSoftwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `swVersion`: The specific version of the software (Software Type) that is installed on the Network Element. Example:- 15.1(4)M4
   *
   * - `swType`: Software Type identifies the specific type of software that is installed on this host/system.
   *
   * - `swStatus`: The Status of the Software running on the Network Element. Default value is ACTIVE. For PIE and SMU it can also be COMMITTED.
   *
   * - `swName`: The Name of the Software running on Network Element. For System SW, the value is the Image Name. For PIE it is the package name and for SMU the SMU name. Example: asr9k-p-4.2.3.CSCtz41749-1.0.0
   *
   * - `swMajorVersion`: The major version portion of the software version. Example: 15.1
   *
   * - `swCategory`: The broader category of the software record. The Role of the Software running on a Network Element. Example: System Software, Application Software; Patch; Package
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `managedNeInstanceId`: The unique, generated ID of the network element.
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * @return successful operation
   */
  getSoftwareResponse(params: InventoryService.GetSoftwareParams): __Observable<__StrictHttpResponse<SoftwareResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.swVersion || []).forEach(val => {if (val != null) __params = __params.append('swVersion', val.toString())});
    (params.swType || []).forEach(val => {if (val != null) __params = __params.append('swType', val.toString())});
    (params.swStatus || []).forEach(val => {if (val != null) __params = __params.append('swStatus', val.toString())});
    (params.swName || []).forEach(val => {if (val != null) __params = __params.append('swName', val.toString())});
    (params.swMajorVersion || []).forEach(val => {if (val != null) __params = __params.append('swMajorVersion', val.toString())});
    (params.swCategory || []).forEach(val => {if (val != null) __params = __params.append('swCategory', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.managedNeInstanceId || []).forEach(val => {if (val != null) __params = __params.append('managedNeInstanceId', val.toString())});
    if (params.inventoryName != null) __params = __params.set('inventoryName', params.inventoryName.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/software`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SoftwareResponse>;
      })
    );
  }

  /**
   * The Software API retrieves software details based on device IDs. This API can be used to return software details for a specific customer associated with the Party ID in header meta-data. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain system software information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://apx.cisco.com/cs/api/v1/inventory/software
   * @param params The `InventoryService.GetSoftwareParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `swVersion`: The specific version of the software (Software Type) that is installed on the Network Element. Example:- 15.1(4)M4
   *
   * - `swType`: Software Type identifies the specific type of software that is installed on this host/system.
   *
   * - `swStatus`: The Status of the Software running on the Network Element. Default value is ACTIVE. For PIE and SMU it can also be COMMITTED.
   *
   * - `swName`: The Name of the Software running on Network Element. For System SW, the value is the Image Name. For PIE it is the package name and for SMU the SMU name. Example: asr9k-p-4.2.3.CSCtz41749-1.0.0
   *
   * - `swMajorVersion`: The major version portion of the software version. Example: 15.1
   *
   * - `swCategory`: The broader category of the software record. The Role of the Software running on a Network Element. Example: System Software, Application Software; Patch; Package
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `managedNeInstanceId`: The unique, generated ID of the network element.
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * @return successful operation
   */
  getSoftware(params: InventoryService.GetSoftwareParams): __Observable<SoftwareResponse> {
    return this.getSoftwareResponse(params).pipe(
      __map(_r => _r.body as SoftwareResponse)
    );
  }

  /**
   * The Device roles set by DNAC.
   * @param params The `InventoryService.GetRoleCountParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `role`: The device role
   *
   * @return successful operation
   */
  getRoleCountResponse(params: InventoryService.GetRoleCountParams): __Observable<__StrictHttpResponse<RoleCountResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    (params.role || []).forEach(val => {if (val != null) __params = __params.append('role', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/inventory/v1/role/device/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<RoleCountResponse>;
      })
    );
  }

  /**
   * The Device roles set by DNAC.
   * @param params The `InventoryService.GetRoleCountParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `role`: The device role
   *
   * @return successful operation
   */
  getRoleCount(params: InventoryService.GetRoleCountParams): __Observable<RoleCountResponse> {
    return this.getRoleCountResponse(params).pipe(
      __map(_r => _r.body as RoleCountResponse)
    );
  }
}

module InventoryService {

  /**
   * Parameters for headAssets
   */
  export interface HeadAssetsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * The serial number of the device
     */
    serialNumber?: Array<string>;

    /**
     * Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * The device role
     */
    role?: Array<string>;
    managedNeId?: Array<string>;

    /**
     * A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
     */
    lastDateOfSupportRange?: Array<string>;
    hwInstanceId?: Array<string>;

    /**
     * Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasSecurityAdvisories?: string;

    /**
     * Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasFieldNotices?: string;

    /**
     * Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasBugs?: string;

    /**
     * A customer support level
     */
    cxLevel?: string;

    /**
     * The coverage
     */
    coverage?: Array<'covered' | 'uncovered' | 'unknown' | 'expired'>;

    /**
     * The contract numbers
     */
    contractNumber?: Array<string>;
  }

  /**
   * Parameters for getAssets
   */
  export interface GetAssetsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * The serial number of the device
     */
    serialNumber?: Array<string>;

    /**
     * Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The device role
     */
    role?: Array<string>;

    /**
     * The page number of the response
     */
    page?: number;
    managedNeId?: Array<string>;

    /**
     * A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
     */
    lastDateOfSupportRange?: Array<string>;
    hwInstanceId?: Array<string>;

    /**
     * Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasSecurityAdvisories?: string;

    /**
     * Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasFieldNotices?: string;

    /**
     * Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasBugs?: string;

    /**
     * A customer support level
     */
    cxLevel?: string;

    /**
     * The coverage
     */
    coverage?: Array<'covered' | 'uncovered' | 'unknown' | 'expired'>;

    /**
     * The contract numbers
     */
    contractNumber?: Array<string>;
  }

  /**
   * Parameters for getAssetSummary
   */
  export interface GetAssetSummaryParams {

    /**
     * The unique identifier for a hardware device
     */
    hwInstanceId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Searchable fields - deviceName, ipAddress, serialNumber, osType, osVersion, role. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * A customer support level
     */
    cxLevel?: string;
  }

  /**
   * Parameters for headSystemAssets
   */
  export interface HeadSystemAssetsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasSecurityAdvisories?: string;

    /**
     * Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasFieldNotices?: string;

    /**
     * Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasBugs?: string;

    /**
     * A customer support level
     */
    cxLevel?: string;
  }

  /**
   * Parameters for getSystemAssets
   */
  export interface GetSystemAssetsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * Serial Number of the device
     */
    serialNumber?: string;

    /**
     * Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * Role of the device
     */
    role?: string;

    /**
     * Filter by device's product type
     */
    productType?: string;

    /**
     * Filter by device's product name
     */
    productName?: string;

    /**
     * Devices Product ID
     */
    productId?: string;

    /**
     * The page number of the response
     */
    page?: number;

    /**
     * Software Version of the device
     */
    osVersion?: string;

    /**
     * Network Element Id
     */
    neId?: string;

    /**
     * Devices Management Network Element ID
     */
    managedNeId?: string;

    /**
     * Filter by managed Network Element
     */
    isManagedNe?: boolean;

    /**
     * IP Address of the device
     */
    ipAddress?: string;

    /**
     * Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasSecurityAdvisories?: string;

    /**
     * Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasBugs?: string;

    /**
     * Hostname of the device
     */
    deviceName?: string;

    /**
     * A customer support level
     */
    cxLevel?: string;

    /**
     * Filter by number of critical advisories
     */
    criticalAdvisoryCount?: string;
  }

  /**
   * Parameters for headHardware
   */
  export interface HeadHardwareParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * A customer support level
     */
    cxLevel?: string;
  }

  /**
   * Parameters for getHardware
   */
  export interface GetHardwareParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * The recognized/validated Serial Number
     */
    serialNumber?: Array<string>;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * The vendor-specific model name identifier string associated with this physical component
     */
    productId?: Array<string>;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * The unique, generated ID of the managed network element
     */
    managedNeId?: Array<string>;

    /**
     * hardware instance ID
     */
    hwInstanceId?: Array<string>;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;

    /**
     * An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
     */
    equipmentType?: Array<string>;

    /**
     * A customer support level
     */
    cxLevel?: string;

    /**
     * This is a reference to the physical container (equipment holder). For example, module’s container is the chassis.
     */
    containingHwId?: Array<string>;
  }

  /**
   * Parameters for headNetworkElements
   */
  export interface HeadNetworkElementsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * A customer support level
     */
    cxLevel?: string;
  }

  /**
   * Parameters for getNetworkElements
   */
  export interface GetNetworkElementsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Virtual Account Identifier. This is a list of virtual account admin(s) unique identifier who is managing the designated list of customer network devices.
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The specific version of the software (Software Type) that is installed on the Network Element.
     */
    swVersion?: Array<string>;

    /**
     * Software Type identifies the specific type of software that is installed on this host/system.
     */
    swType?: Array<string>;

    /**
     * ASC (ascending) or DESC (descending)
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * The serial number of the device
     */
    serialNumber?: Array<string>;

    /**
     * Smart Account Identifier. This id defines the smart account admin unique identifier
     */
    saId?: number;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The vendor-specific model name identifier string associated with this physical component
     */
    productId?: Array<string>;

    /**
     * Unique identifier of a Cisco customer.
     */
    productFamily?: string;

    /**
     * The page number of the response
     */
    page?: number;

    /**
     * NE registration status
     */
    neRegistrationStatus?: Array<string>;

    /**
     * The unique, generated ID of the network element.
     */
    neInstanceId?: Array<number>;

    /**
     * Unique identifier of a Network Resource ID
     */
    managedNeId?: Array<number>;

    /**
     * Software Type identifies the specific type of software that is installed on this host/system. Unit is bytes.
     */
    installedMemory?: Array<number>;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;

    /**
     * A customer support level
     */
    cxLevel?: string;
  }

  /**
   * Parameters for headSoftware
   */
  export interface HeadSoftwareParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

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
  }

  /**
   * Parameters for getSoftware
   */
  export interface GetSoftwareParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The specific version of the software (Software Type) that is installed on the Network Element. Example:- 15.1(4)M4
     */
    swVersion?: Array<string>;

    /**
     * Software Type identifies the specific type of software that is installed on this host/system.
     */
    swType?: Array<string>;

    /**
     * The Status of the Software running on the Network Element. Default value is ACTIVE. For PIE and SMU it can also be COMMITTED.
     */
    swStatus?: Array<string>;

    /**
     * The Name of the Software running on Network Element. For System SW, the value is the Image Name. For PIE it is the package name and for SMU the SMU name. Example: asr9k-p-4.2.3.CSCtz41749-1.0.0
     */
    swName?: Array<string>;

    /**
     * The major version portion of the software version. Example: 15.1
     */
    swMajorVersion?: Array<string>;

    /**
     * The broader category of the software record. The Role of the Software running on a Network Element. Example: System Software, Application Software; Patch; Package
     */
    swCategory?: Array<string>;

    /**
     * ASC (ascending) or DESC (descending)
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The page number of the response
     */
    page?: number;

    /**
     * The unique, generated ID of the network element.
     */
    managedNeInstanceId?: Array<number>;

    /**
     * The name of inventory given by customers.
     */
    inventoryName?: string;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for getRoleCount
   */
  export interface GetRoleCountParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * The device role
     */
    role?: Array<string>;
  }
}

export { InventoryService }
