import { configureTestSuite } from 'ng-bullet';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogsDevicesComponent } from './syslogs-devices.component';
import { SyslogsDevicesModule } from './syslogs-devices.module';
import { SyslogsService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { user } from '@mock';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
import { SimpleChanges, SimpleChange } from '@angular/core';
describe('SyslogsMessagesComponent', () => {
	let component: SyslogsDevicesComponent;
	let fixture: ComponentFixture<SyslogsDevicesComponent>;
	let syslogsService: SyslogsService;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogsDevicesModule,
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

		syslogsService = TestBed.get(SyslogsService);
	}));

	beforeEach(() => {
		window.localStorage.clear();
		fixture = TestBed.createComponent(SyslogsDevicesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
	it('should set null values on request errors', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getDeviceGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		tick();
		fixture.detectChanges();
		expect(syslogsService.getDeviceGridData)
			.toHaveBeenCalled();
		const syslogMessageGrid = [];
		expect(component.tableData)
			.toEqual(syslogMessageGrid);
	 }));

	it('Should get the syslog message grid data', fakeAsync(() => {
		spyOn(syslogsService, 'getDeviceGridData')
		.and
		.returnValue(of(SyslogScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		tick();
		fixture.detectChanges();
		expect(syslogsService.getDeviceGridData)
		.toHaveBeenCalled();
		expect(component.tableData)
			.toBeDefined();
	}));

	it('should get selected table row data', () => {
		fixture.detectChanges();
		const selectedRowData = {
			active: true,
			deviceCount: 1,
			IcDesc: '',
			MsgType: 'INTERNAL',
			Recommendation: '',
			syslogMsgCount: 25,
			SyslogSeverity: 3,
		};
		component.onTableRowSelection(selectedRowData);
		 expect(component.selectedAsset)
		 .toEqual(selectedRowData);
	});

	it('should reset tableRow row data on panel close', () => {
		fixture.detectChanges();
		component.onPanelClose();
		expect(component.selectedAsset)
		.toBeUndefined();
		expect(component.showAssetPanel)
		.toBeFalsy();
	});
	it('should refresh assetfilter data', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const changes: SimpleChanges = {
					assetFilter: new SimpleChange(
						{
							asset: '',
							catalog: 'Cisco',
							severity: 3,
							timeRange: 30,
						},
						{
							asset: '',
							catalog: 'Cisco',
							severity: 3,
							timeRange: 30,
						}, false,
					),
				};
				component.ngOnChanges(changes);
				expect(component.syslogsParams.catalog)
				 .toEqual('Cisco');
				done();
			});
	});
	it('Should Load device detail headers', done => {
		spyOn(syslogsService, 'getDeviceHeaderDetails')
		.and
		.returnValue(of(SyslogScenarios[8].scenarios.GET[0].response.body));
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const devicetableParams = {
				active: true,
				DeviceHost: 'Device_6_0_10_1',
				DeviceIp: '6.0.10.1',
				ProductFamily: null,
				ProductId: 'C9606R',
				SoftwareType: '16.11.1',
				SoftwareVersion: '16.11.1',
				syslogCount: 1319,
			};
			const customerId = '123456';
			component.sysLogHeaderDetails(devicetableParams, customerId);
			expect(syslogsService.getDeviceHeaderDetails)
			.toHaveBeenCalled();
			expect(component.deviceHeaderValues)
				.toBeDefined();
			expect(component.deviceHeaderValues.lastScan)
				.toEqual('1day');
			expect(component.deviceHeaderValues.serialNumber)
				.toEqual('123');

			done();
		});
	});
	it('should not trigger search function for keycode 10', () => {
		const event = { keyCode: 10 };
		component.searchAll(event.keyCode);
		expect(component.syslogsParams.search)
			.toEqual('');
	});
	it('should get reset selected table row data', () => {
		fixture.detectChanges();
		const selectedRowData = {
			active: false,
			deviceCount: 1,
			IcDesc: '',
			MsgType: 'INTERNAL',
			Recommendation: '',
			syslogMsgCount: 25,
			SyslogSeverity: 3,
		};
		component.onTableRowSelection(selectedRowData);
		 expect(component.selectedAsset)
		 .toBeUndefined();
	});
});
