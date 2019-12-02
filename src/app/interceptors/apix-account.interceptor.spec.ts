import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpHeaders, HttpParams, HttpEvent } from '@angular/common/http';
import { InventoryModule } from '@sdp-api';
import { environment } from '@environment';
import { RMAService, APIxService, RacetrackInfoService } from '@services';
import { ApixAccountInterceptor } from './apix-account.interceptor';
import { Observable, from } from 'rxjs';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';
import { UserResolve } from '@utilities';

describe('APIxAccountInterceptor', () => {
	let apixAccountInterceptor: ApixAccountInterceptor;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				InventoryModule.forRoot({
					rootUrl: environment.sdpServiceOrigin + environment.sdpServiceBasePath,
				}),
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
						getSaId: () => from(['12345']),
						getCustomerId: () => from(['12345_0']),
						getCXLevel: () => from([1]),
					},
				},
				{
					provide: RacetrackInfoService,
					useValue: {
						getCurrentTechnology: () => from([
							{
								name: 'campus connect',
							},
						]),
						getCurrentSolution: () => from([
							{
								name: 'IBN',
							},
						]),
					},
				},
			],
		});
		apixAccountInterceptor = TestBed.get(ApixAccountInterceptor);
	});

	it('should call getUserInfo for a non-ignored SDP origin API', () => {
		const req: HttpRequest<any> = {
			url: 'https://api-stage.cisco.com/api/customerportal/inventory/v1/assets/system',
			body: { },
			headers: new HttpHeaders(),
			reportProgress: true,
			withCredentials: false,
			responseType: 'json',
			method: '1',
			params: new HttpParams(),
			urlWithParams: 'https://api-stage.cisco.com/api/customerportal/inventory/v1/assets/system?customerId=12345',
			serializeBody: () => '',
			detectContentTypeHeader: () => '',
			clone: undefined,
		};
		apixAccountInterceptor.intercept(req, {
			handle: () => new Observable<HttpEvent<any>>(),
		});

		/* tslint:disable:no-string-literal */
		apixAccountInterceptor['getUserInfo'](req)
		.subscribe();
	});
});
