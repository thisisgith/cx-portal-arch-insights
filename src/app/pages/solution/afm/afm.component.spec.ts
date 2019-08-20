import { AfmComponent } from './afm.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FaultManagementModule } from './afm.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AfmScenarios } from 'src/environments/mock/afm/afm';
import { environment } from '@environment';
import { of } from 'rxjs';
import { user } from '@mock';
import {
	AfmService, AfmSearchParams, Alarm,
} from '@sdp-api';

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

	it('should clear all filters', () => {
		spyOn(component, 'allAlarmFilter');
		component.clearFilters();
		fixture.detectChanges();
		expect(component.allAlarmFilter)
			.toHaveBeenCalled();
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
		expect(component.showAlarmDetails)
			.toBeFalsy();
	});

	it('should call search filter', () => {
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
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventSyslog);
		fixture.detectChanges();
		const eventFault = {
			name: 'Fault IC',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventFault);
		fixture.detectChanges();
		const eventSerial = {
			name: 'Serial Number',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventSerial);
		fixture.detectChanges();
		const eventSeverity = {
			name: 'Event Severity',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventSeverity);
		fixture.detectChanges();
		const eventCase = {
			name: 'Case ID',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventCase);
		fixture.detectChanges();
		const eventTime = {
			name: 'Time Created',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventTime);
		fixture.detectChanges();
		const eventStatus = {
			name: 'Event Status',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventStatus);
		fixture.detectChanges();
		const eventDefault = {
			name: 'Default',
			sortDirection: 'Abc',
		};
		component.onTableSortingChanged(eventDefault);
		expect(component.loading)
			.toBeTruthy();
	});

	it('should time range filter', () => {
		spyOn(afmService, 'getTimeRangeFilteredEvents')
			.and
			.returnValue(of(<any> AfmScenarios[3].scenarios.POST[0].response.body));
		const subfilter = 12;
		afmFilter.seriesData = [];
		component.onTimeRangefilterSelect(subfilter, afmFilter);
		expect(component.loading)
			.toBeTruthy();
		expect(afmService.getTimeRangeFilteredEvents)
			.toHaveBeenCalled();
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

		it('should call allAlarmFilter', () => {
			spyOn(component, 'allAlarmFilter');
			component.searchFilter();
			expect(component.allAlarmFilter)
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
			expect(component.loading)
				.toBeTruthy();
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
			component.allAlarmFilter();
			expect(component.loading)
				.toBeTruthy();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load Afm Search Filter Info with lower case p', () => {
			spyOn(afmService, 'getAfmSearchFilterInfo')
				.and
				.returnValue(of(<any> AfmScenarios[5].scenarios.POST[0].response.body));
			component.afmSearchInput = 'parabola';
			component.searchFilter();
			expect(afmService.getAfmSearchFilterInfo)
				.toHaveBeenCalled();
		});

		it('should load Afm Search Filter Info with ', () => {
			spyOn(afmService, 'getAfmSearchFilterInfo')
				.and
				.returnValue(of(<any> AfmScenarios[5].scenarios.POST[0].response.body));
			component.afmSearchInput = 'Square';
			component.searchFilter();
			expect(afmService.getAfmSearchFilterInfo)
				.toHaveBeenCalled();
		});

	});

});
