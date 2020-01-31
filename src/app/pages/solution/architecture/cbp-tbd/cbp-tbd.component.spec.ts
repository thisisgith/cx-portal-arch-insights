import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { user } from '@mock';
import { CbpTbdComponent } from './cbp-tbd.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CbpTbdModule } from './cbp-tbd.module';

describe('CbpTbdComponent', () => {
	let component: CbpTbdComponent;
	let fixture: ComponentFixture<CbpTbdComponent>;
	let service: ArchitectureService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CbpTbdModule,
				HttpClientTestingModule,
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
		});
	});

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		fixture = TestBed.createComponent(CbpTbdComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(service, 'getAllCBPExceptionDetails')
			.mockReturnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getData();
		expect(component.isLoading)
			.toBeFalsy();
		expect(component.exceptionDatas)
			.toEqual([]);
		expect(component.totalItems)
			.toEqual(0);
	});

	it('should call getAllCBPExceptionDetails', () => {
		jest.spyOn(service, 'getAllCBPExceptionDetails')
		.mockReturnValue(of({ exceptionDatas: [] }));
		component.getData();
		expect(service.getAllCBPExceptionDetails)
			.toHaveBeenCalled();
	});

	it('should change params on onchange', () => {
		component.cbpDetails = {
			customerId : '1234',
			ruleIdWithExceptions : 'excep1;excep2;excep3',
		};
		fixture.detectChanges();
		component.ngOnChanges();
		expect(component.isLoading)
			.toBeTruthy();
		expect(component.params.page)
			.toBe(0);
	});

	it('should change params on onchange when cbpDetails is empty', () => {
		component.isLoading = false;
		component.cbpDetails = null;
		component.ngOnChanges();
		expect(component.isLoading)
			.toBeFalsy();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit: 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.params.page)
			.toBe(1);
	});

	it('should expand row', () => {
		component.exceptionDatas =  [
			{
				active : false,
				bpRuleId : '111',
			},
			{
				active : false,
				bpRuleId : '222',
			},
		];
		const selectedItem = component.exceptionDatas[0];
		component.expandRow(selectedItem);
		expect(component.exceptionDatas[0].active)
			.toBeTruthy();
	});

});
