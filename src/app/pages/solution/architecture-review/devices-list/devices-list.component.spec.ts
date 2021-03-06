import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { DevicesListComponent } from './devices-list.component';
import { DevicesListModule } from './devices-list.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureReviewService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { user, ArchitectureReviewScenarios } from '@mock';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { AssetPanelLinkService } from '@services';
describe('DevicesListComponent', () => {
	let component: DevicesListComponent;
	let fixture: ComponentFixture<DevicesListComponent>;
	let service: ArchitectureReviewService;
	let assetService: AssetPanelLinkService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				DevicesListModule,
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
				}, ArchitectureReviewService,
			],
		});
	});

	beforeEach(async(() => {
		service = TestBed.get(ArchitectureReviewService);
		assetService = TestBed.get(AssetPanelLinkService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit : 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.paramsType.page)
		.toBe(1);
	});

	it('should close panel', () => {
		component.onPanelClose();
		expect(component.deviceDetails)
		.toBeNull();
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
		expect(component.deviceDetails)
		.toBeDefined();
	});

	it('should global search for that event', () => {
		const otherEvent = {
			keyCode: 7,
		};
		component.textFilter(otherEvent);
		const event = {
			keyCode: 13,
		};
		component.textFilter(event);
		expect(component.isLoading)
		.toBeTruthy();
		expect(component.tableStartIndex)
		.toEqual(0);
	});

	it('should invalid response handler', () => {
		component.invalidResponseHandler();
		expect(component.isLoading)
		.toBeFalsy();
		expect(component.totalItems)
		.toEqual(0);
	});

	it('should open asset view on click of table row', () => {
		const item = {
			customerId: '7293498',
			serialNumber: 'LA1-AP3802-21',
		};
		jest.spyOn(assetService, 'getAssetLinkData')
			.mockReturnValue(of({ }));
		component.openDeviceView(item);
		expect(assetService.getAssetLinkData)
			.toHaveBeenCalled();
	});

	it('should close asset details view', () => {
		component.closeDeviceView();
		expect(component.selectedAsset)
		.toBeFalsy();
	});

	it('should get the Devices data' , () => {
		jest.spyOn(service, 'getDevicesList')
			.mockReturnValue(of(ArchitectureReviewScenarios[0].scenarios.GET[0].response.body));

		component.getDevicesList();
		expect(service.getDevicesList)
		.toHaveBeenCalled();
	});

	it('should throw errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(service, 'getDevicesList')
			.mockReturnValue(
				throwError(new HttpErrorResponse(error)),
		);
		component.getDevicesList();
		expect(component.dnacDeviceDetails)
		.toEqual([]);
	});

	it('should filter the changes', () => {
		const changes: SimpleChanges = {
			filters: new SimpleChange({ severity: '' }, { severity: '' }, false),
		};
		component.ngOnChanges(changes);
		expect(component.isLoading)
		.toBeTruthy();
		expect(component.tableStartIndex)
		.toEqual(0);
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
		jest.spyOn(component, 'getDevicesList');
		component.searchText = 'airios';
		component.textFilter(enterKeyCode);
		expect(component.getDevicesList)
			.not
			.toHaveBeenCalled();
	});

});
