import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { DnacListComponent } from './dnac-list.component';
import { DnacListModule } from './dnac-list.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ArchitectureReviewService } from '@sdp-api';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';

describe('DnacListComponent', () => {
	let component: DnacListComponent;
	let fixture: ComponentFixture<DnacListComponent>;
	let service: ArchitectureReviewService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [DnacListModule,
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
		});
	});

	beforeEach(async(() => {
		service = TestBed.get(ArchitectureReviewService);
	}));
	beforeEach(() => {
		fixture = TestBed.createComponent(DnacListComponent);
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
		jest.spyOn(service, 'getDnacList')
			.mockReturnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getDnacList();
		expect(component.dnacDetailsResponse)
		.toEqual([]);
		expect(component.isLoading)
		.toBeFalsy();
		expect(component.totalItems)
		.toEqual(0);
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit: 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.params.page)
			.toBe(1);
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
		expect(component.dnacDetails)
			.toBeDefined();
	});

	it('should close panel', () => {
		component.onPanelClose();
		expect(component.dnacDetails)
			.toBeNull();
	});

	it('should call getDnacList service with null', () => {
		component.isLoading = true;
		component.totalItems = 5;
		const spy = jest.spyOn(service, 'getDnacList')
			.mockReturnValue(of(null));
		component.getDnacList();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(spy)
					.toHaveBeenCalled();
				expect(component.totalItems === 0)
					.toBeTruthy();
				expect(component.isLoading)
					.toBeFalsy();
			});
	});

	it('should call getDnacList service with object', () => {
		component.isLoading = true;
		component.totalItems = 5;
		const spy = jest.spyOn(service, 'getDnacList')
			.mockReturnValue(of({
				dnacDetails: [{ active: true, customerId: 'xyz' }],
				TotalCounts: 10,
			}));
		component.getDnacList();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(spy)
					.toHaveBeenCalled();
				expect(component.totalItems === 10)
					.toBeTruthy();
				expect(component.dnacDetailsResponse)
					.toBeDefined();
				expect(component.isLoading)
					.toBeFalsy();
			});
	});

	it('should trigger search function for keycode 13', () => {
		const event = { keyCode: 13 };
		component.textFilter(event.keyCode);
		expect(component.isLoading)
			.toBeTruthy();
		expect(component.tableStartIndex)
			.toBe(0);
		expect(component.params.page)
			.toBe(0);
	});

	it('should call onpanelclose', () => {
		jest.spyOn(component, 'onPanelClose');
		const hidden = true;
		component.handleHidden(hidden);
		expect(component.onPanelClose)
			.toHaveBeenCalled();
	});
	it('should not call onpanelclose', () => {
		jest.spyOn(component, 'onPanelClose');
		const hidden = false;
		component.handleHidden(hidden);
		expect(component.onPanelClose)
			.not
			.toHaveBeenCalled();
	});
	it('should not trigger search function', () => {
		const enterKeyCode = 10;
		jest.spyOn(component, 'getDnacList');
		component.searchText = 'airios';
		component.textFilter(enterKeyCode);
		expect(component.getDnacList)
			.not
			.toHaveBeenCalled();
	});

});
