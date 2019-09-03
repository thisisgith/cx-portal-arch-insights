import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { DevicesWithExceptionsModule } from './devices-with-exceptions.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ArchitectureService } from '@sdp-api';
import { CuiTableModule, CuiPagerModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';

describe('DevicesWithExceptionsComponent', () => {
	let component: DevicesWithExceptionsComponent;
	let fixture: ComponentFixture<DevicesWithExceptionsComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesWithExceptionsModule,
				HttpClientTestingModule,
				CuiTableModule,
				CuiPagerModule,
				CuiSpinnerModule,
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
	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getAllAssetsWithExceptions')
			.and
			.returnValue(of({ TotalCounts: 1000, AssetsExceptionDetails: [] }));
		fixture = TestBed.createComponent(DevicesWithExceptionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getAllAssetsWithExceptions on init', () => {
		component.ngOnInit();
		expect(service.getAllAssetsWithExceptions)
			.toHaveBeenCalled();
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
		expect(component.assetObject)
			.toEqual(tableEvent);
	});

	it('should open asset view on click of table row', () => {
		const selectedAsset = {
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
		component.openAssetDetailsView(selectedAsset);
		expect(component.selectedAsset)
			.toEqual(selectedAsset);
	});

	it('should close panel', () => {
		component.onPanelClose();
		expect(component.assetObject)
			.toBeNull();
	});

	it('should close AssetView', () => {
		const isClosed = true;
		component.closeAssetDetailsView(isClosed);
		expect(component.selectedAsset)
			.toBeNull();
	});

	it('should trigger search function', () => {
		const enterKeyCode = 13;
		component.globalSearchFunction(enterKeyCode);
		expect(component.isLoading)
			.toBeFalsy();
		expect(component.tableStartIndex)
			.toBe(0);
		expect(component.params.page)
			.toBe(0);
		expect(component.params.searchText)
			.toBe('');
	});

});
