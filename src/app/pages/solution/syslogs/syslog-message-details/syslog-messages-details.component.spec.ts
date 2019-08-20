import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SyslogsService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { user } from '@mock';
import { SyslogmessagesdetailsComponent } from './syslog-messages-details.component';
import { SyslogmessagesdetailsModule } from './syslog-messages-details.module';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
describe('SyslogmessagesdetailsComponent', () => {
	let component: SyslogmessagesdetailsComponent;
	let fixture: ComponentFixture<SyslogmessagesdetailsComponent>;
	let syslogsService: SyslogsService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogmessagesdetailsModule,
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
		fixture = TestBed.createComponent(SyslogmessagesdetailsComponent);
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
		spyOn(syslogsService, 'get360GridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const messagegrid = [];
				expect(component.tabledata1)
				.toEqual(messagegrid);

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
		spyOn(syslogsService, 'get360GridData')
		.and
		.returnValue(of(SyslogScenarios[4].scenarios.GET[0].response.body));
		component.loadSyslog360data(param);
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.tabledata1)
				.toBeDefined();
			done();
		});
	});
});
