import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, discardPeriodicTasks, fakeAsync } from '@angular/core/testing';
import {
	MockHardwareAssetsData,
	MockSystemAssetsData,
	user,
} from '@mock';
import { AssetDetailsSummaryComponent } from './summary.component';
import { AssetDetailsSummaryModule } from './summary.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewChild, Component } from '@angular/core';
import { NetworkDataGatewayService, AssetTaggingService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';

// tslint:disable-next-line: completed-docs
@Component({
	template: `
		<asset-details-summary
			[customerId]=customerId
			[systemAsset]=systemAsset
			[hardwareAsset]=hardwareAsset>
		</asset-details-summary>`,
})
class WrapperComponent {
	@ViewChild(AssetDetailsSummaryComponent, { static: true })
		public assetDetailsComponent: AssetDetailsSummaryComponent;
	public customerId;
	public asset;
}

describe('AssetDetailsSummaryComponent', () => {
	let component: AssetDetailsSummaryComponent;
	let fixture: ComponentFixture<AssetDetailsSummaryComponent>;
	let wrapperComponentFixture: ComponentFixture<WrapperComponent>;
	let networkService: NetworkDataGatewayService;
	let assetTaggingService: AssetTaggingService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [
				AssetDetailsSummaryModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(async(() => {
		assetTaggingService = TestBed.get(AssetTaggingService);
		networkService = TestBed.get(NetworkDataGatewayService);
		wrapperComponentFixture = TestBed.createComponent(WrapperComponent);
		wrapperComponentFixture.detectChanges();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsSummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failure checking status on a device', done => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should initiate a scan request', fakeAsync(() => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(of([]));

		jest.spyOn(networkService, 'postDeviceTransactions')
			.mockReturnValue(of([{
				transactionId: 'fake',
			}]));

		jest.spyOn(networkService, 'getScanStatusByTransaction')
			.mockReturnValue(of({
				status: 'SUCCESS',
			}));

		component.initiateScan();

		tick(3000);

		expect(component.status.scan.inProgress)
			.toBeFalsy();

		discardPeriodicTasks();
	}));

	it('should handle a failing initiation scan request without an id', () => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(of([]));

		jest.spyOn(networkService, 'postDeviceTransactions')
			.mockReturnValue(of([]));

		component.initiateScan();

		fixture.detectChanges();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	});

	it('should handle a failing initiation scan request', () => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(of([]));

		jest.spyOn(networkService, 'postDeviceTransactions')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		component.initiateScan();

		fixture.detectChanges();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	});

	it('should check for a scan request on load - poll on inProgress', fakeAsync(() => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(of([
				{
					status: 'IN_PROGRESS',
					transactionId: 'fake',
				},
			]));
		jest.spyOn(networkService, 'getScanStatusByTransaction')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		component.refresh();

		tick(3000);

		expect(component.status.scan.inProgress)
			.toBeFalsy();

		discardPeriodicTasks();
	}));

	it('should check for a scan request on load - poll on received', fakeAsync(() => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(of([
				{
					status: 'RECEIVED',
					transactionId: 'fake',
				},
			]));
		jest.spyOn(networkService, 'getScanStatusByTransaction')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		component.refresh();

		tick(3000);

		expect(component.status.scan.inProgress)
			.toBeFalsy();

		discardPeriodicTasks();
	}));

	it('should check for a scan request on load - nothing on failure', fakeAsync(() => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(assetTaggingService, 'getAsset360Tags')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(networkService, 'getScanStatusBySerial')
			.mockReturnValue(of([
				{
					status: 'FAILURE',
					transactionId: 'fake',
				},
			]));

		component.refresh();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	}));

	it('should change system assets', done => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];

		component.ngOnChanges({
			systemAsset: {
				currentValue: MockSystemAssetsData[0],
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		expect(component.systemAsset.deviceName)
			.toEqual(MockSystemAssetsData[0].deviceName);

		component.systemAsset = MockSystemAssetsData[1];

		component.ngOnChanges({
			systemAsset: {
				currentValue: MockSystemAssetsData[1],
				firstChange: false,
				isFirstChange: () => false,
				previousValue: MockSystemAssetsData[0],
			},
		});

		fixture.whenStable()
		.then(() => {
			expect(component.systemAsset.deviceName)
				.toEqual(MockSystemAssetsData[1].deviceName);
			done();
		});
	});

	it('should change hardware assets', done => {
		component.systemAsset = MockSystemAssetsData[0];
		component.hardwareAsset = MockHardwareAssetsData[0];

		component.ngOnChanges({
			hardwareAsset: {
				currentValue: MockHardwareAssetsData[0],
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		expect(component.hardwareAsset.deviceName)
			.toEqual(MockHardwareAssetsData[0].deviceName);

		component.hardwareAsset = MockHardwareAssetsData[1];

		component.ngOnChanges({
			hardwareAsset: {
				currentValue: MockHardwareAssetsData[1],
				firstChange: false,
				isFirstChange: () => false,
				previousValue: MockHardwareAssetsData[0],
			},
		});

		fixture.whenStable()
		.then(() => {
			expect(component.hardwareAsset.deviceName)
				.toEqual(MockHardwareAssetsData[1].deviceName);

			done();
		});
	});

});
