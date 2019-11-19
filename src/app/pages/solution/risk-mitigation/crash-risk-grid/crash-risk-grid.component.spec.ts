import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { CrashRiskGridComponent } from './crash-risk-grid.component';
import { CrashRiskGridModule } from './crash-risk-grid.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HighCrashRiskPagination, RiskMitigationService } from '@sdp-api';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user, RiskScenarios } from '@mock';
import { LogService } from '@cisco-ngx/cui-services';

describe('CrashRiskGridComponent', () => {
	let component: CrashRiskGridComponent;
	let fixture: ComponentFixture<CrashRiskGridComponent>;
	let crashRiskGridService: RiskMitigationService;

	beforeEach((() => {
		TestBed.configureTestingModule({
			declarations: [CrashRiskGridComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		crashRiskGridService = TestBed.get(RiskMitigationService);
		fixture = TestBed.createComponent(CrashRiskGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CrashRiskGridModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				RiskMitigationService,
				LogService,
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

	it('Should get the High Crash Risk devices grid data', fakeAsync(() => {
		const changes: SimpleChanges = {
			selectedFilter: new SimpleChange({ }, { selectedFilter: 'Success' }, false),
			selectedSolution: new SimpleChange({ }, { selectedSolution: 'Success' }, false),
			selectedTechnology: new SimpleChange({ }, { selectedTechnology: 'Success' }, false),
			serchQuery: new SimpleChange({ }, { serchQuery: 'Success' }, false),
		};
		spyOn(crashRiskGridService, 'getFingerPrintDeviceDetailsData')
			.and
			.returnValue(of(RiskScenarios[4].scenarios.GET[0].response.body));
		const test: HighCrashRiskPagination = {
			customerId: 2431199 ,
			globalRiskRank: 'IBN',
			limit : 10,
			page: 0,
			search: 'Cisco',
			size: 10,
			solution: 'IBN',
			sort: 'asc',
			useCase: 'Campus Network',
		};
		component.ngOnChanges(changes);
		component.getFingerPrintDeviceDetails(test);
		tick(1000);
		fixture.detectChanges();
		expect(component.highCrashRiskSystemsGridDetails.tableData)
		.toBeDefined();
	}));

	it('Should not set grid data when response is empty', fakeAsync(() => {
		const changes: SimpleChanges = {
			selectedFilter: new SimpleChange({ }, { selectedFilter: 'Success' }, false),
			selectedSolution: new SimpleChange({ }, { selectedSolution: 'Success' }, false),
			selectedTechnology: new SimpleChange({ }, { selectedTechnology: 'Success' }, false),
			serchQuery: new SimpleChange({ }, { serchQuery: 'Success' }, false),
		};
		spyOn(crashRiskGridService, 'getFingerPrintDeviceDetailsData')
			.and
			.returnValue(of(RiskScenarios[8].scenarios.GET[0].response.body));
		const test: HighCrashRiskPagination = {
			customerId: 2431199 ,
			globalRiskRank: 'LOW',
			limit : 10,
			page: 0,
			search: 'Cisco',
			size: 10,
			solution: 'IBN',
			sort: 'asc',
			useCase: 'Campus Network',
		};
		component.ngOnChanges(changes);
		component.getFingerPrintDeviceDetails(test);
		tick(1000);
		fixture.detectChanges();
		expect(component.highCrashRiskSystemsGridDetails.totalItems)
			.toBeFalsy();
	}));

	it('should initialize the values and parameter to be called ', () => {
		const changes: SimpleChanges = {
			selectedFilter: new SimpleChange({ }, { selectedFilter: 'Success' }, false),
			selectedSolution: new SimpleChange({ }, { selectedSolution: 'Success' }, false),
			selectedTechnology: new SimpleChange({ }, { selectedTechnology: 'Success' }, false),
			serchQuery: new SimpleChange({ }, { serchQuery: 'Success' }, false),
		};
		component.ngOnChanges(changes);

		expect(component.highCrashRiskParams)
			.toBeDefined();
	});

	it('should initialize the values and parameter to be called ', () => {
		component.highCrashRiskParams = {
			customerId: 2431199 ,
			limit : 0,
			page: 0,
			search: '',
			size: 0,
			sort: 'asc',
		};
		const param: HighCrashRiskPagination = {
			customerId: 2431199 ,
			globalRiskRank: 'HIGH',
			limit : 10,
			page: 0,
			search: 'Cisco',
			size: 10,
			solution: 'IBN',
			sort: 'asc',
			useCase: 'Campus Network Assurance',
		};
		component.onHcrPagerUpdated(param);
		expect(component.highCrashRiskSystemsGridDetails.tableOffset)
		.toBe(0);
		expect(component.highCrashRiskSystemsGridDetails.tableLimit)
		.toBe(10);
	});
	it('should unset the selected System', () => {
		component.onPanelClose();
		expect(component.selectedFingerPrintdata)
		.toBeFalsy();
	});

	it('should connect to Finger Print Details ', () => {
		const crashRiskAssest = {
			crashCount: 2,
			firstOccurrence: 'July 19, 2019 06:08:31',
			ipAddress: '10.119.1.151',
			lastOccurrence: 'July 28, 2019 23:26:07',
			neInstanceId: 'NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA',
			neName: '1971THE2-swi-LIMDR_P5_1_SD_DR.tbc.limad.net',
			productFamily: 'Cisco Catalyst 2960-S Series Switches',
			productId: 'WS-C2960S-24PS-L',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '12.2(55)SE3',
		};

		component.connectToFpDetails(crashRiskAssest);
		expect(component.selectedFingerPrintdata)
		.toBeDefined();
		expect(component.selectedFingerPrintdata.active)
		.toBeTruthy();
	});

	it('should load sorted data on sort ', () => {
		component.highCrashRiskParams = {
			customerId: 2431199 ,
			limit : 0,
			page: 0,
			search: '',
			size: 0,
			sort: '',
		};
		const fpDataSpy = spyOn(component, 'getFingerPrintDeviceDetails');
		component.highCrashTableSorted({
			key: 'globalRiskRank',
			sortDirection: 'ASC',
		});
		expect(fpDataSpy)
		.toHaveBeenCalled();
		expect(component.highCrashRiskParams.sort)
		.toBeTruthy();
	});

});
