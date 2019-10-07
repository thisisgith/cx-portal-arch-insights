import { TestBed, inject } from '@angular/core/testing';
import { RegisterCollectorService } from './register-collector.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { SetupIEStateService } from '../setup-ie-state.service';

describe('RegisterCollectorService', () => {
	let stateService: SetupIEStateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				RegisterCollectorService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
		stateService = TestBed.get(SetupIEStateService);
		stateService.clearState();
		stateService.setState({ collectorIP: '127.0.0.1', collectorToken: 'token' });
	});

	it(
		'should be created',
		inject([RegisterCollectorService],
		(service: RegisterCollectorService) => {
			expect(service)
				.toBeTruthy();
		}),
	);

	it(
		'should get an auth token',
		inject(
			[RegisterCollectorService, HttpTestingController],
			(
				service: RegisterCollectorService,
				httpMock: HttpTestingController,
			) => {
				service.getAuthToken({ userId: 'kbushnick', password: 'Admin@123' })
					.subscribe(response => {
						expect(response)
							.toEqual('token');
					});
				const req = httpMock
					.expectOne('https://127.0.0.1/ie-commonapi/services/authToken');

				req.flush('token');
			}),
	);

	it(
		'should install and register dnac',
		inject(
			[RegisterCollectorService, HttpTestingController],
			(
				service: RegisterCollectorService,
				httpMock: HttpTestingController,
			) => {
				service.installAndRegisterDNAC({
					dnacIP: '127.0.0.1',
					password: 'Admin@123',
					username: 'kbushnick',
				})
					.subscribe(response => {
						expect(response)
							.toEqual('token');
					});
				const req = httpMock
					.expectOne('https://127.0.0.1/ie-commonapi/services/installAndRegisterDNAC');

				req.flush('token');
			}),
	);

	it(
		'should register online',
		inject(
			[RegisterCollectorService, HttpTestingController],
			(
				service: RegisterCollectorService,
				httpMock: HttpTestingController,
			) => {
				service.registerOnline({
					oldPassword: 'Admin@1234',
					password: 'Admin@123',
				}, new Blob())
					.subscribe(response => {
						expect(response)
							.toEqual('token');
					});
				const req = httpMock
					.expectOne('https://127.0.0.1/ie-commonapi/services/registerOnline');

				req.flush('token');
			}),
	);

	it(
		'should check registration status',
		inject(
			[RegisterCollectorService, HttpTestingController],
			(
				service: RegisterCollectorService,
				httpMock: HttpTestingController,
			) => {
				service.getStatus()
					.subscribe(response => {
						expect(response)
							.toEqual('token');
					});
				const req = httpMock
					.expectOne('https://127.0.0.1/ie-commonapi/services/status');

				req.flush('token');
			}),
	);
});
