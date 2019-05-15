import { async, inject, TestBed } from '@angular/core/testing';
import { AssetService } from './asset';
import { Asset } from '@interfaces';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { mockData, mockDeviceDetails } from './mock/asset';

describe('AssetService', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MicroMockModule,
				HttpClientModule,
			],
			providers: [
				AssetService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	it('should inject', inject([AssetService], (service: AssetService) => {
		expect(service)
			.toBeTruthy();
	}));

	it('should handle a read', inject([AssetService], (service: AssetService) => {
		service.queryAssets()
			.subscribe(
			(results: Asset[]) => {
				expect(results.length)
					.toEqual(mockData.length);
			});
	}));

	it('should handle a read by id', inject([AssetService], (service: AssetService) => {
		service.queryAssetById(1)
			.subscribe(
			(result: Asset) => {
				expect(result)
					.toEqual(mockDeviceDetails);
			});
	}));
});
