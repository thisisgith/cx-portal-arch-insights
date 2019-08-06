import { TestBed, inject } from '@angular/core/testing';
import { SetupIEService } from './setup-ie.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import { UserResolve } from '@utilities';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('SetupIEService', () => {
	let cpApi: ControlPointIERegistrationAPIService;
	let userResolve: UserResolve;
	let userSpy: jasmine.Spy;
	let dnacStatusSpy: jasmine.Spy;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				ControlPointIERegistrationAPIService,
				SetupIEService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
		cpApi = TestBed.get(ControlPointIERegistrationAPIService);
		userResolve = TestBed.get(UserResolve);
		dnacStatusSpy = spyOn(cpApi, 'getDnacStatusUsingGET')
			.and
			.returnValue(of({ dnacInstalled: true }));
		userSpy = spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('912834134'));
	});

	it('should be created', inject([SetupIEService], (service: SetupIEService) => {
		expect(service)
			.toBeTruthy();
	}));

	it(
		'should check for dnac status',
		inject(
			[SetupIEService, HttpTestingController],
			(service: SetupIEService) => {
				service.checkForDNAC()
					.subscribe((response: boolean) => {
						expect(userSpy)
							.toHaveBeenCalled();
						expect(dnacStatusSpy)
							.toHaveBeenCalled();
						expect(response)
							.toEqual(true);
					});
			}),
	);

	it(
		'should write to localStorage when DNAC is not setup',
		inject(
			[SetupIEService, HttpTestingController],
			(service: SetupIEService) => {
				dnacStatusSpy.and
					.returnValue(of({ dnacInstalled: false }));
				service.checkForDNAC()
					.subscribe((response: boolean) => {
						expect(userSpy)
							.toHaveBeenCalled();
						expect(dnacStatusSpy)
							.toHaveBeenCalled();
						expect(response)
							.toEqual(false);

						const hasDNAC = localStorage.getItem(environment.ieSetup.DNAC_LS_KEY);
						expect(hasDNAC)
							.not
							.toBeNull();
					});
			}),
	);

	it(
		'should try to ping a given ip address',
		inject(
			[SetupIEService, HttpTestingController],
			(service: SetupIEService, httpMock: HttpTestingController) => {
				const ipString = 'https://127.0.0.1';
				service.ping(ipString)
					.subscribe(() => {
						expect()
							.nothing();
					});
				const req = httpMock.expectOne(`${ipString}${environment.ieSetup.pingURL}`);
				req.flush({ });
			}),
	);

	it(
		'should try to download',
		inject(
			[SetupIEService, HttpTestingController],
			(service: SetupIEService, httpMock: HttpTestingController) => {
				const downloadURL = 'https://some.download.url';
				const resultBlob = new Blob();
				service.downloadFromUrl(downloadURL)
					.subscribe(result => {
						expect(result)
							.toBe(resultBlob);
					});
				const req = httpMock.expectOne(downloadURL);
				req.flush(resultBlob);
			}),
	);
});
