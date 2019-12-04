import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaultDetailsComponent } from './fault-details.component';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FaultDetailsModule } from './fault-details.module';
import { FaultService } from '@sdp-api';
import { RouterTestingModule } from '@angular/router/testing';
import { FaultScenarios } from '@mock';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetPanelLinkService, DetailsPanelStackService, RacetrackInfoService } from '@services';
import { UserResolve } from '@utilities';

describe('FaultDetailsComponent', () => {
	let component: FaultDetailsComponent;
	let fixture: ComponentFixture<FaultDetailsComponent>;
	let faultService: FaultService;
	let detailsPanelStackService: DetailsPanelStackService;
	let assetPanelLinkService: AssetPanelLinkService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FaultDetailsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [FaultService, AssetPanelLinkService,
				RacetrackInfoService, UserResolve],
		});
	});

	beforeEach(() => {
		faultService = TestBed.get(FaultService);
		detailsPanelStackService = TestBed.get(DetailsPanelStackService);
		assetPanelLinkService = TestBed.get(AssetPanelLinkService);
		fixture = TestBed.createComponent(FaultDetailsComponent);
		component = fixture.componentInstance;
		component.fault = {
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%Title',
			systemCount: 2,
			tacCount: 1,
			title: 'Title',
		};
		component.faultParams = {
			contractLevel: '',
			customerId: '',
			fromDate: '',
			toDate: '',
			syslogSeverity: '',
			systemFilter: '',
			localSearch: '',
			sortField: '',
			sortOrder: '',
			pageNo: 0,
			vaId: '',
			useCase: '',
			solution: '',
			size: 0,
			eventType: '',
			software: '',
			productId: '',
			tacEnabled: 'active',
			days: 30,
			filterTypes: '',
			faultSeverity: '',
			lastUpdateTime: '',
			msgType: '',
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should get the summary details', () => {
		spyOn(faultService, 'getSummaryDetails')
			.and
			.returnValue(of<any>(FaultScenarios[1].scenarios.POST[0].response.body));
		component.getFaultSummaryDetails(component.searchParams);
		expect(faultService.getSummaryDetails)
			.toHaveBeenCalled();
		expect(component.faultDetails[0].severity)
			.toEqual('2');
	});

	it('should throw an error in fault summary details', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(faultService, 'getSummaryDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getFaultSummaryDetails(component.searchParams);
		expect(faultService.getSummaryDetails)
			.toHaveBeenCalled();
	});

	it('should get the affected systems', () => {
		spyOn(faultService, 'getAffectedSystems')
			.and
			.returnValue(of<any>(FaultScenarios[2].scenarios.POST[0].response.body));
		component.getAffectedSystemDetails(component.searchParams);
		expect(faultService.getAffectedSystems)
			.toHaveBeenCalled();
		expect(component.affectedCount)
			.toEqual(2);
	});

	it('should throw an error in fault affected systems', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(faultService, 'getAffectedSystems')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getAffectedSystemDetails(component.searchParams);
		expect(faultService.getAffectedSystems)
				.toHaveBeenCalled();
	});

	it('should get the fault filter data', () => {
		spyOn(faultService, 'getFaultFiltersData')
			.and
			.returnValue(of<any>(FaultScenarios[3].scenarios.POST[0].response.body));
		component.getFiltersData();
		expect(faultService.getFaultFiltersData)
			.toHaveBeenCalled();
		expect(component.productID[0].value)
			.toEqual('10101');
	});

	it('should throw an error in fault filter data', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(faultService, 'getFaultFiltersData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getFiltersData();
		expect(faultService.getFaultFiltersData)
				.toHaveBeenCalled();
	});

	it('should hide the details panel', () => {
		const hidden = false;
		component.handleHidden(hidden);
		const hiddenTrue = true;
		component.handleHidden(hiddenTrue);
		expect(component.selectedAsset)
			.toBeFalsy();
	});

	it('should close all panel', () => {
		component.onAllPanelsClose();
		expect(component.showFaultDetails)
			.toBeDefined();
	});

	it('should back the details panel', () => {
		spyOn(detailsPanelStackService, 'pop');
		component.onPanelBack();
		expect(detailsPanelStackService.pop)
			.toHaveBeenCalled();
	});

	it('should update grid on product id filter selection', () => {
		spyOn(faultService, 'getAffectedSystems')
			.and
			.returnValue(of<any>(FaultScenarios[2].scenarios.POST[0].response.body));
		component.onSelection('1001', 'productId');
		expect(faultService.getAffectedSystems)
			.toHaveBeenCalled();
	});

	it('should update grid on software filter selection', () => {
		spyOn(faultService, 'getAffectedSystems')
			.and
			.returnValue(of<any>(FaultScenarios[2].scenarios.POST[0].response.body));
		component.onSelection('1001', 'software');
		expect(faultService.getAffectedSystems)
			.toHaveBeenCalled();
	});

	it('should update grid on days filter selection', () => {
		spyOn(faultService, 'getAffectedSystems')
			.and
			.returnValue(of<any>(FaultScenarios[2].scenarios.POST[0].response.body));
		component.onSelection('1001', 'days');
		expect(faultService.getAffectedSystems)
			.toHaveBeenCalled();
	});

	it('should connect to asset panel', () => {
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
						customerId: '231215372',
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
		spyOn(assetPanelLinkService, 'getAssetLinkData')
			.and
			.returnValue(of(assetLinkResponse));
		component.connectToAsset('FCH2139V1B0');
		expect(assetPanelLinkService.getAssetLinkData)
			.toHaveBeenCalled();
		expect(component.assetLinkInfo.asset.deviceName)
			.toEqual('5520-1');
	});

	it('should throw error connecting to asset panel', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(assetPanelLinkService, 'getAssetLinkData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.connectToAsset('FCH2139V1B0');
		expect(assetPanelLinkService.getAssetLinkData)
			.toHaveBeenCalled();
	});

	it('should connect to case details panel', () => {
		component.connectToCaseDetails('696948073');
		expect(component.selectedCase.caseNumber)
			.toEqual('696948073');
	});

	it('should close case panel', () => {
		component.detailsClose();
		expect(component.selectedCase)
			.toBeNull();
	});

	it('should open confirmation toast', () => {
		spyOn(faultService, 'updateIcSettings')
			.and
			.returnValue(of<any>(FaultScenarios[5].scenarios.POST[0].response.body));
		component.searchParams.tacEnabled = 'active';
		component.openConfirmation();
		expect(faultService.updateIcSettings)
			.toHaveBeenCalled();
	});

	it('should open toasft for automated faults', () => {
		spyOn(faultService, 'updateIcSettings')
			.and
			.returnValue(of<any>(FaultScenarios[5].scenarios.POST[0].response.body));
		component.searchParams.tacEnabled = 'inactive';
		component.openConfirmation();
		expect(faultService.updateIcSettings)
			.toHaveBeenCalled();
	});

	it('should not open the toast', () => {
		const response = {
			status: null,
			statusCode: 'Failed',
			statusMessage: 'Failed tp update the record',
		};
		spyOn(faultService, 'updateIcSettings')
			.and
			.returnValue(of<any>(response));
		component.updateIcSettings(component.searchIcParams);
		expect(faultService.updateIcSettings)
			.toHaveBeenCalled();
	});

	it('should throw error on updating Ic settings', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(faultService, 'updateIcSettings')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.updateIcSettings(component.searchIcParams);
		expect(faultService.updateIcSettings)
			.toHaveBeenCalled();
	});

	it('should update the pager', () => {
		const pageInfo = {
			page: 2,
		};
		spyOn(component, 'getAffectedSystemDetails')
			.and
			.callThrough();
		component.onPagerUpdated(pageInfo);
		expect(component.searchParams.pageNo)
			.toEqual(3);
	});

	it('should call affected system on changes of table sorting', () => {
		spyOn(component, 'getAffectedSystemDetails')
			.and
			.callThrough();
		const eventSystem = {
			name: 'System Name',
		};
		component.onTableSortingChanged(eventSystem);
		expect(component.getAffectedSystemDetails)
			.toHaveBeenCalledTimes(1);

		const eventProduct = {
			name: 'Product ID',
		};
		component.onTableSortingChanged(eventProduct);
		expect(component.getAffectedSystemDetails)
			.toHaveBeenCalledTimes(2);

		const eventSoftware = {
			name: 'Software Type',
		};
		component.onTableSortingChanged(eventSoftware);
		expect(component.getAffectedSystemDetails)
			.toHaveBeenCalledTimes(3);

		const eventCase = {
			name: 'Case Number',
		};
		component.onTableSortingChanged(eventCase);
		expect(component.getAffectedSystemDetails)
			.toHaveBeenCalledTimes(4);

		const eventDate = {
			name: 'Date and Time',
		};
		component.onTableSortingChanged(eventDate);
		expect(component.getAffectedSystemDetails)
			.toHaveBeenCalledTimes(5);

		const eventDefault = {
			name: 'Default',
		};
		component.onTableSortingChanged(eventDefault);
		expect(component.getAffectedSystemDetails)
			.toHaveBeenCalledTimes(6);
	});

});
