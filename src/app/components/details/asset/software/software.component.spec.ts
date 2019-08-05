import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	Mock,
	MockSoftwareEOLResponse,
	MockSoftwareEOLBulletinsResponse,
} from '@mock';
import { AssetDetailsSoftwareComponent } from './software.component';
import { AssetDetailsSoftwareModule } from './software.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { InventoryService, ProductAlertsService } from '@sdp-api';
import * as _ from 'lodash-es';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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

describe('AssetDetailsSoftwareComponent', () => {
	let component: AssetDetailsSoftwareComponent;
	let fixture: ComponentFixture<AssetDetailsSoftwareComponent>;
	let productAlertsService: ProductAlertsService;
	let inventoryService: InventoryService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsSoftwareModule,
				HttpClientTestingModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();

		inventoryService = TestBed.get(InventoryService);
		productAlertsService = TestBed.get(ProductAlertsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsSoftwareComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing api calls', done => {
		component.asset = getActiveBody(AssetScenarios[0]).data[0];

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getSoftwareEox')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getSoftware')
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
	});

	it('should fetch the software information', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;
		const mockEOLData = _.filter(MockSoftwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });
		const mockEOLBulletinData = _.filter(MockSoftwareEOLBulletinsResponse.data,
			{ hwEolInstanceId: _.head(mockEOLData).hwEolInstanceId });

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.and
			.returnValue(of({ data: mockEOLBulletinData }));
		spyOn(productAlertsService, 'getSoftwareEox')
			.and
			.returnValue(of({ data: mockEOLData }));
		spyOn(inventoryService, 'getSoftware')
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
