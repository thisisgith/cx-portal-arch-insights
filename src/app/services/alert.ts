import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import { LogService } from '@cisco-ngx/cui-services';
import {
	Advisory,
	Announcement,
	Bug,
	Case,
	Contract,
	FieldNotice,
	License,
	RMA,
} from '@interfaces';

/**
 * Interface representing the inventory vulnerabilities
 */
export interface Vulnerability {
	advisories: Advisory[];
	fieldNotices: FieldNotice[];
}

/**
 * Interface representing the inventory health
 */
export interface Health {
	bugs: Bug[];
	cases: Case[];
	rmas: RMA[];
}

/**
 * Representing the lifecycles
 */
export interface Lifecycle {
	announcements: Announcement[];
	contracts: Contract[];
	licenses: License[];
}

/**
 * Interface representing the Alert Results
 */
export interface AlertResults {
	health?: Health;
	lifecycle?: Lifecycle;
	vulnerabilities?: Vulnerability;
}

/**
 * Interface representing the inventory results
 */
@Injectable({
	providedIn: 'root',
})
export class AlertService {

	private serviceUrl: string;

	constructor (
		private http: HttpClient,
		private logger: LogService,
	) {
		const origin = environment.origin || window.location.origin;
		this.serviceUrl = `${origin}${environment.services.alert}`;
	}

	/**
	 * Performs a query against the Alerts API
	 * @returns Alert Results
	 */
	public read (): Observable<AlertResults> {
		this.logger.debug('AlertService : read() :: Querying');

		return this.http.get<AlertResults>(this.serviceUrl);
	}

}
