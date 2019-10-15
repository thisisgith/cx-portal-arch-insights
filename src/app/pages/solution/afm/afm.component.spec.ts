import { configureTestSuite } from 'ng-bullet';
import { AfmComponent } from './afm.component';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaultManagementModule } from './afm.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AfmScenarios } from '@mock';
import {
	AfmService, AfmSearchParams, Alarm,
} from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';
import { I18n } from '@cisco-ngx/cui-utils';
import * as enUSJson from '../../../../assets/i18n/en-US.json';
import {
	AssetPanelLinkService,
	DetailsPanelStackService,
} from '@services';

describe('AfmComponent', () => {
	let component: AfmComponent;
	let fixture: ComponentFixture<AfmComponent>;
	const afmSearchParams: AfmSearchParams = new Object();
	const alarm: Alarm = new Object();
	let afmService: AfmService;
	let detailsPanelStackService: DetailsPanelStackService;
	let assetPanelLinkService: AssetPanelLinkService;
	const afmFilter: any = new Object();

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FaultManagementModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [AfmService, DetailsPanelStackService, AssetPanelLinkService],
		});
	});

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);
		afmService = TestBed.get(AfmService);
		detailsPanelStackService = TestBed.get(DetailsPanelStackService);
		assetPanelLinkService = TestBed.get(AssetPanelLinkService);
		fixture = TestBed.createComponent(AfmComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should ignore alarm filters', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		component.ignoreAlarmFilters();
		expect(component.tableOffset)
			.toEqual(0);
	});

	it('should change table sorting', () => {
		const sort = {
			name: 'Status',
			sortDirection: 'asc',
		};
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		fixture.detectChanges();
		component.onTableSortingChanged(sort);
		expect(component.searchParams.sortField)
			.toEqual('status.keyword');
		expect(component.searchParams.sortType)
			.toEqual('asc');
		expect(afmService.getAfmAlarms)
			.toHaveBeenCalled();
	});

	it('should close the panal', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		fixture.detectChanges();
		component.onPanelClose();
		expect(component.selectedAsset)
			.toBeNull();
	});

	it('should connect to asset panal', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		fixture.detectChanges();
		alarm.customerId = '1234';
		component.connectToAssetDetails(alarm);
		expect(component.selectedAsset)
			.toEqual(alarm);
	});

	it('should call on pager update', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		const pageData = {
			limit: 10,
			page: 1,
		};
		component.onPagerUpdated(pageData);
		expect(component.tableOffset)
			.toEqual(1);
	});

	it('should sub filter on select', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		spyOn(component, 'clearFilters');
		component.onSubfilterSelect();
		expect(component.clearFilters)
			.toHaveBeenCalled();
	});

	it('should show alarm details', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		component.onAllPanelsClose();
		component.eventStatus = true;
		component.onAllPanelsClose();
		expect(afmService.getAfmAlarms)
			.toHaveBeenCalled();
	});

	it('should call search filter', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		const mockEvent = {
			keyCode: 12,
		};
		component.keyDownAfmSearchFilter(mockEvent);
		spyOn(component, 'searchFilter');
		const event = {
			keyCode: 13,
		};
		component.keyDownAfmSearchFilter(event);
		expect(component.searchFilter)
			.toHaveBeenCalled();
	});

	// Ok, seriously? We need to make this a real test of SOMETHING
	it('should be called on table sorting changed', () => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		const eventSyslog = {
			name: 'Syslog Event',
			sortDirection: 'Syslog Event Description',
		};
		fixture.detectChanges();
		expect(afmService.getAfmAlarms)
			.toHaveBeenCalled();
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
		fixture.detectChanges();
		expect(component.loading)
			.toBeFalsy();
	});

	it('should select time range filter', fakeAsync(() => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		spyOn(afmService, 'getTimeRangeFilteredEvents')
			.and
			.returnValue(of(AfmScenarios[3].scenarios.POST[0].response.body));
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
		tick();
		expect(afmService.getTimeRangeFilteredEvents)
			.toHaveBeenCalled();
		expect(afmFilter.seriesData[0].selected)
			.toBeTruthy();
	}));

	it('should not select time range filter', fakeAsync(() => {
		spyOn(afmService, 'getAfmAlarms')
			.and
			.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
		spyOn(afmService, 'getTimeRangeFilteredEvents')
			.and
			.returnValue(of(AfmScenarios[3].scenarios.POST[0].response.body));
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
		tick();
		expect(afmService.getTimeRangeFilteredEvents)
			.toHaveBeenCalled();
		expect(afmFilter.seriesData[0].selected)
			.toBeFalsy();
	}));

	it('should return filters', () => {
		component.getSelectedSubFilters('Filter');
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
			.returnValue(of(AfmScenarios[7].scenarios.POST[0].response.body));
		component.exportAllEvents();
		expect(afmService.exportAllRecords)
			.toHaveBeenCalled();
	});

	it('should fail the export all service', fakeAsync(() => {
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(of(<any> AfmScenarios[10].scenarios.GET[0].response.body));
		component.exportAllEvents();
		expect(afmService.exportAllRecords)
			.toHaveBeenCalled();
		tick();
		expect(component.statusErrorMessage)
			.toEqual('failed retrived records');
	}));

	it('should exception happen in export all service', fakeAsync(() => {
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(of(<any> AfmScenarios[11].scenarios.GET[0].response.body));
		component.exportAllEvents();
		expect(afmService.exportAllRecords)
			.toHaveBeenCalled();
		tick();
		expect(component.statusErrorMessage)
			.toEqual('Server is down, please try again.');
	}));

	it('should throw an error in export all service', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(afmService, 'exportAllRecords')
			.and
			.returnValue(throwError(new HttpErrorResponse(error).statusText));
		component.exportAllEvents();
		tick();
		expect(component.statusErrorMessage)
			.toEqual('Export operation failed :: Error : (Resource not found)');
	}));

	it('should update the event', () => {
		const event = true;
		component.eventUpdated(event);
		expect(component.eventStatus)
		.toBeTruthy();
	});

	it('should call on panel back', () => {
		spyOn(detailsPanelStackService, 'pop');
		component.onPanelBack();
		expect(detailsPanelStackService.pop)
		.toHaveBeenCalled();
	});

	it('should handel panel to hide', () => {
		spyOn(detailsPanelStackService, 'reset');
		component.handleHidden(false);
		fixture.detectChanges();
		component.handleHidden(true);
		expect(component.showAlarmDetails)
		.toBeFalsy();
		expect(detailsPanelStackService.reset)
		.toHaveBeenCalled();
	});

	it('should get the filters', () => {
		const filter = [
			{
				key: 'timeRange',
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
			},
		];
		component.filters = filter;
		expect(component.selectedFilters)
		.toEqual(filter);
	});

	describe('connectToAlarmDetails', () => {
		it('should collect alarm details', () => {
			const assetLinkResponse = [
				{
					data: [
						{
							contractNumber: '',
							criticalAdvisories: '0',
							deviceName: '5520-1',
							equipmentType: 'CHASSIS',
							hwInstanceId: 'FCH2139V1B0',
							ipAddress: '10.105.218.192',
						},
					],
				},
				{
					data: [
						{
							customerId: '7293498',
							hostName: '5520-1',
							imageName: null,
							installedMemory: 0,
							ipAddress: '10.105.218.192',
							isManagedNE: true,
							lastResetReason: null,
							lastUpdateDate: '2019-08-30T17:47:30',
						},
					],
				},
			];

			spyOn(afmService, 'getAfmEvents')
				.and
				.returnValue(of(AfmScenarios[4].scenarios.POST[0].response.body));
			spyOn(assetPanelLinkService, 'getAssetLinkData')
				.and
				.returnValue(of(assetLinkResponse));
			component.searchParams.customerId = '2431199';
			component.searchParams.serialNumber = '1234';
			alarm.status = 'Failed';
			component.connectToAlarmDetails(alarm);
			fixture.detectChanges();
			alarm.syslogMsg = 'Sys log message';
			alarm.alarmId = 1001;
			alarm.status = 'Success';
			component.showAlarmDetails = true;
			component.connectToAlarmDetails(alarm);
			fixture.detectChanges();
			component.showAlarmDetails = false;
			component.connectToAlarmDetails(alarm);
			expect(afmService.getAfmEvents(afmSearchParams))
				.toBeTruthy();
			expect(component.syslogEvent)
				.toEqual('Sys log message');
			expect(component.showAlarmDetails)
				.toBeTruthy();
			expect(component.selectedAsset)
				.toBeNull();
			expect(afmService.getAfmEvents)
				.toHaveBeenCalled();
			expect(assetPanelLinkService.getAssetLinkData)
				.toHaveBeenCalled();
		});

		it('should call tac case filters', () => {
			spyOn(afmService, 'getTacCases')
				.and
				.returnValue(of(AfmScenarios[2].scenarios.POST[0].response.body));
			component.tacCaseFilters();
			expect(afmService.getTacCases)
				.toHaveBeenCalled();
		});

		it('should load afm alarms', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
			afmSearchParams.pageSize = 10;
			afmSearchParams.pageNumber = 1;
			afmSearchParams.headerFilterType = 'ALARM';
			afmSearchParams.searchTerm = '';
			component.allAlarmFilter();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load afm alarms with no status', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(AfmScenarios[6].scenarios.POST[0].response.body));
			afmSearchParams.pageSize = 10;
			afmSearchParams.pageNumber = 1;
			afmSearchParams.headerFilterType = 'ALARM';
			afmSearchParams.searchTerm = '';
			component.allAlarmFilter();
			expect(component.searchParams.firstTimeLoading)
				.toBeTruthy();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load afm alarms with failed status', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(AfmScenarios[8].scenarios.POST[0].response.body));
			afmSearchParams.pageSize = 10;
			afmSearchParams.pageNumber = 1;
			afmSearchParams.headerFilterType = 'ALARM';
			afmSearchParams.searchTerm = '';
			component.allAlarmFilter();
			expect(component.loading)
				.toBeFalsy();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load Afm Search Filter Info with lower case p', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
			component.afmSearchInput = 'parabola';
			component.searchFilter();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});

		it('should load Afm Search Filter Info with ', () => {
			spyOn(afmService, 'getAfmAlarms')
				.and
				.returnValue(of(AfmScenarios[0].scenarios.POST[0].response.body));
			component.afmSearchInput = 'Square';
			component.searchFilter();
			expect(afmService.getAfmAlarms)
				.toHaveBeenCalled();
		});
	});
});
