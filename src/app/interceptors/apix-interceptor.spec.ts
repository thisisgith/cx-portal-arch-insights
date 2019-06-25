import { TestBed, inject } from '@angular/core/testing';

import { RMAService, APIxService } from '@services';
import { InventoryModule, InventoryService } from '@cui-x/sdp-api';
import { APIxInterceptor } from './apix-interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment';
import { RMAScenarios, HardwareScenarios } from '@mock';
import { AsyncSubject } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('RMAService', () => {
	const testRmaNumber = '800000000';
	const rmaUrl = `${
		environment.services.rma.origin
	}${
		environment.services.rma.paths.returns
	}/rma_numbers/${testRmaNumber}`;
	const customerId = '2431199';
	const sdpUrl = `${
		environment.services.sdp.origin
	}/api/customerportal/inventory/v1/hardware?customerId=${customerId}`;
	let apixService: APIxService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				InventoryModule.forRoot({ rootUrl: environment.services.sdp.origin }),
			],
			providers: [
				RMAService,
				APIxService,
				{
					multi: true,
					provide: HTTP_INTERCEPTORS,
					useClass: APIxInterceptor,
				},
			],
		});
		apixService = TestBed.get(APIxService);
		apixService.tokens[environment.services.rma.clientId] = {
			dateCreated: Date.now(),
			expiration: '3599',
			subject: <AsyncSubject<string>> new AsyncSubject(),
		};
		apixService.tokens[environment.services.rma.clientId].subject.next('rma_auth_token');
		apixService.tokens[environment.services.rma.clientId].subject.complete();
		apixService.tokens[environment.services.sdp.clientId] = {
			dateCreated: Date.now(),
			expiration: '3599',
			subject: <AsyncSubject<string>> new AsyncSubject(),
		};
		apixService.tokens[environment.services.sdp.clientId].subject.next('sdp_auth_token');
		apixService.tokens[environment.services.sdp.clientId].subject.complete();
	});

	it(
		'should attach a token to an RMA APIx http request',
		inject(
			[RMAService, HttpTestingController],
			(rmaService: RMAService, httpMock: HttpTestingController) => {
				const successfulResponse = RMAScenarios[0].scenarios.GET[0].response.body;
				rmaService.getByNumber(testRmaNumber)
					.subscribe();

				const req = httpMock.expectOne(rmaUrl);
				expect(req.request.headers.has('Authorization'))
					.toEqual(true);
				expect(req.request.headers.get('Authorization'))
					.toEqual('Bearer rma_auth_token');

				req.flush(successfulResponse);
			}),
	);

	it(
		'should attach a token to an SDP APIx http request',
		inject(
			[InventoryService, HttpTestingController],
			(inventoryService: InventoryService, httpMock: HttpTestingController) => {
				const successfulResponse = HardwareScenarios[0].scenarios.GET[0].response.body;

				inventoryService.getHardware({ customerId })
					.subscribe();

				const req = httpMock.expectOne(sdpUrl);
				expect(req.request.headers.has('Authorization'))
					.toEqual(true);
				expect(req.request.headers.get('Authorization'))
					.toEqual('Bearer sdp_auth_token');

				req.flush(successfulResponse);
			}),
	);

	it(
		'should not attach a token to a non-APIx request',
		inject(
			[HttpTestingController],
			(httpMock: HttpTestingController) => {
				const successfulResponse = {
					expiration: '3599',
					token: 'success',
				};

				apixService.getToken('fakeId')
					.subscribe();

				const req = httpMock.expectOne(`${environment.auth.ciscoTokenUrl}/fakeId`);
				expect(req.request.headers.has('Authorization'))
					.toEqual(false);

				req.flush(successfulResponse);
			}),
	);
});