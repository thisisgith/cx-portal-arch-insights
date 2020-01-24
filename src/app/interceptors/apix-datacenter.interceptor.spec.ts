
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHeaders, HttpParams, HttpHandler, HttpEvent } from '@angular/common/http';
import { environment } from '@environment';
import { from, Observable } from 'rxjs';
import { ApixDatacenterInterceptor } from './apix-datacenter.interceptor';
import { UserResolve } from '@utilities';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';

describe('ApixDatacenterInterceptor', () => {
	const urlPrefix = 'url/';
	const regionValue = 'usa';
	const req: HttpRequest<any> = {
		url: `${urlPrefix}${environment.datacenterStub}`,
		body: { },
		headers: new HttpHeaders(),
		reportProgress: true,
		withCredentials: false,
		responseType: 'json',
		method: '1',
		params: new HttpParams(),
		urlWithParams: 'url',
		serializeBody: () => '',
		detectContentTypeHeader: () => '',
		clone: () => Object.assign({ }, req),
	};

	const next: HttpHandler = {
		handle: () => new Observable<HttpEvent<any>>(),
	};

	let apixDatacenterInterceptor: ApixDatacenterInterceptor;
	let apixIdentityService: ApixIdentityService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [
				ApixDatacenterInterceptor,
				{
					provide: UserResolve,
					useValue: {
						getDataCenter: () => from([regionValue]),
						getUserSelectedDataCenter: () => from([regionValue]),
					},
				},
				{
					provide: ApixIdentityService,
					useValue: {
						testOrigin: (_url: any) => OriginType.SDP,
					},
				},
			],
		});
		apixDatacenterInterceptor = TestBed.get(ApixDatacenterInterceptor);
		apixIdentityService = TestBed.get(ApixIdentityService);
	});

	it('should add datacenter value for SDP origin APIs', () => {
		spyOn(req, 'clone');

		const modifiedRequest = {
			url: `${urlPrefix}${regionValue}`,
		};

		apixDatacenterInterceptor.intercept(req, next)
		.subscribe();

		expect(req.clone)
			.toHaveBeenCalledWith(modifiedRequest);
	});

	it('should ignore an RMA APIx http request', () => {
		apixIdentityService.testOrigin = (_url: any) => OriginType.RMA;

		spyOn(next, 'handle')
			.and
			.callThrough();

		apixDatacenterInterceptor.intercept(req, next)
		.subscribe();

		expect(next.handle)
			.toHaveBeenCalledWith(req);
	});
});
