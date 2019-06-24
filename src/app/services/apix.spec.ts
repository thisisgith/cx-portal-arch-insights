import { TestBed, inject } from '@angular/core/testing';

import { APIxService, ITokenSubject } from './apix';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment';
import { AsyncSubject } from 'rxjs';

describe('APIxService', () => {
	const clientId = '1';
	const testUrl = `${environment.auth.ciscoTokenUrl}/${clientId}`;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				APIxService,
			],
		});
	});

	it('should be created', inject([APIxService], (service: APIxService) => {
		expect(service)
			.toBeTruthy();
	}));

	it(
		'should fetch a token from backend if one isn\'t cached',
		inject(
			[APIxService, HttpTestingController],
			(service: APIxService, httpMock: HttpTestingController) => {
				const successfulResponse = {
					expiration: '3599',
					token: 'success',
				};

				service.getToken(clientId)
					.subscribe((response: string) => {
						expect(response)
							.toEqual('success');
					});

				const req = httpMock.expectOne(testUrl);
				expect(req.request.method)
					.toEqual('GET');

				req.flush(successfulResponse);
			}),
	);

	it(
		'should return a cached token if one exists',
		inject(
			[APIxService],
			(service: APIxService) => {
				const token: ITokenSubject = {
					dateCreated: Date.now(),
					expiration: '3599',
					subject: <AsyncSubject<string>> new AsyncSubject(),
				};
				token.subject.next('cached_token');
				token.subject.complete();
				service.tokens[clientId] = token;

				service.getToken(clientId)
					.subscribe((response: string) => {
						expect(response)
							.toEqual('cached_token');
					});
			}),
	);

	it(
		'should fetch a new token if the cached token is too old',
		inject(
			[APIxService, HttpTestingController],
			(service: APIxService, httpMock: HttpTestingController) => {
				const successfulResponse = {
					expiration: '3599',
					token: 'new_token',
				};
				const token: ITokenSubject = {
					dateCreated: Date.now(),
					expiration: '-1',
					subject: <AsyncSubject<string>> new AsyncSubject(),
				};
				token.subject.next('cached_token');
				token.subject.complete();
				service.tokens[clientId] = token;

				service.getToken(clientId)
					.subscribe((response: string) => {
						expect(response)
							.toEqual('new_token');
					});

				const req = httpMock.expectOne(testUrl);
				expect(req.request.method)
					.toEqual('GET');

				req.flush(successfulResponse);
			}),
	);

	it(
		'should not make a second request if one is already in progress',
		inject(
			[APIxService],
			(service: APIxService) => {
				const token: ITokenSubject = {
					expiration: '-1',
					subject: <AsyncSubject<string>> new AsyncSubject(),
				};
				token.subject.next('cached_token');
				token.subject.complete();
				service.tokens[clientId] = token;

				service.getToken(clientId)
					.subscribe((response: string) => {
						expect(response)
							.toEqual('cached_token');
					});
			}),
	);
});
