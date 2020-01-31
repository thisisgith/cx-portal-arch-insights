import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	MockSystemAssetsData,
	MockSoftwareEOLResponse,
	MockSoftwareEOLBulletinsResponse,
	MockHardwareAssetsData,
} from '@mock';
import { AssetDetailsSoftwareComponent } from './software.component';
import { AssetDetailsSoftwareModule } from './software.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import {
	ProductAlertsService,
	ControlPointLicenseAPIService,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResolve } from '@utilities';

describe('AssetDetailsSoftwareComponent', () => {
	let component: AssetDetailsSoftwareComponent;
	let fixture: ComponentFixture<AssetDetailsSoftwareComponent>;
	let productAlertsService: ProductAlertsService;
	let controlPointService: ControlPointLicenseAPIService;
	let userResolve;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsSoftwareModule,
				HttpClientTestingModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				UserResolve,
			],
		});
	});

	beforeEach(async(() => {

		controlPointService = TestBed.get(ControlPointLicenseAPIService);
		productAlertsService = TestBed.get(ProductAlertsService);
		userResolve = TestBed.get(UserResolve);
		jest.spyOn(userResolve, 'getCustomerId')
			.mockReturnValue(of('1234'));
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
		const systemAsset = MockSystemAssetsData[0];
		const hardwareAsset = MockHardwareAssetsData[0];
		component.systemAsset = systemAsset;
		component.hardwareAsset = hardwareAsset;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(productAlertsService, 'getSoftwareEox')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(controlPointService, 'getLicenseUsingGET')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.licenses)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should handle invalid timeline data', fakeAsync(() => {
		const asset = MockSystemAssetsData[0];
		component.systemAsset = asset;
		const mockEOLData = _.filter(MockSoftwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });

		jest.spyOn(productAlertsService, 'getSoftwareEox')
			.mockReturnValue(of({ data: mockEOLData }));
		jest.spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.mockReturnValue(of({ data: [] }));
		jest.spyOn(controlPointService, 'getLicenseUsingGET')
			.mockReturnValue(of({ }));
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		expect(component.status.loading.eol)
			.toBeFalsy();

		expect(component.status.loading.eolBulletin)
			.toBeFalsy();

		expect(component.status.loading.licenses)
			.toBeFalsy();

		expect(component.status.loading.overall)
			.toBeFalsy();
	}));

	it('should fetch timeline data', fakeAsync(() => {
		const asset = MockSystemAssetsData[0];
		component.systemAsset = asset;

		jest.spyOn(productAlertsService, 'getSoftwareEox')
			.mockReturnValue(of(MockSoftwareEOLResponse));
		jest.spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.mockReturnValue(of(MockSoftwareEOLBulletinsResponse));
		jest.spyOn(controlPointService, 'getLicenseUsingGET')
			.mockReturnValue(of({ }));
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		expect(component.status.loading.eol)
			.toBeFalsy();

		expect(component.status.loading.eolBulletin)
			.toBeFalsy();

		tick();
	}));

	it('should fetch the software information', done => {
		const asset = MockSystemAssetsData[0];
		component.systemAsset = asset;
		const mockEOLData = MockSoftwareEOLResponse.data[0];
		const mockEOLBulletinData = MockSoftwareEOLBulletinsResponse.data[0];

		jest.spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.mockReturnValue(of({ data: _.castArray(mockEOLBulletinData) }));
		jest.spyOn(productAlertsService, 'getSoftwareEox')
			.mockReturnValue(of({ data: _.castArray(mockEOLData) }));
		jest.spyOn(controlPointService, 'getLicenseUsingGET')
			.mockReturnValue(of({ }));

		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.licenses)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should handle changing assets', () => {
		const assets = MockSystemAssetsData;

		const asset = assets[0];
		const newAsset = assets[1];

		component.systemAsset = asset;
		component.ngOnChanges({
			systemAsset: {
				currentValue: asset,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		fixture.detectChanges();

		expect(component.systemAsset)
			.toEqual(asset);

		component.systemAsset = newAsset;
		component.ngOnChanges({
			systemAsset: {
				currentValue: newAsset,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: asset,
			},
		});

		fixture.detectChanges();
		expect(component.systemAsset)
			.toEqual(newAsset);
	});

});
