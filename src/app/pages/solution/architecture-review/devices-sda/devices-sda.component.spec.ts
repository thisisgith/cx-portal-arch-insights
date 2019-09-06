import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { DevicesSdaComponent } from './devices-sda.component';
import { DevicesSdaModule } from './devices-sda.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureReviewService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { user, ArchitectureReviewScenarios } from '@mock';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('DevicesSdaComponent', () => {
	let component: DevicesSdaComponent;
	let fixture: ComponentFixture<DevicesSdaComponent>;
	let service: ArchitectureReviewService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				DevicesSdaModule,
				HttpClientTestingModule,
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
				}, ArchitectureReviewService,
			],
		});
	});

	beforeEach(async(() => {
		service = TestBed.get(ArchitectureReviewService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSdaComponent);
		component = fixture.componentInstance;
		fixture = TestBed.createComponent(DevicesSdaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should check for invalidResponseHandler', () => {
		component.inValidResponseHandler();
		expect(component.sdaVersion)
		.toEqual('');
		expect(component.isLoading)
		.toBeFalsy();
		expect(component.deviceDetails)
		.toBeNull();
		expect(component.totalItems)
		.toEqual(0);
	});

	it('should call deviceDetails on change', () => {
		component.ngOnChanges();
		fixture.detectChanges();
		component.deviceDetails = {
			ipAddress: '1.1.1.1',
			recommendedVersions: 'recommended, versions',
		};

		component.ngOnChanges();
		expect(component.isLoading)
		.toBeTruthy();
	});

	it('should call getDevicesSDA service', () => {
		spyOn(service, 'getDevicesSDAResponse')
		.and
		.returnValue(of(<any> ArchitectureReviewScenarios[2].scenarios.POST[0].response.body));

		component.getSdaDeviceData();
		expect(service.getDevicesSDAResponse)
		.toHaveBeenCalled();
	});

	it('should throw errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getDevicesSDA')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
		);
		component.getSdaDeviceData();
		expect(component.sdaVersion)
		.toEqual('');
	});
});
