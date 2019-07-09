import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { SerialSearchComponent } from './serial-search.component';
import { SerialSearchModule } from './serial-search.module';
import { InventoryService, ContractsService, DeviceContractResponse,
			ProductAlertsService } from '@sdp-api';

import { HardwareScenarios, ContractScenarios } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';

describe('SerialSearchComponent', () => {
	let component: SerialSearchComponent;
	let inventoryService: InventoryService;
	let contractsService: ContractsService;
	let alertsService: ProductAlertsService;
	let fixture: ComponentFixture<SerialSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SerialSearchModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		inventoryService = TestBed.get(InventoryService);
		contractsService = TestBed.get(ContractsService);
		alertsService = TestBed.get(ProductAlertsService);
		fixture = TestBed.createComponent(SerialSearchComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit a hide event if no SN has been found', () => {
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValues(of({ data: [] }));
		spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
	});

	it('should show if SN data was found', () => {
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValues(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		spyOn(contractsService, 'getContractDetails')
			.and
			.returnValues(of(<DeviceContractResponse>
				ContractScenarios[0].scenarios.GET[0].response.body));
		spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(1);
	});

	it('should refresh data when an input changes', () => {
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValues(of({ data: [] }), of({ data: [] }));
		component.serialNumber = { query: 'FOX1306GBA1' };
		fixture.detectChanges();
		component.serialNumber = { query: 'FOX1306GBA2' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(inventoryService.getHardware)
			.toHaveBeenCalledTimes(2);
	});

	it('should hide on device API error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(contractsService, 'getContractDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(alertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(true);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(2);
	});
});
