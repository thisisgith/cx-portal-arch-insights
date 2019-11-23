import { environment } from '@environment';
import { user } from '@mock';
import { ApixIdentityService } from './apix-identity.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { OriginType } from '@constants';

describe('APIxIdentityService', () => {
	const testRmaNumber = '800000000';
	const rmaUrl = `${environment.rmaServiceOrigin}${environment.rmaServicePaths.returns}/rma_numbers/${testRmaNumber}`;

	const sdpUrl = `${environment.sdpServiceOrigin}${environment.sdpServiceBasePath}/customerportal/inventory/v1/hardware?` +
		`customerId=${user.info.customerId}`;

	let apixIdentityService: ApixIdentityService;
	let injector: TestBed;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ApixIdentityService],
		});

		injector = getTestBed();
		apixIdentityService = injector.get(ApixIdentityService);
	});

	it('should identify an SDP URL as SDP URL', () => {
		const url = new URL(sdpUrl, environment.origin);

		expect(apixIdentityService.testOrigin(url))
			.toEqual(OriginType.SDP);
	});

	it('should identify an RMA URL as RMA URL', () => {
		const url = new URL(rmaUrl, environment.origin);
		expect(apixIdentityService.testOrigin(url))
			.toEqual(OriginType.RMA);
	});

});
