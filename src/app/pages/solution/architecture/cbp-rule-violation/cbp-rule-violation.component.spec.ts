import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CbpRuleViolationModule } from './cbp-rule-violation.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';

describe('CbpRuleViolationComponent', () => {
	let component: CbpRuleViolationComponent;
	let fixture: ComponentFixture<CbpRuleViolationComponent>;
	let service: ArchitectureService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CbpRuleViolationModule,
				HttpClientTestingModule,
				RouterTestingModule,
			], providers: [
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

		fixture = TestBed.createComponent(CbpRuleViolationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getCBPSeverityList on init', () => {
		spyOn(service, 'getCBPSeverityList')
			.and
			.returnValue(of({ TotalCounts: 1000, BPRulesDetails: [] }));
		component.ngOnInit();
		expect(service.getCBPSeverityList)
			.toHaveBeenCalled();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit: 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.paramsType.page)
			.toBe(1);
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getCBPSeverityList')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.ngOnInit();
	});

	it('should close panel', () => {
		component.onPanelClose();
		expect(component.exceptionObject)
			.toBe(null);
	});

	it('should trigger search function', () => {
		const event = { keyCode: 13 };
		component.globalSearchFunction(event.keyCode);
		expect(component.isLoading)
				.toBeTruthy();
		expect(component.tableStartIndex)
				.toBe(0);
		expect(component.paramsType.page)
				.toBe(0);
	});

	it('should pass data on row clicked', () => {
		const tableEvent = {
			active: false,
			collectionId: 'adc76807-f3f2-4e34-b41b-6e93d151bea1',
			customerId: '7293498',
			hostName: 'vhvhjhj',
			ipAddress: '10.16.1.254',
			lastUpdateDate: '2019-08-19T16:55:31',
			managedNeId: 'NA,FDO1852E263,WS-C3650-24PD-E,NA',
			neInstanceId: '23493613',
			neName: 'NYC-SW-3650',
			productFamily: 'Cisco Catalyst 3650 Series Switches',
			productId: 'WS-C3650-24PD-E',
			productType: 'LAN Switches',
			ruleId: 'null',
			ruleIdWithExceptions: '8376;8377;8374;7684;',
			serialNumber: 'FDO1852E263',
			softwareType: 'IOS-XE',
			softwareVersion: '16.3.3',
		};
		component.onTableRowClicked(tableEvent);
		expect(component.exceptionObject)
			.toBeDefined();
	});

	it('should reload the data on filter change', () => {
		spyOn(service, 'getCBPSeverityList')
			.and
			.returnValue(of({ TotalCounts: 1000, BPRulesDetails: [] }));
		component.ngOnChanges({
			filters: {
				currentValue: { exceptions: [] },
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(service.getCBPSeverityList)
			.toHaveBeenCalled();

	});

	it('should not reload the data on filter change if first change', () => {
		spyOn(service, 'getCBPSeverityList')
			.and
			.returnValue(of({ TotalCounts: 1000, BPRulesDetails: [] }));
		component.ngOnChanges({
			filters: {
				currentValue: { exceptions: [] },
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(service.getCBPSeverityList)
			.toHaveBeenCalledTimes(0);

	});

});
