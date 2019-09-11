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
		expect(component.params.dnacIP)
			.toBeDefined();
		expect(component.isLoading)
			.toBeTruthy();
	});

	it('should call getDnacList', () => {
		spyOn(service, 'getDnacList')
		.and
		.returnValue(of({ data: [] }));
		component.getNetworkDevicesCount();
		expect(service.getDnacList)
			.toHaveBeenCalled();
	});

	it('should throw errors', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getDnacList')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getNetworkDevicesCount();
		tick();
		expect(component.getNetworkDevicesCount)
			.toThrowError();
	}));

});
