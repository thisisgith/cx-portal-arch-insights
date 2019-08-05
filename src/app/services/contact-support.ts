import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';
import { of } from 'rxjs';

/**
 * Service to submit message in contact support modal
 */
@Injectable({
    providedIn: 'root',
})
export class ContactSupportService {
    private emailSubmitUrl = environment.emailSupport;

    constructor (
        private http: HttpClient, private logger: LogService,
    ) { }

	/**
	 * Send email
	 * @param requestBody email info
     * @returns observable with email response
	 */
    public sendEmail (requestBody) {
        let __headers = new HttpHeaders();
        let __body: any = null;
        const xMasheryP1 = 'eyJjbGllbnRfY2NvX2lkIjoic250Y2NicjVAaG90bWFpbC5jb20iLCJwYXJ';
        const xMasheryP2 = '0eV9pZCI6IjI0MzExOTkiLCJhY2Nlc3NfdG9rZW5fdWlkIjoic250Y2Nicj';
        const xMasheryP3 = 'VAaG90bWFpbC5jb20iLCJhY2Nlc3NfdG9rZW5fYWNjZXNzbGV2ZWwiOiI0In0='
        __headers = __headers.append('Content-Type', 'application/json');
        __headers = __headers.append('X-Mashery-Handshake', `${xMasheryP1}${xMasheryP2}${xMasheryP3}`);
        __body = requestBody;
        let req = new HttpRequest<any>(
            'POST',
            this.emailSubmitUrl,
            __body,
            {
              headers: __headers,
            });
            return this.http.request<any>(req)
			.pipe(
				catchError(err => {
					this.logger.error('contact-support.component : submitMessage() ' +
						`:: Error : (${err.status}) ${err.message}`);
					return of({ });
				}),
			);
    }
}