import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	Mock,
	MockSoftwareEOLResponse,
	MockSoftwareEOLBulletinsResponse,
	SoftwareEOLBulletinScenarios,
	SoftwareEOLScenarios,
} from '@mock';
import { AssetDetailsSoftwareComponent } from './software.component';
import { AssetDetailsSoftwareModule } from './software.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import {
	ProductAlertsService,
	ControlPointIERegistrationAPIService,
} from '@sdp-api';
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

describe('AssetDetailsSoftwareComponent', () => {
	let component: AssetDetailsSoftwareComponent;
	let fixture: ComponentFixture<AssetDetailsSoftwareComponent>;
	let productAlertsService: ProductAlertsService;
	let controlPointService: ControlPointIERegistrationAPIService;
	let userResolve;

	beforeEach(async(() => {
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
		})
		.compileComponents();

		controlPointService = TestBed.get(ControlPointIERegistrationAPIService);
		productAlertsService = TestBed.get(ProductAlertsService);
		userResolve = TestBed.get(UserResolve);
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('1234'));
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
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		const bulletinSpy = spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		const softwareSpy = spyOn(productAlertsService, 'getSoftwareEox')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		const licenseSpy = spyOn(controlPointService, 'getLicenseData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

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
		});

		const mockEOLData = _.filter(MockSoftwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });
		const mockEOLBulletinData = _.filter(MockSoftwareEOLBulletinsResponse.data,
			{ swEolInstanceId: _.head(mockEOLData).swEolInstanceId });

		bulletinSpy.and.returnValue(of({ data: mockEOLBulletinData }));
		softwareSpy.and.returnValue(of({ data: mockEOLData }));
		licenseSpy.and.returnValue(throwError(new HttpErrorResponse(error)));

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
		});

		bulletinSpy.and.returnValue(throwError(new HttpErrorResponse(error)));
		softwareSpy.and.returnValue(of({ data: mockEOLData }));
		licenseSpy.and.returnValue(throwError(new HttpErrorResponse(error)));
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

		bulletinSpy.and.returnValue(of({ data: mockEOLBulletinData }));
		softwareSpy.and.returnValue(of({ data: [] }));
		licenseSpy.and.returnValue(throwError(new HttpErrorResponse(error)));
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

	it('should handle invalid timeline data', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;
		const mockEOLData = _.filter(MockSoftwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });

		spyOn(productAlertsService, 'getSoftwareEox')
			.and
			.returnValue(of({ data: mockEOLData }));
		spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.and
			.returnValue(of({ data: [] }));
		spyOn(controlPointService, 'getLicenseData')
			.and
			.returnValue(of({ }));
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

			expect(component.timelineData.length)
				.toBe(0);
			done();
		});
	});
	it('should fetch timeline data', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;
		const mockEOLData = getActiveBody(SoftwareEOLScenarios[0]);
		const mockEOLBulletinData = getActiveBody(SoftwareEOLBulletinScenarios[0]);

		spyOn(productAlertsService, 'getSoftwareEox')
			.and
			.returnValue(of(mockEOLData));
		spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.and
			.returnValue(of(mockEOLBulletinData));
		spyOn(controlPointService, 'getLicenseData')
			.and
			.returnValue(of({ }));
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

	it('should fetch the software information', done => {
		const asset = getActiveBody(AssetScenarios[0]).data[0];
		component.asset = asset;
		const mockEOLData = _.filter(MockSoftwareEOLResponse.data,
			{ managedNeId: asset.managedNeId });
		const mockEOLBulletinData = _.filter(MockSoftwareEOLBulletinsResponse.data,
			{ swEolInstanceId: _.head(mockEOLData).swEolInstanceId });

		spyOn(productAlertsService, 'getSoftwareEoxBulletin')
			.and
			.returnValue(of({ data: mockEOLBulletinData }));
		spyOn(productAlertsService, 'getSoftwareEox')
			.and
			.returnValue(of({ data: mockEOLData }));
		spyOn(controlPointService, 'getLicenseData')
			.and
			.returnValue(of({ }));

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
