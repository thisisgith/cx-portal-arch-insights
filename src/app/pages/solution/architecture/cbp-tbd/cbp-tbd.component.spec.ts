import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpTbdComponent } from './cbp-tbd.component';
import { CbpTbdModule } from './cbp-tbd.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { user } from '@mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

describe('CbpTbdComponent', () => {
	let component: CbpTbdComponent;
	let fixture: ComponentFixture<CbpTbdComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpTbdModule,
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
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getAllCBPExceptionDetails')
			.and
			.returnValue(of({ exceptionDatas: [] }));
		fixture = TestBed.createComponent(CbpTbdComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getAllCBPExceptionDetails', () => {
		component.getData();
		expect(service.getAllCBPExceptionDetails)
			.toHaveBeenCalled();
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getAllCBPExceptionDetails')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
		);
		component.getData();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit : 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.params.page)
		.toBe(1);
	});
});
