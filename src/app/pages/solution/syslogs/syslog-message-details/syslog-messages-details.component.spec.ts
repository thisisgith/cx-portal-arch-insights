import { configureTestSuite } from 'ng-bullet';
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

	configureTestSuite(() => {
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
		});
	});

	beforeEach(async(() => {

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
	it('Should get the syslog device message grid data', () => {
		const param = {
			syslogId: '12345',
		};
		spyOn(syslogsService, 'getPanelGridData')
			.and
			.returnValue(of(SyslogScenarios[2].scenarios.POST[0].response.body));

		const asset: SyslogPanelGridData = Object.create({ });
		asset.count = 10;
		asset.message = 'test';
		asset.responseData = [];

		component.asset = asset;
		component.customerId = '12345';
		component.loadSyslogPaneldata(param);

		expect(component.tableData.length)
			.toBeGreaterThan(0);
		expect(component.count)
			.toEqual(1);
	});

	it('should set null values on request error', () => {
		 const error = {
			status: 404,
			statusText: 'Resource not found',
		 };
		spyOn(syslogsService, 'getPanelGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.asset = {
			syslogId: '12345',
		};
		component.loadSyslogPaneldata(component.asset);
		expect(syslogsService.getPanelGridData)
			.toHaveBeenCalled();
		expect(component.count)
			.toBeUndefined();
	});
	it('should close all panel', () => {
		component.onPanelClose();
		expect(component.showAssetPanel)
			.toBeFalsy();
	});
	it('should get all category', () => {
		spyOn(syslogsService, 'getSyslogsCategoryList')
		.and
		.returnValue(of(SyslogScenarios[3].scenarios.GET[0].response.body));
		component.getCategoryList();
		expect(syslogsService.getSyslogsCategoryList)
		.toHaveBeenCalled();
		expect(component.categoryList.length)
		.toBeGreaterThan(0);
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getSyslogsCategoryList')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getCategoryList();
		expect(syslogsService.getSyslogsCategoryList)
				.toHaveBeenCalled();
		expect(component.categoryList)
				.toBeUndefined();
	});

	it('should hide the details panel', () => {
		const hidden = false;
		component.handleHidden(hidden);
		const hiddenTrue = true;
		component.handleHidden(hiddenTrue);
		expect(component.showAssetDetails)
			.toBeFalsy();
	});

	it('should toogle dropdown on button click', () => {
		component.movetoAfmClicked = true;
		component.togglePushToFaults();
		expect(component.movetoAfmClicked)
		.toBeFalsy();
		expect(component.selectedCategory)
		.toEqual('');
	});

	it('Should Call the syslog categoryList data', () => {
		spyOn(component, 'getCategoryList')
			.and
			.callThrough();
		spyOn(syslogsService, 'getSyslogsCategoryList')
		.and
		.returnValue(of(SyslogScenarios[3].scenarios.GET[0].response.body));
		component.ngOnChanges();
		expect(component.getCategoryList)
				.toHaveBeenCalled();
		expect(component.categoryList.length)
				.toBeGreaterThan(0);
	});
});
