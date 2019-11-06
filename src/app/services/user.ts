import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';
/**
 * Service which helps in refreshing notes list if a new note is added
 */
@Injectable({
	providedIn: 'root',
})

export class UserService {
	private rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;
	private cxPortalEntitlementPath = '/cxportal/cxpp-entitlement-wrapper/v1/entitlement/user/';

	constructor (
		private http: HttpClient, private logger: LogService,
  ) { }

	public getUserAccounts () {
    const __headers = new HttpHeaders();

    const req = new HttpRequest<any>(
      'GET',
      this.rootUrl + this.cxPortalEntitlementPath + `accounts?accountType=CUSTOMER`,
      {
        headers: __headers,
        responseType: 'json',
      });

		return this.http.request<any>(req)
			.pipe(
				map((res: any) => res.body),
        tap(_r => {
          console.log('BRAND NEW API: ', _r)
        }),
      );
    }
}