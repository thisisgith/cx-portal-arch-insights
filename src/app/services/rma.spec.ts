import { TestBed, inject } from '@angular/core/testing';

import { RMAService } from './rma';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment';
import { RMAResponse } from '@interfaces';
import { RMAScenarios } from '@mock';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

describe('RMAService', () => {
	const testRmaNumber = '800000000';
	const testUrl = `${
		environment.services.rma.origin
	}${
		environment.services.rma.paths.returns
	}/rma_numbers/${testRmaNumber}`;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				RMAService,
			],
		});
	});

	it('should be created', inject([RMAService], (service: RMAService) => {
		expect(service)
			.toBeTruthy();
	}));
	it(
		'should call the expected API and resolve the expected data',
		inject(
			[RMAService, HttpTestingController],
			(service: RMAService, httpMock: HttpTestingController,
		) => {
				const successfulResponse = RMAScenarios[0].scenarios.GET[0].response.body;
				service.getByNumber(testRmaNumber)
					.subscribe((response: RMAResponse) => {
						expect(response)
							.toEqual(successfulResponse);
					});

				const req = httpMock.expectOne(testUrl);
				expect(req.request.method)
					.toEqual('GET');

				req.flush(successfulResponse);
			}),
	);

	it(
		'should throw an error with a 200OK APIError response',
		inject(
			[RMAService, HttpTestingController],
			(service: RMAService, httpMock: HttpTestingController,
		) => {
				const failedResponse = RMAScenarios[0].scenarios.GET[3].response.body;
				service.getByNumber(testRmaNumber)
					.pipe(catchError((err: Error) => {
						expect(err.message)
							.toEqual('APIError');

						return of(null);
					}))
					.subscribe();

				const req = httpMock.expectOne(testUrl);
				expect(req.request.method)
					.toEqual('GET');

				req.flush(failedResponse);
			}),
	);
});
