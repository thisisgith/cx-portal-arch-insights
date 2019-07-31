import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	HardwareScenarios,
	Mock,
	CoverageScenarios,
	AssetScenarios,
} from '@mock';
import { AssetDetailsComponent } from './asset-details.component';
import { AssetDetailsModule } from './asset-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { InventoryService } from '@sdp-api';
import { ViewChild, Component } from '@angular/core';

/**
 * Will fetch the currently active response body from the mock object
 * @param mock the mock object
 * @param type the scenario type
 * @returns the body response
 */
function getActiveBody (mock: Mock, type: string = 'GET') {
	const active = _.find(mock.scenarios[type], 'selected') || _.head(mock.scenarios[type]);

	return active.response.body;
}

// tslint:disable-next-line: completed-docs
@Component({
	template: `
		<asset-details [asset]={}></asset-details>
	`,
})
class WrapperComponent {
	@ViewChild(AssetDetailsComponent, { static: true })
		public assetDetailsComponent: AssetDetailsComponent;
	public customerId;
	public asset;
}

describe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let componentFromWrapper: WrapperComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;
	let wrapperComponentFixture: ComponentFixture<WrapperComponent>;
	let caseService: CaseService;
	let inventoryService: InventoryService;

	let caseSpy;
	let contractsSpy;
	let inventorySpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(caseSpy, 'restore');
		_.invoke(inventorySpy, 'restore');
	};

	/**
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(of({ totalElements: 30 }));
		contractsSpy = spyOn(inventoryService, 'getAssetSummary')
			.and
			.callThrough();
		inventorySpy = spyOn(inventoryService, 'getHardware')
			.and
			.callThrough();
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [
				AssetDetailsModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();

		caseService = TestBed.get(CaseService);
		inventoryService = TestBed.get(InventoryService);

		wrapperComponentFixture = TestBed.createComponent(WrapperComponent);
		wrapperComponentFixture.detectChanges();
		componentFromWrapper = wrapperComponentFixture.componentInstance;
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsComponent);
		component = fixture.componentInstance;
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fetch hardware data', fakeAsync(() => {
		buildSpies();
		tick(1000);

		const deviceResponse = getActiveBody(AssetScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));
		componentFromWrapper.assetDetailsComponent.asset = asset;

		componentFromWrapper.assetDetailsComponent.refresh();

		wrapperComponentFixture.detectChanges();
		expect(contractsSpy)
			.toHaveBeenCalled();
	}));

	it('should handle failing hardware api call', () => {
		contractsSpy = spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		const deviceResponse = getActiveBody(CoverageScenarios[2]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(component.status.loading.hardware)
					.toEqual(false);

				expect(component.componentData.numberInInventory)
					.toEqual(0);
			});
	});

	it('should handle changing assets', () => {
		buildSpies();

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		const newAsset = _.cloneDeep(_.get(deviceResponse, 'data')[1]);

		fixture.detectChanges();

		component.asset = asset;
		component.ngOnChanges({
			asset: {
				currentValue: asset,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.asset.serialNumber)
			.toEqual('1234');

		component.asset = newAsset;
		component.ngOnChanges({
			asset: {
				currentValue: newAsset,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: asset,
			},
		});

		expect(component.asset.serialNumber)
			.toEqual('AAA');
	});

	// it('should handle fullscreen', () => {
	// 	buildSpies();

	// 	const deviceResponse = getActiveBody(HardwareScenarios[0]);
	// 	const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));
	// 	component.asset = asset;
	// 	fixture.detectChanges();

	// 	expect(component.fullscreen)
	// 		.toBeFalsy();

	// 	component.fullscreen = true;

	// 	expect(component.fullscreen)
	// 		.toBeTruthy();

	// });
});
