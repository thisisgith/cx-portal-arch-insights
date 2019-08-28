import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SyslogsService, SyslogPanelGridData } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { user } from '@mock';
import { SyslogMessagesDetailsComponent } from './syslog-messages-details.component';
import { SyslogMessagesDetailsModule } from './syslog-messages-details.module';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';

describe('SyslogMessagesDetailsComponent', () => {
	let component: SyslogMessagesDetailsComponent;
	let fixture: ComponentFixture<SyslogMessagesDetailsComponent>;
	let syslogsService: SyslogsService;
	const mockAsset: SyslogPanelGridData = Object.create({ });

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogMessagesDetailsModule,
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
		fixture = TestBed.createComponent(SyslogMessagesDetailsComponent);
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
		spyOn(syslogsService, 'getPanelGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const messagegrid = [];
				expect(component.tableData)
					.toEqual(messagegrid);

				done();
			});
	});
	it('Should get the syslog device message grid data', () => {
		const param = {
			active: true,
			DeviceHost: '10.10.10.10',
			ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
			ProductId: 'WS-C2960S-24PS-L',
			SoftwareType: 'IOS',
			SoftwareVersion: '12.2(53)SE2',
			syslogCount: 6,
		};
		spyOn(syslogsService, 'getPanelGridData')
			.and
			.returnValue(of(SyslogScenarios[7].scenarios.GET[0].response.body));

		const asset: SyslogPanelGridData = Object.create({ });
		const assetFalse: SyslogPanelGridData = Object.create({ });
		asset.count = 10;
		asset.message = 'test';
		asset.responseData = [];

		component.asset = asset;
		component.customerId = '12345';
		component.loadSyslogPaneldata(param);

		expect(component.tableData)
			.toBeDefined();
	});
	it('Should get the syslog message details grid data After fileter', done => {
		spyOn(syslogsService, 'getPanelFilterGridData')
			.and
			.returnValue(of(SyslogScenarios[5].scenarios.GET[0].response.body));
		component.onSelection();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.tableData)
					.toBeDefined();
				done();
			});
	});
	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getPanelFilterGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const messagegrid = [];
				expect(component.tableData)
					.toEqual(messagegrid);

				done();
			});
	});

	it('Should get the syslog message details filter values', done => {
		const param = {
			active: true,
			DeviceHost: '10.10.10.10',
			ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
			ProductId: 'WS-C2960S-24PS-L',
			SoftwareType: 'IOS',
			SoftwareVersion: '12.2(53)SE2',
			syslogCount: 6,
		};
		spyOn(syslogsService, 'getPanelFilterData')
			.and
			.returnValue(of(SyslogScenarios[6].scenarios.GET[0].response.body));
		mockAsset.count = 10;
		component.asset = mockAsset;
		component.loadSyslogPanelFilter(param);
		fixture.detectChanges();
		expect(component.softwareItems)
			.toBeDefined();
		done();
	});

	// it('Should get the syslog message details filter values', done => {
	// 	component.ngOnChanges();
	// 	done();
	// });
});
