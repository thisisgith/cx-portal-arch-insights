import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UserResolve } from '../utilities/user-resolve';
import { mergeMap, take, takeUntil } from 'rxjs/operators';
import { environment } from '@environment';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType, DEFAULT_DATACENTER } from '@constants';

export class ApixDatacenterInterceptor implements HttpInterceptor {

	private dataCenter: string;
	private destroyed$: Subject<void> = new Subject<void>();
	constructor (
		private userResolve: UserResolve,
		private apixIdentityService: ApixIdentityService,
	) {
		this.userResolve.getUserSelectedDataCenter()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe(dataCenter => {
			this.dataCenter = dataCenter;
		});
	 }

	/**
	 * This interceptor is responsible to replace the region stub with proper region specific
	 * text to construct region specific URLs (Only for SDP origin APIs)
	 * @param req Original request object
	 * @param next HTTP request handler
	 * @returns http event next
	 */
	public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const url = new URL(req.url, environment.origin);

		if (this.apixIdentityService.testOrigin(url) === OriginType.PITSTOP) {
			const request = req.clone({
				url: req.url.replace(environment.datacenterStub, DEFAULT_DATACENTER),
			});

			return next.handle(request);
		}

		if (this.apixIdentityService.testOrigin(url) !== OriginType.SDP) {
			return next.handle(req);
		}

		return this.userResolve.getDataCenter()
		.pipe(
			take(1),
			mergeMap(dcLocation => {
				const dataCenter = this.dataCenter === dcLocation ? dcLocation : this.dataCenter;
				const request = req.clone({
					url: req.url.replace(environment.datacenterStub, dataCenter),
				});

				return next.handle(request);
			}),
		);
	}
}
