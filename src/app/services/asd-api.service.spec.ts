import { TestBed, async, inject } from '@angular/core/testing';
import {
	ASDAPIService,
	GET_METADATA_PATH,
	GET_DOWNLOAD_PATH,
	ACCEPT_EULA_PATH,
	ACCEPT_K9_PATH,
} from './asd-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment';
import {
	ASDImageDownloadUrlScenarios,
	ASDMetadataScenarios,
	ASDTokenScenarios,
} from '@mock';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

environment.ieSetup.mockASD = false;

describe('ASDAPIService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				ASDAPIService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	it('should be created', inject([ASDAPIService], (service: ASDAPIService) => {
		expect(service)
			.toBeTruthy();
	}));

	it(
		'should get metadata',
		async(inject(
			[ASDAPIService, HttpTestingController],
			(service: ASDAPIService, httpMock: HttpTestingController) => {
				const sub1 = service.getMetadata()
					.pipe(catchError(() => empty()))
					.subscribe(() => {
						sub1.unsubscribe();
					});
				const tokenReq = httpMock
					.expectOne(environment.ieSetup.asdAuthURL);
				expect(tokenReq.request.method)
					.toEqual('GET');
				tokenReq.flush(ASDTokenScenarios[0].scenarios.GET[0].response.body);
				let mdReq = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${GET_METADATA_PATH}`);
				mdReq.flush(ASDMetadataScenarios[0].scenarios.GET[0].response.body);

				const sub2 = service.getMetadata()
					.pipe(catchError(() => empty()))
					.subscribe(() => {
						sub2.unsubscribe();
					});
				mdReq = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${GET_METADATA_PATH}`);
				mdReq.flush(ASDMetadataScenarios[0].scenarios.GET[0].response.body);
			})),
	);

	it(
		'should get download url',
		async(inject(
			[ASDAPIService, HttpTestingController],
			(service: ASDAPIService, httpMock: HttpTestingController) => {
				const sub = service.getDownloadURL('<metadata_trans_id>', '<ImageGUID>')
					.pipe(catchError(() => empty()))
					.subscribe(() => {
						sub.unsubscribe();
					});
				const tokenReq = httpMock
					.expectOne(environment.ieSetup.asdAuthURL);
				expect(tokenReq.request.method)
					.toEqual('GET');
				tokenReq.flush(ASDTokenScenarios[0].scenarios.GET[0].response.body);
				const req = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${GET_DOWNLOAD_PATH}`);
				req.flush(ASDImageDownloadUrlScenarios[0].scenarios.GET[0].response.body);
			})),
	);

	it(
		'should accept K9',
		async(inject(
			[ASDAPIService, HttpTestingController],
			(service: ASDAPIService, httpMock: HttpTestingController) => {
				const sub = service.acceptK9('GOV_OR_MIL', 'test', 'Yes')
					.pipe(catchError(() => empty()))
					.subscribe(() => {
						sub.unsubscribe();
					});
				const tokenReq = httpMock
					.expectOne(environment.ieSetup.asdAuthURL);
				expect(tokenReq.request.method)
					.toEqual('GET');
				tokenReq.flush(ASDTokenScenarios[0].scenarios.GET[0].response.body);
				const req = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${ACCEPT_K9_PATH}${'?business' +
						'_div_function=GOV_OR_MIL&confirmation=' +
						'Confirm_Checked&download_session_id=test' +
						'&user_action=Accepted&' +
						'gov_mil_defense_contractor=Yes'}`);
				req.flush(ASDImageDownloadUrlScenarios[0].scenarios.GET[0].response.body);
			})),
	);

	it(
		'should accept EULA',
		async(inject(
			[ASDAPIService, HttpTestingController],
			(service: ASDAPIService, httpMock: HttpTestingController) => {
				const sub = service.acceptEULA('test')
					.pipe(catchError(() => empty()))
					.subscribe(() => {
						sub.unsubscribe();
					});
				const tokenReq = httpMock
					.expectOne(environment.ieSetup.asdAuthURL);
				expect(tokenReq.request.method)
					.toEqual('GET');
				tokenReq.flush(ASDTokenScenarios[0].scenarios.GET[0].response.body);
				const req = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${ACCEPT_EULA_PATH}${'?download' +
							'_session_id=test&user_action=Accepted'}`);
				req.flush(ASDImageDownloadUrlScenarios[0].scenarios.GET[0].response.body);
			})),
	);

	it(
		'should retry with new bearer token',
		async(inject(
			[ASDAPIService, HttpTestingController],
			(service: ASDAPIService, httpMock: HttpTestingController) => {
				let i = 0;
				const sub1 = service.acceptEULA('test')
					.pipe(catchError(() => empty()))
					.subscribe(() => {
						if (i === 1) {
							sub1.unsubscribe();
						}
						i += 1;
					});
				const tokenReq1 = httpMock
					.expectOne(environment.ieSetup.asdAuthURL);
				expect(tokenReq1.request.method)
					.toEqual('GET');
				tokenReq1.flush(ASDTokenScenarios[0].scenarios.GET[0].response.body);
				const req1 = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${ACCEPT_EULA_PATH}${'?download' +
						'_session_id=test&user_action=Accepted'}`);
				req1.error(new ErrorEvent('401'), { status: 401, statusText: 'Bad Request' });

				const tokenReq = httpMock
					.expectOne(environment.ieSetup.asdAuthURL);
				expect(tokenReq.request.method)
					.toEqual('GET');
				tokenReq.flush(ASDTokenScenarios[0].scenarios.GET[0].response.body);
				const req = httpMock
					.expectOne(`${environment.ieSetup.asdBaseURL}${ACCEPT_EULA_PATH}${'?download' +
						'_session_id=test&user_action=Accepted'}`);
				req.error(new ErrorEvent('401'), { status: 401, statusText: 'Bad Request' });
			})),
	);
});
