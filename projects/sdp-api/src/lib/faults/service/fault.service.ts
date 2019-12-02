import { BaseService } from '../../core/base-service';
import { HttpClient } from '@angular/common/http';
import { FaultConfiguration } from '../fault-configuration';
import { Injectable } from '@angular/core';
import { FaultSearchParams, FaultResponse, FaultSummary,
	FaultAffectedSystems, FaultFilterData, FaultIcSettings } from '../models';
import { Observable } from 'rxjs';
import { map as __map } from 'rxjs/operators';
import { FaultICSearchParams } from '../models/fault';

/**
 * Fault Service class which will used as service for am componet
 * it has a rest calls retrive information
 * @export
 * @class FaultService
 * @extends {BaseService}
 */
@Injectable({
	providedIn: 'root',
})

/**
 * Fault Services
 */
export class FaultService extends BaseService {

	private faultsPath = `${this.rootUrl}/customerportal/syslog/v1/message/faults`;
	private affectedSystemsPath = `${this.rootUrl}/customerportal/syslog/v1/affectedSystems`;
	private faultSummaryPath = `${this.rootUrl}/customerportal/syslog/v1/faultSummary`;
	private faultFiltersData = `${this.rootUrl}/customerportal/syslog/v1/filters/data`;
	private faultUpdateCase = `${this.rootUrl}/customerportal/afm/v1/fault/setIcSettings`;

	constructor (config: FaultConfiguration, http: HttpClient) {
		super(config, http);
	}

	/**
	 * Get fault details
	 *
	 * @param _faultSearchParams FaultSearchParams
	 * @returns FaultResponse
	 */
	public getFaultDetails (_faultSearchParams: FaultSearchParams): Observable<FaultResponse> {
		return this.http.post<FaultResponse>(this.faultsPath, _faultSearchParams)
		.pipe(__map(response => response));
	}

	/**
	 * Get Summary Details
	 *
	 * @param _faultSearchParams FaultSearchParams
	 * @returns FaultSummary
	 */
	public getSummaryDetails (_faultSearchParams: FaultSearchParams): Observable<FaultSummary> {
		return this.http.post<FaultSummary>(this.faultSummaryPath, _faultSearchParams)
		.pipe(__map(response => response));
	}

	/**
	 * Get Summary Details
	 *
	 * @param _faultSearchParams FaultSearchParams
	 * @returns FaultAffectedSystems
	 */
	public getAffectedSystems (_faultSearchParams: FaultSearchParams):
		Observable<FaultAffectedSystems> {
		return this.http.post<FaultAffectedSystems>(this.affectedSystemsPath, _faultSearchParams)
		.pipe(__map(response => response));
	}

	/**
	 * Get Fault filters data
	 *
	 * @param _faultSearchParams FaltSearchParams
	 * @returns FaultFilterData
	 */
	public getFaultFiltersData (_faultSearchParams: FaultSearchParams):
		Observable<FaultFilterData> {
		return this.http.post<FaultFilterData>(this.faultFiltersData, _faultSearchParams)
		.pipe(__map(response => response));
	}

	/**
	 * Update the Ic settings
	 *
	 * @param _faultSearchParams FaultICSearchParams
	 * @returns FaultIcSettings
	 *
	 * need to develop
	 */
	public updateIcSettings (_faultSearchParams: FaultICSearchParams):
	Observable<FaultIcSettings> {
		return this.http.post<FaultIcSettings>(this.faultUpdateCase, _faultSearchParams)
		.pipe(__map(response => response));
	}
}
