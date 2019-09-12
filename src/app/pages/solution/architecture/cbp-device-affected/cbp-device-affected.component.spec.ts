import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { environment } from '@environment';
import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';
import { CbpDeviceAffectedModule } from './cbp-device-affected.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { of, throwError } from 'rxjs';
import { AssetPanelLinkService } from '@services';
import { HttpErrorResponse } from '@angular/common/http';

describe('CbpDeviceAffectedComponent', () => {
	let component: CbpDeviceAffectedComponent;
	let fixture: ComponentFixture<CbpDeviceAffectedComponent>;
	let service: ArchitectureService;
	let assetService: AssetPanelLinkService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CbpDeviceAffectedModule,
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
		});
	});

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		assetService = TestBed.get(AssetPanelLinkService);
		fixture = TestBed.createComponent(CbpDeviceAffectedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getAllCBPDeviceAffected', () => {
		spyOn(service, 'getAllCBPDeviceAffected')
			.and
			.returnValue(of({ assetDatas: [] }));
		component.getData();
		expect(service.getAllCBPDeviceAffected)
			.toHaveBeenCalled();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit : 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.params.page)
		.toBe(1);
	});

	it('should close panel', () => {
		component.onPanelClose();
		expect(component.selectedAsset)
		.toBeFalsy();
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
		const response = [
			{ data: [{
				contractNumber: '-1',
				criticalAdvisories: '-1',
				deviceName: '{HOSTNAME}',
				equipmentType: 'CHASSIS',
				hwInstanceId: '12031,AIR-CT5508-K9,NA,12031,AIR-CT5508-K9,NA,NA',
				ipAddress: '12.0.3.1',
				lastScan: null,
				managedNeId: 'NA,12031,AIR-CT5508-K9,NA',
				neId: 'NA,12031,AIR-CT5508-K9,NA',
				osType: null,
				osVersion: null,
				productId: '',
				productName: '',
				reachabilityStatus: 'Reachable',
				role: 'ACCESS',
				serialNumber: '12031',
				solutionInfo: null,
				supportCovered: false,
			}],
			},
		];
		spyOn(assetService, 'getAssetLinkData')
			.and
			.returnValue(of(response));
		component.openAssetDetailsView(selectedAsset);
		expect(assetService.getAssetLinkData)
			.toHaveBeenCalled();
	});

	it('should call cbpdetails on change', () => {
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.params.page)
			.toEqual(0);
		expect(component.totalItems)
			.toBeDefined();
		expect(component.isLoading)
			.toBeTruthy();
	});

	it('should throw errors', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getAllCBPDeviceAffected')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getData();
		tick();
		expect(component.getData)
			.toThrowError();
		expect(component.isLoading)
			.toBeFalsy();
		expect(component.totalItems)
			.toEqual(0);
	}));

});
