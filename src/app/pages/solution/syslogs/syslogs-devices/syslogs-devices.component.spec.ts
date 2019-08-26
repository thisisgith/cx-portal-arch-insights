import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
describe('SyslogsMessagesComponent', () => {
	let component: SyslogsDevicesComponent;
	let fixture: ComponentFixture<SyslogsDevicesComponent>;
	let syslogsService: SyslogsService;
	beforeEach(async(() => {
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
		})
			.compileComponents();

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
	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getDeviceGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.detectChanges();
		expect(syslogsService.getDeviceGridData)
			.toHaveBeenCalled();
		const syslogMessageGrid = [];
		expect(component.tableData)
			.toEqual(syslogMessageGrid);
	 });
	it('Should get the syslog message grid data', done => {
		spyOn(syslogsService, 'getDeviceGridData')
		.and
		.returnValue(of(SyslogScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(syslogsService.getDeviceGridData)
			.toHaveBeenCalled();
			expect(component.tableData)
				.toBeDefined();
			done();
		});
	});
	it('should get selected table row data', done => {
		fixture.whenStable()
			.then(() => {
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
				expect(selectedRowData.active)
				 .toBeTruthy();
				 expect(component.selectedAsset)
				 .toEqual(selectedRowData);
				done();
			});
	});
	it('should reset tableRow row data on panel close', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				component.onPanelClose();
				expect(component.selectedAsset)
				.toBeUndefined();
				expect(component.showAssetPanel)
				.toBeFalsy();
				done();
			});
	});
	it('should reset tableRow row data when clicking twice on table row', done => {
		fixture.whenStable()
			.then(() => {
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
				expect(selectedRowData.active)
				 .toBeFalsy();
				 expect(component.selectedAsset)
				 .toBeUndefined();
				done();
			});
	});
	it('should refresh assetfilter data', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const selectedRowData1 = {
					assetFilter: {
						currentValue: {
							asset: '',
							catalog: '',
							severity: 7,
							timeRange: 1,
						},
						firstChange: true,
						previousValue: undefined,
						isFirstChange: () => false,
					},
				};
				component.ngOnChanges(selectedRowData1);
				expect(selectedRowData1.assetFilter.firstChange)
				 .toBeTruthy();
				done();
			});
	});
});
