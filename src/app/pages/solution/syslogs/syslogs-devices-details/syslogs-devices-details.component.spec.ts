import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SyslogsDevicesDetailsModule } from './syslogs-devices-details.module';
import { SyslogsDeviceDetailsComponent } from './syslogs-devices-details.component';
import { SyslogsService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('SyslogsdevicedetailsComponent', () => {
	let component: SyslogsDeviceDetailsComponent;
	let fixture: ComponentFixture<SyslogsDeviceDetailsComponent>;
	let syslogsService: SyslogsService;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogsDevicesDetailsModule,
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
		fixture = TestBed.createComponent(SyslogsDeviceDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getdevicePanelDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const syslogMessageGrid = [];
				expect(component.tableData)
				.toEqual(syslogMessageGrid);

				done();
			});
	});
	it('Should get the syslog device message grid data', done => {

		spyOn(syslogsService, 'getdevicePanelDetails')
			.and
			.returnValue(of(SyslogScenarios[4].scenarios.GET[0].response.body));
		component.SyslogDevicePanelData();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.tableData)
					.toBeDefined();
				done();
			});
	});
	it('should get selected messages value', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const includeMsg = '';
				const event = {
					keyCode: 13,
				};
				component.keyDownFunction(event);
				expect(component.deviceDetailsParams.includeMsgType)
					.toEqual(includeMsg);
				expect(component.deviceDetailsParams.excludeMsgType)
					.toEqual(includeMsg);
				done();
			});
	});
	it('should reset message value', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				component.keyDownFunction({ keyCode: null });
				expect(component.deviceDetailsParams.includeMsgType)
					.toBeUndefined();
				expect(component.deviceDetailsParams.excludeMsgType)
					.toBeUndefined();
				done();
			});
	});
	it('should get selected severity data', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const severity = 0;
				const timeRange = 0;
				component.onSelection();
				expect(component.deviceDetailsParams.severity)
					.toEqual(severity);
				expect(component.deviceDetailsParams.days)
					.toEqual(timeRange);
				done();
			});
	});

	it('should change current filter on changes', () => {
		const changes: SimpleChanges = {
			asset: new SimpleChange(
				{
				   active: true,
				   DeviceHost: 'Router.cisco.com',
				   DeviceIp: '10.126.77.249',
				   ProductFamily: 'Cisco Carrier Routing System',
				   ProductId: 'IOSXRV',
				   SoftwareType: 'IOS XR',
				   SoftwareVersion: '6.0.0[Default]',
				   syslogCount: 1,
				},
				{
				   active: true,
				   DeviceHost: 'Router.cisco.com',
				   DeviceIp: '10.126.77.249',
				   ProductFamily: 'Cisco Carrier Routing System',
				   ProductId: 'IOSXRV',
				   SoftwareType: 'IOS XR',
				   SoftwareVersion: '6.0.0[Default]',
				   syslogCount: 1,
				}, true,
			),
			selectedFilter: new SimpleChange(
				{ }, {
					asset: '',
					catalog: 'Cisco',
					customerId: '2431199',
					days: 30,
					pageNo: 1,
					search: '',
					severity: '7',
					size: 10,
			 }, false),
		};
		component.ngOnChanges(changes);
		expect(component.selectedSeverity)
		.toEqual('7');
	});
});
