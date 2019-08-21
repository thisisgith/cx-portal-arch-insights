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

describe('SyslogsdevicedetailsComponent', () => {
	let component: SyslogsDeviceDetailsComponent;
	let fixture: ComponentFixture<SyslogsDeviceDetailsComponent>;
	let syslogsService: SyslogsService;
	beforeEach(async(() => {
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
		})
		.compileComponents();
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
		spyOn(syslogsService, 'getdevice360details')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.tabledata)
				.toBeUndefined();

				done();
			});
	});
	it('Should get the syslog device message grid data', done => {
		const param = {
			active: true,
			DeviceHost: '10.10.10.10',
			ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
			ProductId: 'WS-C2960S-24PS-L',
			SoftwareType: 'IOS',
			SoftwareVersion: '12.2(53)SE2',
			syslogCount: 6,
		};
		spyOn(syslogsService, 'getdevice360details')
		.and
		.returnValue(of(SyslogScenarios[4].scenarios.GET[0].response.body));
		component.syslogdevice360data(param);
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.tabledata)
				.toBeDefined();
			done();
		});
	});

	it('should toggle the inner grid ', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const param = {
					active: true,
					DeviceHost: '10.10.10.10',
					ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
					ProductId: 'WS-C2960S-24PS-L',
					SoftwareType: 'IOS',
					SoftwareVersion: '12.2(53)SE2',
					syslogCount: 6,
				};
				component.expandRow(param);
				expect(param.active)
				 .toBeTruthy();
				done();
			});
	});
});
