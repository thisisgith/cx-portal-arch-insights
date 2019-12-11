import { TestBed } from '@angular/core/testing';
import { APIxService } from '@services';
import { ApixAuthInterceptor } from './apix-auth.interceptor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { from, Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHeaders, HttpParams, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';

describe('APIxAuthIntercetptor', () => {
	const req: HttpRequest<any> = {
		url: 'url',
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

	const SDP_TOKEN_VALUE = '12345';
	const RMA_TOKEN_VALUE = '54321';

	let apixAuthInterceptor: ApixAuthInterceptor;
	let apixIdentityService: ApixIdentityService;
	let apixService: APIxService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [
				ApixAuthInterceptor,
				{
					provide: ApixIdentityService,
					useValue: {
						testOrigin: (_url: any) => OriginType.SDP,
					},
				},
				{
					provide: APIxService,
					useValue: {
						getToken: (_clientId: string) => from([SDP_TOKEN_VALUE]),
					},
				},
			],
		});
		apixAuthInterceptor = TestBed.get(ApixAuthInterceptor);
		apixIdentityService = TestBed.get(ApixIdentityService);
		apixService = TestBed.get(APIxService);
	});

	it('should attach auth token for SDP origin APIs', () => {
		spyOn(req, 'clone');
		const retValue = {
			headers: new HttpHeaders().set('authorization', `Bearer ${SDP_TOKEN_VALUE}`),
		};
		apixAuthInterceptor.intercept(req, next)
		.subscribe();

		expect(req.clone)
			.toHaveBeenCalledWith(retValue);
	});

	it('should attach auth token for RMA origin APIs', () => {
		apixIdentityService.testOrigin = (_url: any) => OriginType.RMA;
		apixService.getToken = (_clientId: string) => from([RMA_TOKEN_VALUE]);

		spyOn(req, 'clone');
		const retValue = {
			headers: new HttpHeaders().set('authorization', `Bearer ${RMA_TOKEN_VALUE}`),
		};
		apixAuthInterceptor.intercept(req, next)
		.subscribe();

		expect(req.clone)
			.toHaveBeenCalledWith(retValue);
	});

	it('should ignore non-SDP / non-RMA origin API requests', () => {
		apixIdentityService.testOrigin = (_url: any) => OriginType.NONE;
		spyOn(next, 'handle')
			.and
			.callThrough();

		apixAuthInterceptor.intercept(req, next)
		.subscribe();

		expect(next.handle)
			.toHaveBeenCalledWith(req);
	});

	it('should call apollo origin API requests', () => {
		apixAuthInterceptor.cwayToken = 'Bearer 764535';
		apixAuthInterceptor.isRefershingCwayToken = true;
		apixIdentityService.testOrigin = (_url: any) => OriginType.APOLLO;
		spyOn(next, 'handle')
			.and
			.returnValue(throwError(new HttpErrorResponse({ status: 401 })));
		apixAuthInterceptor.intercept(req, next)
		.subscribe();
	});
});
