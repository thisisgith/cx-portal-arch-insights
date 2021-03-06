import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrashedSystemsGridComponent } from './crashed-systems-grid.component';

import { user, RiskScenarios } from '@mock';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RiskMitigationService } from '@sdp-api';
import { configureTestSuite } from 'ng-bullet';
import { CrashedSystemsGridModule } from './crashed-systems-grid.module';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
describe('CrashedSystemsGridComponent', () => {
	let component: CrashedSystemsGridComponent;
	let fixture: ComponentFixture<CrashedSystemsGridComponent>;
	let crashRiskGridService: RiskMitigationService;

	beforeEach((() => {
		TestBed.configureTestingModule({
			declarations: [CrashedSystemsGridComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		// I18n.injectDictionary(enUSJson);
		crashRiskGridService = TestBed.get(RiskMitigationService);
		fixture = TestBed.createComponent(CrashedSystemsGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CrashedSystemsGridModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [RiskMitigationService,
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

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it('Implement Pagination for CrashSystems', () => {
		const pageInfo = {
			limit: 10,
			page: 1,
		};
		component.onPagerUpdated(pageInfo);
		expect(component.pageFirstRecord)
		.toBe(0);
		component.crashedSystemsGridDetails.totalItems = 10;
		component.onPagerUpdated(pageInfo);
		 expect(component.pageFirstRecord)
		 .toBe(11);
		expect(component.pageLastRecord)
		.toBe(10);
	});

	it('Should get the device details', () => {
		jest.spyOn(crashRiskGridService, 'getDeviceDetails')
		.mockReturnValue(of(RiskScenarios[2].scenarios.GET[0].response.body));
		component.getCrashedSystemDetails();
		fixture.detectChanges();
		expect(component.crashedSystemsGridDetails.tableData)
				.toBeDefined();

	});

	it('should close the panal', () => {
		jest.spyOn(crashRiskGridService, 'getDeviceDetails')
			.mockReturnValue(of(RiskScenarios[0].scenarios.GET[0].response.body));
		fixture.detectChanges();
		component.onPanelClose();
		expect(component.selectedSystem)
			.toBeNull();
	});
	it('should change status on Onchanges', () => {
		const fetchDataSpy = jest.spyOn(component, 'getCrashedSystemDetails');
		const changes: SimpleChanges = {
			selectedFilter: new SimpleChange({ }, { selectedFilter: 'Success' }, false),
			selectedSolution: new SimpleChange({ }, { selectedSolution: 'Success' }, false),
			selectedTechnology: new SimpleChange({ }, { selectedTechnology: 'Success' }, false),
			serchQuery: new SimpleChange({ }, { serchQuery: 'Success' }, false),
		};
		component.ngOnChanges(changes);
		expect(fetchDataSpy)
			.toHaveBeenCalled();
	});

	it('should call onTableSortingChanged ', () => {
		jest.spyOn(crashRiskGridService, 'getDeviceDetails');
		component.onTableSortingChanged({ });
	});

	it('should call sortDataByField', () => {

		const sortObj = {
			sortable: true,
			sorting: false,
			sortKey: 'lastDate',
			sortDirection: 'asc',
			render: undefined,
			key: 'neName',
		};
		const tableData = [{
			active: true,
			crashCount: 1,
			firstOccurrence: 'November 08, 2019 17:05:47',
			ipAddress: '10.11.16.2',
			lastOccurrence: 'November 08, 2019 17:05:47',
			neInstanceId: 'NA,JAB052404SP,AIR-AP3802I-B-K9,NA',
			neName: 'AMS-AP3802-24',
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			productId: 'AIR-AP3802I-B-K9',
			serialNumber: 'JAB052404SP',
			swType: 'AP-COS',
			swVersion: '8.8.120.0',
		}, {
			active: false,
			crashCount: 1,
			firstOccurrence: 'October 08, 2019 21:37:44',
			ipAddress: '10.30.17.13',
			lastOccurrence: 'October 08, 2019 21:37:44',
			neInstanceId: 'NA,ABC06340046,AIR-AP3802I-B-K9,NA',
			neName: 'LA1-AP3802-11',
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			productId: 'AIR-AP3802I-B-K9',
			serialNumber: 'ABC06340046',
			swType: 'AP-COS',
			swVersion: '8.8.120.0',
		}];
		jest.spyOn(component, 'sortTableData');
		component.sortTableData(sortObj, [sortObj], tableData);
		expect(component.sortTableData)
			.toHaveBeenCalled();
		sortObj.sortDirection = 'desc';
		component.sortTableData(sortObj, [sortObj], tableData);
		expect(component.sortTableData)
					.toHaveBeenCalled();
	});

});
