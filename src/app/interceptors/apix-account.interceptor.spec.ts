import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpHeaders, HttpParams, HttpEvent, HttpHandler } from '@angular/common/http';
import { RMAService, APIxService, RacetrackInfoService } from '@services';
import { ApixAccountInterceptor } from './apix-account.interceptor';
import { Observable, from } from 'rxjs';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType, USER_INFO_KEYS } from '@constants';
import { UserResolve } from '@utilities';

describe('APIxAccountInterceptor', () => {
	const SAID_VALUE = '12345';
	const VAID_VALUE = '0';
	const CUSTOMERID_VALUE = '12345_0';
	const USECASE_VALUE = 'Campus Connect';
	const SOLUTION_VALUE = 'IBN';
	const CXLEVEL_VALUE = 1;

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

	let apixAccountInterceptor: ApixAccountInterceptor;
	let apixIdentityService: ApixIdentityService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [
				RMAService,
				APIxService,
				ApixAccountInterceptor,
				{
					provide: ApixIdentityService,
					useValue: {
						testOrigin: (_url: any) => OriginType.SDP,
					},
				},
				{
					provide: UserResolve,
					useValue: {
						getSaId: () => from([SAID_VALUE]),
						getVaId: () => from([VAID_VALUE]),
						getCustomerId: () => from([CUSTOMERID_VALUE]),
						getCXLevel: () => from([CXLEVEL_VALUE]),
					},
				},
				{
					provide: RacetrackInfoService,
					useValue: {
						getCurrentTechnology: () => from([
							{
								name: USECASE_VALUE,
							},
						]),
						getCurrentSolution: () => from([
							{
								name: SOLUTION_VALUE,
							},
						]),
						getPitStopApiFailure: () => from([]),
					},
				},
			],
		});
		apixAccountInterceptor = TestBed.get(ApixAccountInterceptor);
		apixIdentityService = TestBed.get(ApixIdentityService);
	});

	it('should add user / account information as headers and params for SDP origin APIs', () => {

		jest.spyOn(req, 'clone');

		const retValue = {
			setHeaders: {
				[USER_INFO_KEYS.SAID]: SAID_VALUE,
				[USER_INFO_KEYS.CUSTOMERID]: CUSTOMERID_VALUE,
				[USER_INFO_KEYS.USECASE]: USECASE_VALUE,
				[USER_INFO_KEYS.SOLUTION]: SOLUTION_VALUE,
				[USER_INFO_KEYS.CXLEVEL]: CXLEVEL_VALUE.toString(),
			},
			setParams: {
				[USER_INFO_KEYS.SAID]: SAID_VALUE,
				[USER_INFO_KEYS.CUSTOMERID]: CUSTOMERID_VALUE,
				[USER_INFO_KEYS.USECASE]: USECASE_VALUE,
				[USER_INFO_KEYS.SOLUTION]: SOLUTION_VALUE,
				[USER_INFO_KEYS.CXLEVEL]: CXLEVEL_VALUE.toString(),
			},
		};
		apixAccountInterceptor.intercept(req, next)
		.subscribe();

		expect(req.clone)
			.toHaveBeenCalledWith(retValue);
	});

	it('should ignore non-SDP origin APIs', () => {
		apixIdentityService.testOrigin = (_url: any) => OriginType.RMA;

		jest.spyOn(next, 'handle');

		apixAccountInterceptor.intercept(req, next)
		.subscribe();

		expect(next.handle)
			.toHaveBeenCalledWith(req);
	});

});
