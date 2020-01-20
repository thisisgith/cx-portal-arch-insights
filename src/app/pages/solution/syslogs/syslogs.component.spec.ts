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
		component.filters = [
			{
				key: 'faults',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					},
				],
				title: 'faults',
				view: ['afm'],
				selected: true,
			},
			{
				key: 'afmSeverity',
				loading: true,
				seriesData: [
					{
						filter: 'Critical',
						filterName: 'Critical',
						label: 'Critical(55)',
						selected: true,
						value: 55,
					},
					{
						filter: 'High',
						filterName: 'High',
						label: 'High(53)',
						selected: false,
						value: 53,
					},
					{
						filter: 'Medium',
						filterName: 'Medium',
						label: 'Medium(17)',
						selected: false,
						value: 17,
					},
					{
						filter: 'Low',
						filterName: 'Low',
						label: 'Low(9)',
						selected: false,
						value: 9,
					},
					{
						filter: 'Info',
						filterName: 'Info',
						label: 'Info(3)',
						selected: false,
						value: 3,
					},
				],
				title: 'Severity',
				view: ['afm'],
				selected: true,
			},
			{
				key: 'timeRange',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					}],
				title: 'Time Range',
				view: ['syslog'],
				selected: true,
			},
		];
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
		component.filters = [
			{
				key: 'faults',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					},
				],
				title: 'faults',
				view: ['afm'],
				selected: true,
			},
			{
				key: 'timeRange',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					}],
				title: 'Time Range',
				view: ['syslog'],
				selected: true,
			},
		];
		component.onSubfilterClose(afmEvent);
		expect(component.appliedFilters.timeRange)
			.toEqual(1);
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
				filterName: '',
				label: 'string',
				selected: false,
				value: 1,
			}],
			view: [],
		};
		component.onSubfilterSelect('severity', filter, false);
		expect(component.appliedFilters.afmSeverity)
			.toEqual('');
		component.onSubfilterSelect('afmSeverity', filter, true);
		expect(component.appliedFilters.afmSeverity)
			.toEqual('afmSeverity');
	});

	it('should select the time range filter', () => {
		let filter: SyslogFilter = Object.create({ });
		filter = {
			key: 'timeRange',
			loading: true,
			seriesData: [
				{ 	filter: 'Automated',
					filterName: 'Automated Faults',
					label: 'Automated Faults(22)',
					selected: true,
					value: 22,
				},
				{
					filter: 'Detected',
					filterName: 'Detected Faults',
					label: 'Detected Faults(115)',
					selected: false,
					value: 115,
				}],
			title: 'Time Range',
			view: ['syslog'],
			selected: true,
		};
		component.onSubfilterSelect('timeRange', filter, true);
		expect(component.appliedFilters.timeRange)
			.toEqual(30);

		component.visualLabels[0].active = false;
		component.visualLabels[1].active = true;
		component.onSubfilterSelect('timeRange', filter, true);
		expect(component.appliedFilters.timeRange)
			.toEqual(1);
	});

	it('should select the severity filter', () => {
		let filter: SyslogFilter = Object.create({ });
		filter = {
			key: 'severity',
			loading: true,
			seriesData: [
				{
					filter: '0',
					filterName: '0',
					label: '0',
					selected: true,
					value: undefined,
				},
				{
					filter: '1',
					filterName: '1',
					label: '1',
					selected: false,
					value: 5,
				},
				{
					filter: '2',
					filterName: '2',
					label: '2',
					selected: false,
					value: 9,
				},
				{
					filter: '3',
					filterName: '3',
					label: '3',
					selected: false,
					value: 16,
				},
				{
					filter: '4',
					filterName: '4',
					label: '4',
					selected: false,
					value: 12,
				},
			],
			title: 'Severity',
			view: ['syslog'],
			selected: true,
		};
		component.onSubfilterSelect('severity', filter, true);
		expect(component.appliedFilters.severity)
			.toEqual(0);
	});

	it('should select the fault filter', () => {
		let filter: SyslogFilter = Object.create({ });
		filter = {
			key: 'faults',
			loading: true,
			seriesData: [
				{ 	filter: 'Automated',
					filterName: 'Automated Faults',
					label: 'Automated Faults(22)',
					selected: true,
					value: 22,
				},
				{
					filter: 'Detected',
					filterName: 'Detected Faults',
					label: 'Detected Faults(115)',
					selected: false,
					value: 115,
				},
			],
			title: 'faults',
			view: ['afm'],
			selected: true,
		};
		component.onSubfilterSelect('faults', filter, true);
		expect(component.appliedFilters.faults)
			.toEqual('Automated');
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

	it('should clear the filter', () => {
		component.filters = [
			{
				key: 'faults',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					},
				],
				title: 'faults',
				view: ['afm'],
				selected: true,
			},
			{
				key: 'afmSeverity',
				loading: true,
				seriesData: [
					{
						filter: 'Critical',
						filterName: 'Critical',
						label: 'Critical(55)',
						selected: true,
						value: 55,
					},
					{
						filter: 'High',
						filterName: 'High',
						label: 'High(53)',
						selected: false,
						value: 53,
					},
					{
						filter: 'Medium',
						filterName: 'Medium',
						label: 'Medium(17)',
						selected: false,
						value: 17,
					},
					{
						filter: 'Low',
						filterName: 'Low',
						label: 'Low(9)',
						selected: false,
						value: 9,
					},
					{
						filter: 'Info',
						filterName: 'Info',
						label: 'Info(3)',
						selected: false,
						value: 3,
					},
				],
				title: 'Severity',
				view: ['afm'],
				selected: true,
			},
			{
				key: 'timeRange',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					}],
				title: 'Time Range',
				view: ['syslog'],
				selected: true,
			},
		];
		component.clearFilters();
		expect(component.allAssetsSelected)
			.toBeFalsy();
	});

	it('should select sub filters', () => {
		component.filters = [
			{
				key: 'timeRange',
				loading: true,
				seriesData: [
					{ 	filter: 'Automated',
						filterName: 'Automated Faults',
						label: 'Automated Faults(22)',
						selected: true,
						value: 22,
					},
					{
						filter: 'Detected',
						filterName: 'Detected Faults',
						label: 'Detected Faults(115)',
						selected: false,
						value: 115,
					}],
				title: 'Time Range',
				view: ['syslog'],
				selected: true,
			},
		];
		const filter = component.getSelectedSubFilters('afmSeverity');
		expect(filter)
			.toBeUndefined();
		const timeRangeFilter = component.getSelectedSubFilters('timeRange');
		expect(timeRangeFilter[0].filter)
			.toEqual('Automated');
	});

});
