import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { DevicesSdaComponent } from './devices-sda.component';
import { DevicesSdaModule } from './devices-sda.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureReviewService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { user, ArchitectureReviewScenarios } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';

describe('DevicesSdaComponent', () => {
	let component: DevicesSdaComponent;
	let fixture: ComponentFixture<DevicesSdaComponent>;
	let architectureReviewService: ArchitectureReviewService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				DevicesSdaModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,

			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		});
	});

	beforeEach(async(() => {
		architectureReviewService = TestBed.get(ArchitectureReviewService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSdaComponent);
		component = fixture.componentInstance;
		component.deviceDetails = {
			ipAddress: '192.168.46.100',
		};
		component.sdaSoftwareGridData = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fetch all data', () => {

		const fakeResponse = {
			 dnacDeviceDetails: {
				dnacVersion: '1.2',
				failedCriteria: [
					'We detected a software non-compliance for SDA.',
			  	],
				hardwareRecommendation: 'CX-9300L',
				hostName: 'AP70F3.5A7E.44C8',
				ipAddress: '192.168.46.100',
				sdaHardwareSupported: [
				  {
						deviceRole: 'controller',
						productFamily: ['Cisco Catalyst 9300 Series Switches',
							'Cisco Catalyst 9300 Series Switches'],
				  },
				],
				sdaL3AccessEnabled: 'Yes',
				sdaNoOfMtuNonOptimalInterfaces: 7,
				sdaRedundantLinks: 'Yes',
				sdaSoftwareSupported: [
				  {
						deviceRole: 'Fabric',
						productFamily: 'Cisco Catalyst 9400 Series Switches',
						software: [
							'IOS XE 16.10.1e',
							'IOS XE 16.11.1c',
							'AireOS 8.9.111.0',
							'AireOS 8.9.100.0',
							'AireOS 8.8.120.0',
							'AireOS 8.8.111.0',
							'AireOS 8.8.100.0',
							'AireOS 8.7.106.0',
							'AireOS 8.5.140.0',
							'AireOS 8.5.135.0',
						],
				  },
				  {
						deviceRole: 'Fabric Edge',
						productFamily: 'Cisco Catalyst 9300 Series Switches',
						software: [
							'IOS XE 16.10.1e',
							'IOS XE 16.11.1c',
							'AireOS 8.9.111.0',
							'AireOS 8.9.100.0',
							'AireOS 8.8.120.0',
							'AireOS 8.8.111.0',
						],
				  },
				],
				serialNumber: 'KWC21420A6L',
			},
		};
		spyOn(architectureReviewService, 'getDevicesSDA')
			.and
			.returnValue(of(fakeResponse));
		spyOn(architectureReviewService, 'getOptimalLinks')
			.and
			.returnValue(of(ArchitectureReviewScenarios[7].scenarios.GET[0].response.body));
		component.ngOnChanges();
		fakeResponse.dnacDeviceDetails.sdaL3AccessEnabled = '';
		fakeResponse.dnacDeviceDetails.sdaRedundantLinks  = '';
		fakeResponse.dnacDeviceDetails.sdaNoOfMtuNonOptimalInterfaces = 0;
		fixture.detectChanges();
		expect(component.nonOptimalLinks)
		.toBeDefined();
	});

	it('should check for error response', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(architectureReviewService, 'getDevicesSDA')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(architectureReviewService, 'getOptimalLinks')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.deviceDetails = {
			ipAddress: '192.168.46.100',
		};
		component.ngOnChanges();
	});

	it('should call deviceDetails on change', () => {
		spyOn(component, 'getCollectionId');
		component.deviceDetails = {
			ipAddress: '192.168.46.100',
		};
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.getCollectionId)
			.toBeDefined();
	});

	it('should call when deviceDetails on change is undefined', () => {
		spyOn(component, 'getCollectionId');
		component.deviceDetails = undefined;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.getCollectionId)
			.not
			.toHaveBeenCalled();
	});

	it('should be called on error response on getting collectionId', () => {
		spyOn(component, 'getCollectionId');
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(architectureReviewService, 'getCollectionId')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.detectChanges();
		expect(component.getCollectionId)
			.not
			.toHaveBeenCalled();
	});

});
