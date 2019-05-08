import { async, inject, TestBed } from '@angular/core/testing';
import { InventoryService, InventoryResults } from './inventory';
import { DeviceDetails } from '@interfaces';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { mockData, mockDeviceDetails } from './mock/inventory';

describe('SolutionService', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MicroMockModule,
				HttpClientModule,
			],
			providers: [
				InventoryService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	it('should inject', inject([InventoryService], (service: InventoryService) => {
		expect(service)
			.toBeTruthy();
	}));

	it('should handle a read', inject([InventoryService], (service: InventoryService) => {
		service.queryAssets()
			.subscribe(
			(results: InventoryResults) => {
				expect(results.assets.length)
					.toEqual(mockData.assets.length);
			});
	}));

	it('should handle a read by id', inject([InventoryService], (service: InventoryService) => {
		service.queryAssetById(1)
			.subscribe(
			(result: DeviceDetails) => {
				expect(result)
					.toEqual(mockDeviceDetails);
			});
	}));
});
