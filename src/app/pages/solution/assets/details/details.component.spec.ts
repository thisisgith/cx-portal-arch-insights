import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	HardwareScenarios,
	Mock,
	CoverageScenarios,
	AssetScenarios,
} from '@mock';
import { AssetDetailsComponent } from './details.component';
import { AssetDetailsModule } from './details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductAlertsService, InventoryService, ContractsService } from '@cui-x/sdp-api';
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
	@ViewChild('timelineItem', { static: true }) private timelineItemTemplate;

	public asset;
	public coverageData;
}

describe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let componentFromWrapper: WrapperComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;
	let wrapperComponentFixture: ComponentFixture<WrapperComponent>;
	let caseService: CaseService;
	let inventoryService: InventoryService;
	let contractsService: ContractsService;

	let caseSpy;
	let contractsSpy;
	let inventorySpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(caseSpy, 'restore');
		_.invoke(contractsSpy, 'restore');
		_.invoke(inventorySpy, 'restore');
	};

	/**
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(of({ totalElements: 30 }));
		contractsSpy = spyOn(contractsService, 'getDevicesAndCoverageResponse')
			.and
			.callThrough();
		inventorySpy = spyOn(inventoryService, 'getHardwareResponse')
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
		contractsService = TestBed.get(ContractsService);
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

	it('should not fail when no serial number is present', () => {
		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		_.set(asset, 'serialNumber', null);

		component.asset = asset;

		fixture.detectChanges();

		expect(component.status.loading.cases)
			.toBeFalsy();
	});

	it('should try and fetch cases if a serial number is present', () => {
		buildSpies();

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		expect(component.componentData.openCases)
			.toEqual(30);
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

	it('should handle failing cases api call', () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(component.componentData.openCases)
					.toEqual(0);
			});
	});

	it('should handle failing coverage api call', () => {
		contractsSpy = spyOn(contractsService, 'getDevicesAndCoverage')
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
				expect(component.status.loading.coverage)
					.toEqual(false);

				expect(component.coverageData)
					.toEqual(undefined);
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
