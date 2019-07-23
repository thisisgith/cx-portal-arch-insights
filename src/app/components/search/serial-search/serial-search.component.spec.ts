import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
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

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SerialSearchModule,
				HttpClientTestingModule,
				RouterModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

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
		spyOn(inventoryService, 'getAssets')
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
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValues(of(<Assets> AssetScenarios[0].scenarios.GET[0].response.body));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValues(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		spyOn(contractsService, 'getContractDetails')
			.and
			.returnValues(of(<DeviceContractResponse>
				ContractScenarios[0].scenarios.GET[0].response.body));
		spyOn(alertsService, 'getVulnerabilityCounts')
			.and
			.returnValues(of(VulnerabilityScenarios[0].scenarios.GET[0].response.body));
		spyOn(caseService, 'read')
			.and
			.returnValue(of(CaseScenarios[2].scenarios.GET[0].response.body));
		spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(1);
	});

	it('should refresh data when an input changes', () => {
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValues(of({ data: [] }), of({ data: [] }));
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
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(contractsService, 'getContractDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(alertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(caseService, 'read')
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

	it('should navigate to the assets component when' +
	'"View Device Details" is clicked', fakeAsync(() => {
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValues(of(<Assets> AssetScenarios[0].scenarios.GET[0].response.body));
		component.serialNumber = { query: 'FOX1306GBAD' };
		spyOn(component.router, 'navigate')
			.and
			.returnValue(new Promise(() => true));
		component.ngOnChanges();
		fixture.detectChanges();
		component.onViewDetails(component.serialNumber.query);
		fixture.detectChanges();
		expect(component.router.navigate)
			.toHaveBeenCalledWith(
				['solution/assets'],
				{ queryParams: { serialNumber: 'FOX1306GBAD', select: true } },
			);
		flush();
	}));
});
