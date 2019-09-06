import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	Mock,
	MockHardwareEOLResponse,
	MockHardwareEOLBulletinsResponse,
} from '@mock';
import { AssetDetailsHardwareComponent } from './hardware.component';
import { AssetDetailsHardwareModule } from './hardware.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { InventoryService, ProductAlertsService } from '@sdp-api';
import * as _ from 'lodash-es';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResolve } from '@utilities';

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

describe('AssetDetailsHardwareComponent', () => {
	let component: AssetDetailsHardwareComponent;
	let fixture: ComponentFixture<AssetDetailsHardwareComponent>;
	let productAlertsService: ProductAlertsService;
	let inventoryService: InventoryService;
	let userResolve: UserResolve;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsHardwareModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {

		inventoryService = TestBed.get(InventoryService);
		productAlertsService = TestBed.get(ProductAlertsService);
		userResolve = TestBed.get(UserResolve);
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsHardwareComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing api calls', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		const hardwareSpy = spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.modules)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
		const mockEOLData = _.filter(MockHardwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });
		hardwareSpy.and.returnValue(of({ data: mockEOLData }));
		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.modules)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should fetch the hardware information', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;

		const mockEOLData = _.filter(MockHardwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });
		const mockEOLBulletinData = _.filter(MockHardwareEOLBulletinsResponse.data,
			{ hwEolInstanceId: _.head(mockEOLData).hwEolInstanceId });

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(of({ data: mockEOLBulletinData }));
		spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(of({ data: mockEOLData }));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.modules)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should fetch timeline data', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;

		const mockEOLData = _.filter(MockHardwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });
		const mockEOLBulletinData = _.filter(MockHardwareEOLBulletinsResponse.data,
			{ hwEolInstanceId: _.head(mockEOLData).hwEolInstanceId });
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(of({ data: mockEOLBulletinData }));
		spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(of({ data: mockEOLData }));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.timelineData.length)
				.toBeTruthy();
			done();
		});
	});

	it('should handle changing assets', () => {
		const assets = getActiveBody(AssetScenarios[0]).data;

		const asset = assets[0];
		const newAsset = assets[1];

		component.asset = asset;
		component.ngOnChanges({
			asset: {
				currentValue: asset,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		fixture.detectChanges();

		expect(component.asset)
			.toEqual(asset);

		component.asset = newAsset;
		component.ngOnChanges({
			asset: {
				currentValue: newAsset,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: asset,
			},
		});

		fixture.detectChanges();
		expect(component.asset)
			.toEqual(newAsset);
	});
});
