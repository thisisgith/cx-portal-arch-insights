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
import { user } from '@mock';
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
			sdaNoOfMtuNonOptimalInterfaces: '2',
		};
		component.sdaSoftwareGridData = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fetch all data', () => {
		component.showL3Switch = false;
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
				sdaL3AccessEnabled: 'No',
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
		const nonOptimalLinksResponse = {
			dnacDeviceDetails: {
				mtuNonOptimalLinks: [
					{
						destinationDevice: '78654',
						destinationInterface: 'interface2',
						linkId: 'link1',
						linkStatus: 'UP',
						mtuValue: 1300,
						sourceDevice: '6767999',
						sourceInterface: 'interface1',
					},
				],
				totalCount: 2,
			},
		};

		jest.spyOn(architectureReviewService, 'getDevicesSDA')
			.mockReturnValue(of(fakeResponse));
		jest.spyOn(architectureReviewService, 'getOptimalLinks')
			.mockReturnValue(of(nonOptimalLinksResponse));
		component.ngOnChanges();
		fakeResponse.dnacDeviceDetails.sdaL3AccessEnabled = 'No';
		fakeResponse.dnacDeviceDetails.sdaRedundantLinks  = 'Yes';
		fakeResponse.dnacDeviceDetails.sdaNoOfMtuNonOptimalInterfaces = 2;
		const dnacDeviceDetails = nonOptimalLinksResponse.dnacDeviceDetails;
		fixture.detectChanges();
		expect(component.nonOptimalLinks)
		.toBeDefined();
		component.nonOptimalLinks = dnacDeviceDetails.mtuNonOptimalLinks;
		expect(component.showL3Switch)
		.toBeTruthy();
		expect(component.showSwitchRedundency)
		.toBeTruthy();
		expect(component.showSwitchInterface)
		.toBeTruthy();
		expect(component.noApiData)
		.toBeFalsy();
	});

	it('should fetch  data for sdaL3AccessEnabled', () => {
		component.showL3Switch = false;
		const fakeResponse = {
			 dnacDeviceDetails: {
				sdaL3AccessEnabled: 'Yes',
				sdaNoOfMtuNonOptimalInterfaces: 0,
				sdaRedundantLinks: 'No',
			},
		};

		jest.spyOn(architectureReviewService, 'getDevicesSDA')
			.mockReturnValue(of(fakeResponse));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.showL3Switch)
		.toBeFalsy();
	});
	it('should redirect to osv page', () => {
		component.callOsvPage();
		expect(component.osvCriteriaToEmit)
		.toBeDefined();
	});

	it('should check for error response', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(architectureReviewService, 'getDevicesSDA')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(architectureReviewService, 'getOptimalLinks')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		component.deviceDetails = {
			ipAddress: '192.168.46.100',
		};
		component.ngOnChanges();
	});

	it('should call deviceDetails on change', () => {
		jest.spyOn(component, 'getCollectionId');
		jest.spyOn(component, 'getSolutionInfo');
		jest.spyOn(component, 'getSdaDeviceData');
		jest.spyOn(component, 'getOptimalLinks');
		component.deviceDetails = {
			ipAddress: '192.168.46.100',
			sdaNoOfMtuNonOptimalInterfaces : '2',
		};
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.getCollectionId)
			.toBeDefined();
		expect(component.getSolutionInfo)
			.toBeDefined();
		expect(component.getSdaDeviceData)
			.toHaveBeenCalled();
		expect(component.getOptimalLinks)
			.toHaveBeenCalled();
	});

	it('should call when deviceDetails on change is undefined', () => {
		jest.spyOn(component, 'getCollectionId');
		jest.spyOn(component, 'getSolutionInfo');
		component.deviceDetails = undefined;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.getCollectionId)
			.not
			.toHaveBeenCalled();
		expect(component.getSolutionInfo)
			.not
			.toHaveBeenCalled();
	});

});
