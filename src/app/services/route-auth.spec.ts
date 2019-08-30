import { TestBed, inject } from '@angular/core/testing';

import { RouteAuthService } from './route-auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RccService', () => {
	const customerId = '1234';

	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientTestingModule],
		providers: [
			RouteAuthService,
		],
	}));

	fit('should be created', inject([RouteAuthService], (service: RouteAuthService) => {
		expect(service)
			.toBeTruthy();
	}));

	it('should be user permission', inject([RouteAuthService], (service: RouteAuthService) => {
		service.checkPermissions(customerId)
		.subscribe((response: any) => {
			expect(response)
				.toEqual(true);
		});
	}));
});
