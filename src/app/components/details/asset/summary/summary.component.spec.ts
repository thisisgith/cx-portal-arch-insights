import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	HardwareScenarios,
	Mock,
	CoverageScenarios,
	AssetScenarios,
} from '@mock';
import { AssetDetailsSummaryComponent } from './summary.component';
import { AssetDetailsSummaryModule } from './summary.module';
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
		<asset-details-summary [asset]=asset></asset-details-summary>
	`,
})
class WrapperComponent {
	@ViewChild(AssetDetailsSummaryComponent, { static: true })
		public assetDetailsComponent: AssetDetailsSummaryComponent;
	public customerId;
	public asset;
}

fdescribe('AssetDetailsSummaryComponent', () => {
	let component: AssetDetailsSummaryComponent;
	let componentFromWrapper: WrapperComponent;
	let fixture: ComponentFixture<AssetDetailsSummaryComponent>;
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
				AssetDetailsSummaryModule,
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
		fixture = TestBed.createComponent(AssetDetailsSummaryComponent);
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

	it('should handle failing hardware api call', fakeAsync(() => {
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

		tick();

		expect(component.status.loading.hardware)
			.toEqual(false);

		expect(component.componentData.numberInInventory)
			.toEqual(0);
	}));

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

	it('should correctly determine whether a date is expired', fakeAsync(() => {

		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 100);

		const summarySpy = spyOn(inventoryService, 'getAssetSummary')
			.and
			.returnValue(of({
				lastDateOfSupport: futureDate.toISOString(),
				warrantyEndDate: futureDate.toISOString(),
			}));

		const deviceResponse = getActiveBody(AssetScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));
		componentFromWrapper.asset = asset;

		wrapperComponentFixture.detectChanges();

		expect(summarySpy)
			.toHaveBeenCalled();

		tick();

		fixture.detectChanges();
		tick();

		expect(component.isExpired(
			componentFromWrapper.assetDetailsComponent.assetData.lastDateOfSupport,
		))
			.toEqual(false);
		expect(component.isExpired(
			componentFromWrapper.assetDetailsComponent.assetData.warrantyEndDate,
		))
			.toEqual(false);

		summarySpy.and.returnValue(of({
			lastDateOfSupport: '2010-08-13T17:58:32.995Z',
			warrantyEndDate: '2010-08-13T17:58:32.995Z',
		}));

		const deviceResponse2 = getActiveBody(AssetScenarios[1]);
		const asset2 = _.cloneDeep(_.head(_.get(deviceResponse2, 'data')));
		componentFromWrapper.asset = asset2;

		wrapperComponentFixture.detectChanges();

		expect(summarySpy)
			.toHaveBeenCalled();

		tick();

		fixture.detectChanges();

		expect(component.isExpired(
			componentFromWrapper.assetDetailsComponent.assetData.lastDateOfSupport,
		))
			.toEqual(true);
		expect(component.isExpired(
			componentFromWrapper.assetDetailsComponent.assetData.warrantyEndDate,
		))
			.toEqual(true);

	}));

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
