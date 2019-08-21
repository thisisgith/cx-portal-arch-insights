import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';
import { CbpDeviceAffectedModule } from './cbp-device-affected.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { of } from 'rxjs';

describe('CbpDeviceAffectedComponent', () => {
	let component: CbpDeviceAffectedComponent;
	let fixture: ComponentFixture<CbpDeviceAffectedComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
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
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getAllCBPDeviceAffected')
			.and
			.returnValue(of({ assetDatas: [] }));
		fixture = TestBed.createComponent(CbpDeviceAffectedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getAllCBPDeviceAffected', () => {
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
		.toBe(null);
	});

	it('should open asset view on click of table row', () => {
		const selectedAsset = {
			active : false,
			collectionId : 'adc76807-f3f2-4e34-b41b-6e93d151bea1',
			customerId : '7293498',
			hostName : 'vhvhjhj',
			ipAddress : '10.16.1.254',
			lastUpdateDate : '2019-08-19T16:55:31',
			managedNeId : 'NA,FDO1852E263,WS-C3650-24PD-E,NA',
			neInstanceId : '23493613',
			neName : 'NYC-SW-3650',
			productFamily : 'Cisco Catalyst 3650 Series Switches',
			productId : 'WS-C3650-24PD-E',
			productType : 'LAN Switches',
			ruleId : 'null',
			ruleIdWithExceptions : '8376;8377;8374;7684;',
			serialNumber : 'FDO1852E263',
			softwareType : 'IOS-XE',
			softwareVersion : '16.3.3',
		  };
		component.openAsset360View(selectedAsset);
		expect(component.selectedAsset)
		.toBeDefined();
	});

});
