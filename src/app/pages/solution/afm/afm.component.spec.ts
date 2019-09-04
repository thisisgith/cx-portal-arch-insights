import { AfmComponent } from './afm.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FaultManagementModule } from './afm.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { of, throwError } from 'rxjs';
import { user, AfmScenarios } from '@mock';
import {
	AfmService, AfmSearchParams, Alarm,
} from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';

describe('AfmComponent', () => {
	let component: AfmComponent;
	let fixture: ComponentFixture<AfmComponent>;
	const mockAfmSearchParams: AfmSearchParams = new Object();
	const cuiTable: any = new Object;
	const mockAlarm: Alarm = new Object();
	let afmService: AfmService;
	const afmFilter: any = new Object();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FaultManagementModule, HttpClientTestingModule],
			providers: [{ provide: 'ENVIRONMENT', useValue: environment },
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
			}, AfmService],
		})
			.compileComponents();
		afmService = TestBed.get(AfmService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AfmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should ignore alarm filters', () => {
		fixture.detectChanges();
		component.ignoreAlarmFilters();
		expect(component.tableOffset)
			.toEqual(0);
	});

	it('should change table sorting', () => {
		spyOn(component, 'onTableSortingChanged');
		fixture.detectChanges();
		component.onTableSortingChanged(cuiTable);
		expect(component.onTableSortingChanged)
			.toHaveBeenCalled();
	});

	it('should close the panal', () => {
		fixture.detectChanges();
		component.onPanelClose();
		expect(component.selectedAsset)
			.toBeNull();
	});

	it('should connect to asset panal', () => {
		fixture.detectChanges();
		mockAlarm.customerId = '1234';
		component.connectToAssetDetails(mockAlarm);
		expect(component.selectedAsset)
			.toEqual(mockAlarm);
	});

	it('should call on pager update', () => {
		const pageData = {
			limit: 10,
			page: 1,
		};
		component.onPagerUpdated(pageData);
		expect(component.tableOffset)
			.toEqual(1);
	});

	it('should sub filter on select', () => {
		component.onSubfilterSelect();
		expect(component.tableData)
			.toEqual([]);
	});

	it('should show alarm details', () => {
		component.onAlarmPanelClose();
		fixture.detectChanges();
		component.eventStatus = true;
		component.onAlarmPanelClose();
		expect(component.showAlarmDetails)
			.toBeFalsy();
	});

	it('should call search filter', () => {
		const mockEvent = {
			keyCode: 12,
		};
		component.keyDownAfmSearchFilter(mockEvent);
		fixture.detectChanges();
		spyOn(component, 'searchFilter');
		const event = {
			keyCode: 13,
		};
		component.keyDownAfmSearchFilter(event);
		expect(component.searchFilter)
			.toHaveBeenCalled();
	});

	it('should be called on table sorting changed', () => {
		const eventSyslog = {
			name: 'Syslog Event',
			sortDirection: 'Syslog Event Description',
		};
		component.searchParams.headerFilterType = 'TAC';
		component.onTableSortingChanged(eventSyslog);
		fixture.detectChanges();
		const eventFault = {
			name: 'Fault IC',
			sortDirection: 'Fault IC description',
		};
		component.searchParams.headerFilterType = 'SEARCH';
		component.onTableSortingChanged(eventFault);
		fixture.detectChanges();
		const eventSerial = {
			name: 'Serial Number',
			sortDirection: 'Serial number description',
		};
		component.searchParams.headerFilterType = 'IGNORE_EVENT';
		component.onTableSortingChanged(eventSerial);
		fixture.detectChanges();
		const eventSeverity = {
			name: 'Event Severity',
			sortDirection: 'Event Severity description',
		};
		component.searchParams.headerFilterType = 'CHATS';
		component.onTableSortingChanged(eventSeverity);
		fixture.detectChanges();
		const eventCase = {
			name: 'Case ID',
			sortDirection: 'Case Id description',
		};
		component.searchParams.headerFilterType = 'ALARM';
		component.onTableSortingChanged(eventCase);
		fixture.detectChanges();
		const eventTime = {
			name: 'Time Created',
			sortDirection: 'Time Created description',
		};
		component.onTableSortingChanged(eventTime);
		fixture.detectChanges();
		const eventStatus = {
			name: 'Event Status',
			sortDirection: 'Event Status description',
		};
		component.onTableSortingChanged(eventStatus);
		fixture.detectChanges();
		const eventDefault = {
			name: 'Default',
			sortDirection: 'Default description',
		};
		component.searchParams.headerFilterType = 'Default';
		component.onTableSortingChanged(eventDefault);
		expect(component.loading)
			.toBeTruthy();
	});

	it('should select time range filter', () => {
		spyOn(afmService, 'getTimeRangeFilteredEvents')
			.and
			.returnValue(of(<any> AfmScenarios[3].scenarios.POST[0].response.body));
		const subfilter = 1;
		afmFilter.seriesData = [
			{
				filter: 1,
				label: '24hr',
				selected: false,
				value: 0,
			},
			{
				filter: 7,
				label: '7Days',
				selected: false,
				value: 2,
			},
		];
		component.onTimeRangefilterSelect(subfilter, afmFilter, true);
		expect(afmService.getTimeRangeFilteredEvents)
			.toHaveBeenCalled();
		expect(afmFilter.seriesData[0].selected)
			.toBeTruthy();
	});

	it('should not select time range filter', () => {
		spyOn(afmService, 'getTimeRangeFilteredEvents')
			.and
			.returnValue(of(<any> AfmScenarios[3].scenarios.POST[0].response.body));
		const subfilter = 7;
		afmFilter.seriesData = [
			{
				filter: 1,
				label: '24hr',
				selected: false,
				value: 0,
			},
		];
		component.onTimeRangefilterSelect(subfilter, afmFilter, false);
		expect(afmService.getTimeRangeFilteredEvents)
			.toHaveBeenCalled();
		expect(afmFilter.seriesData[0].selected)
			.toBeFalsy();
	});

	it('should return filters', () => {
		component.getSelectedSubFilters('Filter');
		fixture.detectChanges();
		component.filters =  [
			{
				key: 'afmFilter',
				loading: true,
				selected: true,
				seriesData: [
					{
						filter: '',
						label: '',
						selected: true,
						value: 12,
					},
				],
				title: '',
			}];
		component.getSelectedSubFilters('afmFilter');
		expect(component.getSelectedSubFilters('afmFilter'))
		.toBeDefined();
	});

	it('should clear filters', () => {
		component.filters =  [
			{
				key: 'afmFilter',
				loading: true,
				selected: true,
				seriesData: [
					{
						filter: '',
						label: '',
						selected: true,
						value: 12,
					},
				],
				title: '',
			}];
		component.clearFilters();
		expect(component.filtered)
		.toBeFalsy();
	});

	it('should export all events to csv', () => {
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(of(<any> AfmScenarios[7].scenarios.GET[0].response.body));
		component.exportAllEvents();
		expect(afmService.exportAllRecords)
			.toHaveBeenCalled();
	});

	it('should fail the export all service', () => {
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(of(<any> AfmScenarios[10].scenarios.GET[0].response.body));
		component.exportAllEvents();
		expect(afmService.exportAllRecords)
			.toHaveBeenCalled();
		expect(component.statusErrorMessage)
			.toEqual('failed retrived records');
	});

	it('should exception happen in export all service', () => {
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(of(<any> AfmScenarios[11].scenarios.GET[0].response.body));
		component.exportAllEvents();
		expect(afmService.exportAllRecords)
			.toHaveBeenCalled();
		expect(component.statusErrorMessage)
			.toEqual('Server is down, please try again.');
	});

	it('should throw an error in export all service', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(throwError(new HttpErrorResponse(error).statusText));
		component.exportAllEvents();
		expect(component.statusErrorMessage)
			.toEqual('Export operation failed :: Error : (Resource not found)');
	});

	it('should update the event', () => {
		const event = {
			status: true,
		};
		component.eventUpdated(event);
		expect(component.eventStatus)
		.toBeTruthy();
	});

	describe('connectToAlarmDetails', () => {
		it('should collect alarm details', () => {
			spyOn(afmService, 'getAfmEvents')
				.and
				.returnValue(of(<any> AfmScenarios[4].scenarios.POST[0].response.body));
			mockAlarm.syslogMsg = 'Sys log message';
			mockAlarm.alarmId = 1001;
			afmService = TestBed.get(AfmService);
			component.connectToAlarmDetails(mockAlarm);
			expect(afmService.getAfmEvents(mockAfmSearchParams))
				.toBeTruthy();
			expect(component.syslogEvent)
				.toEqual('Sys log message');
			expect(component.showAlarmDetails)
				.toBeTruthy();
			expect(component.selectedAsset)
				.toBeNull();
			expect(afmService.getAfmEvents)
				.toHaveBeenCalled();
		});

		it('should call tac case filters', () => {
			spyOn(afmService, 'getTacCases')
				.and
				.returnValue(of(<any> AfmScenarios[2].scenarios.POST[0].response.body));
			component.tacCaseFilters();
			expect(afmService.getTacCases)
				.toHaveBeenCalled();
		});

		it('should load afm alarms', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(<any> AfmScenarios[1].scenarios.POST[0].response.body));
			mockAfmSearchParams.pageSize = 10;
			mockAfmSearchParams.pageNumber = 1;
			mockAfmSearchParams.headerFilterType = 'ALARM';
			mockAfmSearchParams.searchTerm = '';
			fixture.detectChanges();
			component.allAlarmFilter();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load afm alarms with no status', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(<any> AfmScenarios[6].scenarios.POST[0].response.body));
			mockAfmSearchParams.pageSize = 10;
			mockAfmSearchParams.pageNumber = 1;
			mockAfmSearchParams.headerFilterType = 'ALARM';
			mockAfmSearchParams.searchTerm = '';
			fixture.detectChanges();
			component.aggregationCount.set('Day1', 1)
			.set('Days7', 1);
			component.allAlarmFilter();
			expect(component.loading)
				.toBeFalsy();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load afm alarms with failed status', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(<any> AfmScenarios[8].scenarios.POST[0].response.body));
			mockAfmSearchParams.pageSize = 10;
			mockAfmSearchParams.pageNumber = 1;
			mockAfmSearchParams.headerFilterType = 'ALARM';
			mockAfmSearchParams.searchTerm = '';
			fixture.detectChanges();
			component.aggregationCount.set('Day1', 1)
			.set('Days7', 1);
			component.allAlarmFilter();
			expect(component.loading)
				.toBeFalsy();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load Afm Search Filter Info with lower case p', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(<any> AfmScenarios[5].scenarios.POST[0].response.body));
			component.afmSearchInput = 'parabola';
			component.searchFilter();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load Afm Search Filter Info with ', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(<any> AfmScenarios[5].scenarios.POST[0].response.body));
			component.afmSearchInput = 'Square';
			component.searchFilter();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});
	});
});
