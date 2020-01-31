import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { CaseService } from '@cui-x/services';
import { InventoryService } from '@sdp-api';
import { CaseScenarios, HardwareScenarios } from '@mock';
import { CaseSearchComponent } from './case-search.component';
import { CaseSearchModule } from './case-search.module';
import { HttpErrorResponse } from '@angular/common/http';

describe('caseSearchComponent', () => {
	let component: CaseSearchComponent;
	let caseService: CaseService;
	let inventoryService: InventoryService;
	let fixture: ComponentFixture<CaseSearchComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseSearchModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		caseService = TestBed.get(CaseService);
		inventoryService = TestBed.get(InventoryService);
		fixture = TestBed.createComponent(CaseSearchComponent);
		component = fixture.componentInstance;
		component.caseNumber = { query: '680000000' };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		component.caseNumber = { query: '680000001' };
		jest.spyOn(caseService, 'fetchCaseDetails')
			.mockReturnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalled();
	});

	it('should call all of the required APIs for a valid case', fakeAsync(() => {
		jest.spyOn(caseService, 'fetchCaseDetails')
			.mockReturnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(caseService, 'fetchCaseNotes')
			.mockReturnValue(of(CaseScenarios[1].scenarios.GET[0].response.body));
		jest.spyOn(caseService, 'read')
			.mockReturnValue(of(CaseScenarios[2].scenarios.GET[0].response.body));
		jest.spyOn(inventoryService, 'getHardware')
			.mockReturnValue(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		component.caseNumber = { query: '688296392' };
		component.ngOnChanges();
		fixture.detectChanges();
		tick(2500); // Wait for all requests to finish
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalled();
		expect(caseService.fetchCaseNotes)
			.toHaveBeenCalled();
		expect(caseService.read)
			.toHaveBeenCalled();
		expect(inventoryService.getHardware)
			.toHaveBeenCalled();
		// Close the fixture so the fromNow pipe stops
		fixture.destroy();
		flush();
	}));

	it('should not hide if the main request succeeds and other requests error', fakeAsync(() => {
		component.caseNumber = { query: '680000002' };
		jest.spyOn(caseService, 'fetchCaseDetails')
			.mockReturnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(component.hide, 'emit');
		jest.spyOn(caseService, 'fetchCaseNotes')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(caseService, 'read')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(inventoryService, 'getHardware')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnChanges();
		fixture.detectChanges();
		tick(1000); // Wait for all requests to finish
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(1);
		// Close the fixture so the fromNow pipe stops
		fixture.destroy();
		flush();
	}));

	it('should hide on no case details', () => {
		jest.spyOn(caseService, 'fetchCaseDetails')
			.mockReturnValue(of({ }));
		jest.spyOn(component.hide, 'emit');
		component.caseNumber = { query: '688296392' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
	});

	it('should hide on case detail error', fakeAsync(() => {
		component.caseNumber = { query: '688296392' };
		jest.spyOn(caseService, 'fetchCaseDetails')
			.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
		jest.spyOn(component.hide, 'emit');
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
	}));

	it('should handle alternative case detail fields', fakeAsync(() => {
		component.caseNumber = { query: '688296392' };
		const mockResponse = <any> CaseScenarios[3].scenarios.GET[0].response.body;
		jest.spyOn(caseService, 'fetchCaseDetails')
			.mockReturnValue(of(mockResponse));
		component.ngOnChanges();
		fixture.detectChanges();
		tick();
		expect(component.case.description)
			.toBe(mockResponse.summary);
		// Close the fixture so the fromNow pipe stops
		fixture.destroy();
		flush();
	}));

});
