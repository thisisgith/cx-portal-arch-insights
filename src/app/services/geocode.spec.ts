import { TestBed, inject } from '@angular/core/testing';

import { GeoCodeService } from './geocode';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment';

describe('GeoCodeService', () => {
	const address = '123 Main Street, North Carolina';
	const url = `${
		environment.mapboxHost}${environment.mapboxForwardGeocodePath
	}/${address}.json?limit=1&access_token=${environment.mapboxToken}`;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				GeoCodeService,
			],
		});
	});

	it('should be created', inject([GeoCodeService], (service: GeoCodeService) => {
		expect(service)
			.toBeTruthy();
	}));

	it(
		'should fetch geocode from backend if one isn\'t cached',
		inject(
			[GeoCodeService, HttpTestingController],
			(service: GeoCodeService, httpMock: HttpTestingController) => {
				service.forwardLookup(address)
					.subscribe();
				const req = httpMock.expectOne(url);
				expect(req.request.method)
					.toEqual('GET');
			}),
	);

	it(
		'should return a cached geocode one exists',
		inject(
			[GeoCodeService, HttpTestingController],
			(service: GeoCodeService, httpMock: HttpTestingController) => {
				service.forwardLookup(address)
					.subscribe();
				const req = httpMock.expectOne(url);
				expect(req.request.method)
					.toEqual('GET');

				req.flush('success');

				service.forwardLookup(address)
					.subscribe(res => {
						expect(<any> res)
							.toBe('success');
					});

				httpMock.expectNone(url);
			}),
	);
});
