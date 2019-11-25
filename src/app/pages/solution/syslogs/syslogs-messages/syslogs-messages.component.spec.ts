import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogsMessagesComponent } from './syslogs-messages.component';
import { SyslogsMessagesModule } from './syslogs-messages.module';
import { SyslogsService, SyslogFullResponse } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
import { SimpleChanges, SimpleChange } from '@angular/core';
fdescribe('SyslogsMessagesComponent', () => {
	let component: SyslogsMessagesComponent;
	let fixture: ComponentFixture<SyslogsMessagesComponent>;
	let syslogsService: SyslogsService;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogsMessagesModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [SyslogsService],
		});
	});

	beforeEach(() => {
		window.localStorage.clear();
		syslogsService = TestBed.get(SyslogsService);
		fixture = TestBed.createComponent(SyslogsMessagesComponent);
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
		spyOn(syslogsService, 'getGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		fixture.detectChanges();
		const syslogMessageGrid = [];
		expect(component.tableData)
				.toEqual(syslogMessageGrid);
	});

	it('Should get the syslog message grid data', () => {
		spyOn(syslogsService, 'getGridData')
		.and
		.returnValue(of(SyslogScenarios[1].scenarios.POST[0].response.body));
		component.ngOnInit();
		expect(component.totalItems)
			.toEqual(11);
	});

	it('should not get the syslog message grid data', () => {
		const syslogMessagesCount: SyslogFullResponse = {
			count: 0,
			message: 'Success',
			responseData: [],
		};

		spyOn(syslogsService, 'getGridData')
			.and
			.returnValue(of(syslogMessagesCount));
		component.ngOnInit();
		expect(component.totalItems)
			.toEqual(0);
	});

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
		expect(selectedRowData.active)
				 .toBeTruthy();
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

	it('should reset tableRow row data when clicking twice on table row', () => {
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

	it('should take currentFilter on changes', () => {
		const changes: SimpleChanges = {
			sysFilter: new SimpleChange(
				{
					afmSeverity: '',
					faults : 'Automated',
					severity: 3,
					timeRange: 1,
				},
				{
					afmSeverity: '',
					faults : 'Automated',
					severity: 3,
					timeRange: 1,
				}, false,
			),
		};
		component.ngOnChanges(changes);
		expect(component.syslogsParams.syslogSeverity)
			.toEqual(3);
	});
	it('should not take currentFilter changes', () => {
		const changes: SimpleChanges = {
			sysFilter: new SimpleChange(
				{
					afmSeverity: '',
					faults : 'Automated',
					severity: 0,
					timeRange: 1,
				},
				{
					afmSeverity: '',
					faults : 'Automated',
					severity: 0,
					timeRange: 1,
				}, true,
			),
		};
		component.ngOnChanges(changes);
		expect(component.syslogsParams.syslogSeverity)
			.toEqual(0);
	});

	it('should call on enter function', () => {
		spyOn(component, 'getSyslogsData')
			.and
			.callThrough();
		const keyEvent = {
			keyCode: 12,
		};
		component.keyDownFunction(keyEvent);
		expect(component.getSyslogsData)
			.toHaveBeenCalledTimes(0);

		const event = {
			keyCode: 13,
		};
		component.keyDownFunction(event);
		expect(component.getSyslogsData)
			.toHaveBeenCalledTimes(1);
	});

	it('should update pagination page value', () => {
		spyOn(component, 'getSyslogsData')
				.and
				.callThrough();
		const pageInfo = {
			page: 2,
			limit: 10,
		};
		component.onPagerUpdated(pageInfo);
		expect(component.tableOffset)
				.toEqual(2);
		expect(component.getSyslogsData)
				.toHaveBeenCalledTimes(1);
	});

});
