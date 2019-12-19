import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResolve } from '../utilities/user-resolve';
import { mergeMap, take } from 'rxjs/operators';
import { environment } from '@environment';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';

export class ApixDatacenterInterceptor implements HttpInterceptor {

	constructor (
		private userResolve: UserResolve,
		private apixIdentityService: ApixIdentityService,
	) { }

	/**
	 * This interceptor is responsible to replace the region stub with proper region specific
	 * text to construct region specific URLs (Only for SDP origin APIs)
	 * @param req Original request object
	 * @param next HTTP request handler
	 * @returns http event next
	 */
	public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const url = new URL(req.url, environment.origin);

		if (this.apixIdentityService.testOrigin(url) !== OriginType.SDP) {
			return next.handle(req);
		}

		return this.userResolve.getDataCenter()
		.pipe(
			take(1),
			mergeMap(dcLocation => {
				// this if conditions should be removed once backend fix is in place
				if (dcLocation === 'Not Configured') {
					return next.handle(req);
				}

				const request = req.clone({
					url: req.url.replace(environment.datacenterStub, dcLocation),
				});

				return next.handle(request);
			}),
		);
	}
}
