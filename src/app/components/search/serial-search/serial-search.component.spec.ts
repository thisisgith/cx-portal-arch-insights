import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { RouterModule } from '@angular/router';
import { SerialSearchComponent } from './serial-search.component';
import { SerialSearchModule } from './serial-search.module';
import { InventoryService, ContractsService, DeviceContractResponse,
	ProductAlertsService, Assets } from '@sdp-api';

import { HardwareScenarios, ContractScenarios, AssetScenarios,
	VulnerabilityScenarios, CaseScenarios } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '@cui-x/services';
describe('SerialSearchComponent', () => {
	let component: SerialSearchComponent;
	let inventoryService: InventoryService;
	let contractsService: ContractsService;
	let alertsService: ProductAlertsService;
	let caseService: CaseService;
	let fixture: ComponentFixture<SerialSearchComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SerialSearchModule,
				HttpClientTestingModule,
				RouterModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		inventoryService = TestBed.get(InventoryService);
		contractsService = TestBed.get(ContractsService);
		alertsService = TestBed.get(ProductAlertsService);
		caseService = TestBed.get(CaseService);
		fixture = TestBed.createComponent(SerialSearchComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit a hide event if no SN has been found', () => {
		jest.spyOn(inventoryService, 'getAssets')
			.mockReturnValue(of({ data: [] }));
		jest.spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
	});

	xit('should show if SN data was found', () => {
		jest.spyOn(inventoryService, 'getAssets')
			.mockReturnValue(of(<Assets> AssetScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(inventoryService, 'getHardware')
			.mockReturnValue(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(contractsService, 'getContractDetails')
			.mockReturnValue(of(<DeviceContractResponse>
				ContractScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(alertsService, 'getVulnerabilityCounts')
			.mockReturnValue(of(VulnerabilityScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(caseService, 'read')
			.mockReturnValue(of(CaseScenarios[2].scenarios.GET[0].response.body));
		jest.spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(1);
	});

	it('should refresh data when an input changes', () => {
		jest.spyOn(inventoryService, 'getAssets')
			.mockReturnValue(of({ data: [] }));
		component.serialNumber = { query: 'FOX1306GBA1' };
		fixture.detectChanges();
		component.serialNumber = { query: 'FOX1306GBA2' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(inventoryService.getAssets)
			.toHaveBeenCalledTimes(2);
	});

	it('should hide on device API error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(inventoryService, 'getAssets')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(inventoryService, 'getHardware')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(contractsService, 'getContractDetails')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(alertsService, 'getVulnerabilityCounts')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(caseService, 'read')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(2);
	});

	xit('should navigate to the assets component when' +
	'"View Device Details" is clicked', fakeAsync(() => {
		jest.spyOn(inventoryService, 'getAssets')
			.mockReturnValue(of(<Assets> AssetScenarios[0].scenarios.GET[0].response.body));
		component.serialNumber = { query: 'FOX1306GBAD' };
		const navSpy = jest.spyOn(component.router, 'navigate')
			.mockReturnValue(new Promise(resolve => { resolve(true); }));
		component.ngOnChanges();
		fixture.detectChanges();
		component.onViewDetails(component.serialNumber.query);
		fixture.detectChanges();
		flush();
		expect(navSpy.mock.calls[navSpy.mock.calls.length - 1])
			.toEqual([
					['solution/assets'],
					{ queryParams: { serialNumber: 'FOX1306GBAD', select: true } },
			]);
	}));

});
