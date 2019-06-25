import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CaseService } from '@cui-x/services';
import { InventoryService } from '@cui-x/sdp-api';
import { CaseScenarios, HardwareScenarios } from '@mock';
import { CaseSearchComponent } from './case-search.component';
import { CaseSearchModule } from './case-search.module';
import { HttpErrorResponse } from '@angular/common/http';

describe('caseSearchComponent', () => {
	let component: CaseSearchComponent;
	let caseService: CaseService;
	let inventoryService: InventoryService;
	let fixture: ComponentFixture<CaseSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseSearchModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		caseService = TestBed.get(CaseService);
		inventoryService = TestBed.get(InventoryService);
		fixture = TestBed.createComponent(CaseSearchComponent);
		component = fixture.componentInstance;
		component.caseNumber = '680000000';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		component.caseNumber = '680000001';
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalled();
	});

	it('should not hide if only a case number is set', fakeAsync(() => {
		component.caseNumber = '680000002';
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(of({ caseNumber: '680000002' }));
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(component.hide, 'emit');
		spyOn(caseService, 'fetchCaseNotes')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnChanges();
		fixture.detectChanges();
		tick(1000); // Wait for caseDetails to get the SN
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(1);
	}));

	it('should call all of the required APIs for a valid case', fakeAsync(() => {
		component.caseNumber = '688296392';
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		spyOn(caseService, 'fetchCaseNotes')
			.and
			.returnValue(of(CaseScenarios[1].scenarios.GET[0].response.body));
		spyOn(caseService, 'read')
			.and
			.returnValue(of(CaseScenarios[2].scenarios.GET[0].response.body));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalled();
		expect(caseService.fetchCaseNotes)
			.toHaveBeenCalled();
		expect(caseService.read)
			.toHaveBeenCalled();
		tick(1000); // Wait for caseDetails to get the SN
		expect(inventoryService.getHardware)
			.toHaveBeenCalled();
	}));

	it('should hide on no case details', () => {
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(of({ }));
		spyOn(component.hide, 'emit');
		component.caseNumber = '688296392';
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
	});

	it('should hide on case detail error', fakeAsync(() => {
		component.caseNumber = '688296392';
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
		spyOn(component.hide, 'emit');
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
	}));

});
