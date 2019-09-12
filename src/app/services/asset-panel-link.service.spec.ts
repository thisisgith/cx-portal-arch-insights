import { TestBed, async } from '@angular/core/testing';
import { AssetPanelLinkService } from './asset-panel-link.service';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InventoryService } from '@sdp-api';
import { of } from 'rxjs';
import { AssetLinkScenarios } from '@mock';

describe('AssetPanelLinkService', () => {

	let assetPanelLinkService: AssetPanelLinkService;
	let inventoryService: InventoryService;
	const assetParams: InventoryService.GetAssetsParams = Object.create({ });

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AssetPanelLinkService, InventoryService],
		});
	});

	beforeEach(async(() => {
		assetPanelLinkService = TestBed.get(AssetPanelLinkService);
		inventoryService = TestBed.get(InventoryService);
	}));

	it('should be created', () => {
		expect(assetPanelLinkService)
			.toBeTruthy();
	});

	it('should get asset link data', () => {
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(of(<any> AssetLinkScenarios[0].scenarios.GET[0].response.body));

		spyOn(inventoryService, 'getNetworkElements')
			.and
			.returnValue(of(<any> AssetLinkScenarios[1].scenarios.GET[0].response.body));

		assetParams.customerId = '2431199';
		assetParams.serialNumber = ['FCH2139V1B0'];

		assetPanelLinkService.getAssetLinkData(assetParams);

		expect(inventoryService.getAssets)
			.toHaveBeenCalled();
		expect(inventoryService.getNetworkElements)
			.toHaveBeenCalled();
	});

});
