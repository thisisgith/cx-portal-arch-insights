import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { SerialSearchComponent } from './serial-search.component';
import { SerialSearchModule } from './serial-search.module';
import { InventoryService } from '@sdp-api';

import { HardwareScenarios } from '@mock';

describe('SerialSearchComponent', () => {
	let component: SerialSearchComponent;
	let service: InventoryService;
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
		service = TestBed.get(InventoryService);
		fixture = TestBed.createComponent(SerialSearchComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit a hide event if no SN has been found', () => {
		spyOn(service, 'getHardware')
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
		spyOn(service, 'getHardware')
			.and
			.returnValues(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		spyOn(component.hide, 'emit');
		component.serialNumber = { query: 'FOX1306GBAD' };
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalledWith(false);
		expect(component.hide.emit)
			.toHaveBeenCalledTimes(1);
	});

	it('should refresh data when an input changes', () => {
		spyOn(service, 'getHardware')
			.and
			.returnValues(of({ data: [] }), of({ data: [] }));
		component.serialNumber = { query: 'FOX1306GBA1' };
		fixture.detectChanges();
		component.serialNumber = { query: 'FOX1306GBA2' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(service.getHardware)
			.toHaveBeenCalledTimes(2);
	});
});
