import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DnacDetailsComponent } from './dnac-details.component';
import { DnacDetailsModule } from './dnac-details.module';
import { ArchitectureReviewService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';
describe('DnacDetailsComponent', () => {
	let component: DnacDetailsComponent;
	let fixture: ComponentFixture<DnacDetailsComponent>;
	let service: ArchitectureReviewService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DnacDetailsModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
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
		})
			.compileComponents();
	}));

	beforeEach(async(() => {
		service = TestBed.get(ArchitectureReviewService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DnacDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call deviceDetails on change', () => {
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.params.dnacIp)
			.toBeDefined();
		expect(component.isLoading)
			.toBeTruthy();
	});

	it('should call getDnacList', () => {

		const response = {
			'End Points':
			{
				Label: 'End Points',
				Published: '0',
				PublishedLimit: '2000',
			},
			Fabrics:
			{
				Label: 'Fabrics',
				Published: '0',
				PublishedLimit: '2000',
			},
			'Network Devices':
			{
				Label: 'Network Devices',
				Published: '0',
				PublishedLimit: '2000',
			},
			WLC:
			{
				Label: 'WLC',
				Published: '0',
				PublishedLimit: '2000',
			},
		};

		jest.spyOn(service, 'getDnacList')
			.mockReturnValue(of(response));
		component.getNetworkDevicesCount();
		expect(service.getDnacList)
			.toHaveBeenCalled();
	});

	it('should not call getDnacList', () => {

		jest.spyOn(service, 'getDnacList')
			.mockReturnValue(of([]));
		component.getNetworkDevicesCount();
		expect(service.getDnacList)
			.toHaveBeenCalled();
	});

	it('should throw errors', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(service, 'getDnacList')
			.mockReturnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getNetworkDevicesCount();
		tick();
		expect(component.getNetworkDevicesCount)
			.toThrowError();
	}));

});
