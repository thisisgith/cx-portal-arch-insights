import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogsComponent } from './syslogs.component';
import { SyslogsModule } from './syslogs.module';
import { SyslogsService, SyslogFilter } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
import { RacetrackInfoService } from '@services';

describe('SyslogsComponent', () => {
	let component: SyslogsComponent;
	let fixture: ComponentFixture<SyslogsComponent>;
	let syslogsService: SyslogsService;
	let racetrackInfoService: RacetrackInfoService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [SyslogsService, RacetrackInfoService],
		});
	});

	beforeEach(() => {
		window.localStorage.clear();
		syslogsService = TestBed.get(SyslogsService);
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		fixture = TestBed.createComponent(SyslogsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should set count values on request success', () => {
		spyOn(syslogsService, 'getSyslogsCount')
			.and
			.returnValue(of(SyslogScenarios[0].scenarios.POST[0].response.body));
		component.fetchSyslogsCount();

		expect(syslogsService.getSyslogsCount)
			.toHaveBeenCalled();
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getSyslogsCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.fetchSyslogsCount();

		expect(syslogsService.getSyslogsCount)
			.toHaveBeenCalled();
	});

	it('Should get the syslog message count data', () => {
		spyOn(racetrackInfoService, 'getCurrentTechnology')
		.and
		.callThrough();
		component.ngOnInit();
		expect(racetrackInfoService.getCurrentTechnology)
			.toHaveBeenCalled();
	});

	it('should SyslogMessage tab active', () => {
		const index = 0;
		component.selectVisualLabel(index);
		expect(component.visualLabels[0].active)
					.toBeTruthy();
	});

	it('should AssetTab tab active', () => {
		const index = 1;
		component.selectVisualLabel(index);
		expect(component.visualLabels[1].active)
					.toBeTruthy();
	});

	it('should close on subfilter select', () => {
		const event = {
			key : 'Severity',
		};
		component.onSubfilterClose(event);
		expect(component.faultFlag)
			.toBeTruthy();

		const afmEvent = {
			key : 'afmSeverity',
		};
		component.onSubfilterClose(afmEvent);
		expect(component.appliedFilters.afmSeverity)
			.toEqual('');
	});

	it('should close on subfilter time range select', () => {
		const afmEvent = {
			key : 'timeRange',
		};
		component.onSubfilterClose(afmEvent);
		expect(component.appliedFilters.timeRange)
			.toEqual(30);
	});

	it('should select the filters', () => {
		let filter: SyslogFilter = Object.create({ });
		filter = {
			key: 'afmSeverity',
			selected: false,
			title: 'severity',
			loading: false,
			seriesData: [{
				filter: 'afmSeverity',
				label: 'string',
				selected: false,
				value: 1,
			}],
			view: [],
		};
		component.onSubfilterSelect('afmSeverity', filter, true);
		expect(component.appliedFilters.afmSeverity)
			.toEqual('afmSeverity');
	});

	it('should get Fault graph count values on request success', () => {
		spyOn(syslogsService, 'getFaultTimeRangeData')
			.and
			.returnValue(of(SyslogScenarios[9].scenarios.POST[0].response.body));
		spyOn(syslogsService, 'getFaultStateData')
			.and
			.returnValue(of(SyslogScenarios[8].scenarios.POST[0].response.body));
		spyOn(syslogsService, 'getFaultSeverityData')
			.and
			.returnValue(of(SyslogScenarios[7].scenarios.POST[0].response.body));
		component.visualLabels[0].active = true;
		component.loadData();
		fixture.detectChanges();
		expect(syslogsService.getFaultTimeRangeData)
		.toHaveBeenCalled();
		expect(syslogsService.getFaultStateData)
		.toHaveBeenCalled();
		expect(syslogsService.getFaultSeverityData)
		.toHaveBeenCalled();
		expect(component.faultSeverityCount.low)
		.toEqual(2);
	});

	it('should get syslog graph count values on request success', () => {
		spyOn(syslogsService, 'getSyslogTimeRangeData')
			.and
			.returnValue(of(SyslogScenarios[6].scenarios.POST[0].response.body));
		spyOn(syslogsService, 'getSyslogSeverityData')
			.and
			.returnValue(of(SyslogScenarios[5].scenarios.POST[0].response.body));
		component.visualLabels[0].active = false;
		component.loadData();
		fixture.detectChanges();
		expect(syslogsService.getSyslogTimeRangeData)
		.toHaveBeenCalled();
		expect(syslogsService.getSyslogSeverityData)
		.toHaveBeenCalled();
		expect(component.syslogSeverityCount.syslogSeverity4)
		.toEqual(50);
	});
});
