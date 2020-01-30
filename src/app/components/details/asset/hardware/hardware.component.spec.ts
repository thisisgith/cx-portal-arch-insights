import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	MockHardwareAssetsData,
	MockSystemAssetsData,
	RacetrackScenarios,
	Mock,
	MockFieldNotices,
	MockHardwareEOLResponse,
	MockHardwareEOLBulletinsResponse,
	MockFieldNoticeBulletins,
} from '@mock';
import { AssetDetailsHardwareComponent } from './hardware.component';
import { AssetDetailsHardwareModule } from './hardware.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ProductAlertsService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RacetrackInfoService } from '@services';
import * as _ from 'lodash-es';

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
	let racetrackInfoService: RacetrackInfoService;

	/**
	 * Sends our racetrack info
	 */
	const sendRacetrack = () => {
		racetrackInfoService.sendRacetrack(getActiveBody(RacetrackScenarios[0]));
		racetrackInfoService.sendCurrentSolution(
			getActiveBody(RacetrackScenarios[0]).solutions[0],
		);
		racetrackInfoService.sendCurrentTechnology(
			getActiveBody(RacetrackScenarios[0]).solutions[0].technologies[0],
		);
	};

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
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		productAlertsService = TestBed.get(ProductAlertsService);
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
		const hardwareAsset = MockHardwareAssetsData[0];
		component.hardwareAsset = hardwareAsset;

		const systemAsset = MockSystemAssetsData[0];
		component.systemAsset = systemAsset;

		component.hardwareAssets = MockHardwareAssetsData;
		component.selectedAsset = MockHardwareAssetsData[0];

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		sendRacetrack();

		fixture.whenStable()
		.then(() => {
			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.fieldNotices)
				.toBeFalsy();

			expect(component.status.loading.fieldNoticeBulletins)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should handle failing bulletin data', done => {
		const hardwareAsset = MockHardwareAssetsData[0];
		component.hardwareAsset = hardwareAsset;

		const systemAsset = MockSystemAssetsData[0];
		component.systemAsset = systemAsset;

		component.hardwareAssets = MockHardwareAssetsData;
		component.selectedAsset = MockHardwareAssetsData[0];

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};

		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(of(MockHardwareEOLResponse));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of({ data: MockFieldNotices }));

		component.ngOnInit();
		sendRacetrack();

		fixture.whenStable()
		.then(() => {
			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.fieldNotices)
				.toBeFalsy();

			expect(component.status.loading.fieldNoticeBulletins)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should assign bulletins to the assets', fakeAsync(() => {
		const hardwareAsset = MockHardwareAssetsData[0];
		component.hardwareAsset = hardwareAsset;

		const systemAsset = MockSystemAssetsData[0];
		component.systemAsset = systemAsset;

		component.hardwareAssets = MockHardwareAssetsData;

		component.selectedAsset = MockHardwareAssetsData[0];

		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(of(MockHardwareEOLBulletinsResponse));
		spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(of(MockHardwareEOLResponse));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(of({ data: MockFieldNoticeBulletins }));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of({ data: MockFieldNotices }));

		fixture.detectChanges();
		tick(1000);

		component.ngOnInit();
		sendRacetrack();

		tick(1000);
		fixture.detectChanges();

		expect(component.status.loading.eol)
			.toBeFalsy();

		expect(component.status.loading.eolBulletin)
			.toBeFalsy();

		expect(component.status.loading.fieldNotices)
			.toBeFalsy();

		expect(component.status.loading.fieldNoticeBulletins)
			.toBeFalsy();

		expect(component.status.loading.overall)
			.toBeFalsy();

		const asset = _.find(component.hardwareAssets, { serialNumber: 'FHK1045Y01E' });

		expect(asset.fieldNotices.length)
			.toEqual(1);

		fixture.destroy();
		tick();
	}));

	it('should open a well when function called', done => {
		const hardwareAsset = MockHardwareAssetsData[0];
		component.hardwareAsset = hardwareAsset;

		const systemAsset = MockSystemAssetsData[0];
		component.systemAsset = systemAsset;

		component.hardwareAssets = MockHardwareAssetsData;
		component.selectedAsset = MockHardwareAssetsData[0];

		spyOn(productAlertsService, 'getHardwareEoxBulletin')
			.and
			.returnValue(of(MockHardwareEOLBulletinsResponse));
		spyOn(productAlertsService, 'getHardwareEox')
			.and
			.returnValue(of(MockHardwareEOLResponse));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(of({ data: MockFieldNoticeBulletins }));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of({ data: MockFieldNotices }));

		component.ngOnInit();
		sendRacetrack();

		fixture.whenStable()
		.then(() => {
			expect(component.status.loading.eol)
				.toBeFalsy();

			expect(component.status.loading.eolBulletin)
				.toBeFalsy();

			expect(component.status.loading.fieldNotices)
				.toBeFalsy();

			expect(component.status.loading.fieldNoticeBulletins)
				.toBeFalsy();

			expect(component.status.loading.overall)
				.toBeFalsy();

			expect(_.get(component.hardwareAssets[0], 'toggleWell'))
				.toBeTruthy();

			component.onRowSelect(component.hardwareAssets[0]);
			fixture.detectChanges();

			expect(_.get(component.hardwareAssets[0], 'toggleWell'))
				.toBeFalsy();

			done();
		});
	});

	it('should change assets', done => {
		sendRacetrack();

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
