import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaultsComponent } from './faults.component';
import { configureTestSuite } from 'ng-bullet';
import { FaultsModule } from './faults.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaultService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { FaultScenarios } from '@mock';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResolve } from '@utilities';
import { RacetrackInfoService } from '@services';
describe('FaultsComponent', () => {

	let component: FaultsComponent;
	let fixture: ComponentFixture<FaultsComponent>;
	let faultService: FaultService;
	let userResolve: UserResolve;
	let racetrackInfoService: RacetrackInfoService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FaultsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [FaultService, UserResolve, RacetrackInfoService],
		});
	});

	beforeEach(() => {
		faultService = TestBed.get(FaultService);
		userResolve = TestBed.get(UserResolve);
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		fixture = TestBed.createComponent(FaultsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build table on in it', () => {
		jest.spyOn(racetrackInfoService, 'getCurrentTechnology');
		component.ngOnInit();
		expect(racetrackInfoService.getCurrentTechnology)
			.toHaveBeenCalled();
	});

	it('should change on updating the filter', () => {
		jest.spyOn(component, 'getFaultData');
		const firstChange: SimpleChanges = {
			faultFilter: new SimpleChange({ }, { faults: 'Detected' }, true),
		};
		component.ngOnChanges(firstChange);
		expect(component.getFaultData)
			.toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		const changes: SimpleChanges = {
			faultFilter: new SimpleChange({ }, { faults: 'Detected' }, false),
		};
		component.ngOnChanges(changes);
		expect(component.searchParams.tacEnabled)
			.toEqual('inactive');
	});

	it('should change to active on updating the filter', () => {
		jest.spyOn(faultService, 'getFaultDetails')
			.mockReturnValue(of<any>(FaultScenarios[0].scenarios.POST[0].response.body));
		const changes: SimpleChanges = {
			faultFilter: new SimpleChange({ }, { faults: 'Not Detected' }, false),
		};
		component.ngOnChanges(changes);
		expect(component.searchParams.tacEnabled)
			.toEqual('active');
	});

	it('should get fault data', () => {
		jest.spyOn(faultService, 'getFaultDetails')
			.mockReturnValue(of<any>(FaultScenarios[0].scenarios.POST[0].response.body));
		component.searchParams = {
			customerId: '231215372',
			tacEnabled: 'active',
		};
		component.getFaultData(component.searchParams);
		expect(faultService.getFaultDetails)
			.toHaveBeenCalled();
	});

	it('should through an error in fault details service', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(faultService, 'getFaultDetails')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		component.getFaultData(component.searchParams);
		expect(faultService.getFaultDetails)
			.toHaveBeenCalled();
	});

	it('should connect to fault detrails', () => {
		const fault = {
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%Title',
			systemCount: 2,
			tacCount: 1,
			title: 'Title',
		};
		component.connectToFaultDetails(fault);
		expect(component.showFaultDetails)
			.toBeTruthy();
	});

	it('should update the pager', () => {
		jest.spyOn(faultService, 'getFaultDetails')
			.mockReturnValue(of<any>(FaultScenarios[0].scenarios.POST[0].response.body));
		const pageInfo = {
			page: 1,
		};
		component.onPagerUpdated(pageInfo);
		expect(component.searchParams.pageNo)
			.toEqual(2);
	});

	it('should close fault panel', () => {
		component.onFaultPanelClose();
		expect(component.showFaultDetails)
			.toBeFalsy();
	});

	it('should update on search', () => {
		jest.spyOn(faultService, 'getFaultDetails')
			.mockReturnValue(of<any>(FaultScenarios[4].scenarios.POST[0].response.body));
		const searchEvent = {
			search: 'abc',
		};
		component.onSearchUpdate(searchEvent);
		expect(component.paginationCount)
			.toEqual('0-0');
	});

	it('should call constructor', () => {
		jest.spyOn(userResolve, 'getCustomerId')
			.mockReturnValue(of<string>('2431199'));
		TestBed.createComponent(FaultsComponent);
		fixture.detectChanges();
		expect(userResolve.getCustomerId)
			.toHaveBeenCalled();
	});

	it('should create a toast', () => {
		const event = {
			icName: '%THERMAL_WARNING.*Temperature--test',
			tacEnable: 'Automated',
		};
		component.onShowSuccess(event);
		expect(component.toasts.autoHide)
			.toEqual(3000);
	});

});
