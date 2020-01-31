import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	AdvisorySecurityAdvisoryScenarios,
	FieldNoticeAdvisoryScenarios,
	Mock,
	user,
	CriticalBugData,
	MockNetworkElements,
	RacetrackScenarios,
	MockHardwareAssetsData,
	MockSystemAssetsData,
} from '@mock';
import { AssetDetailsAdvisoriesComponent } from './advisories.component';
import { AssetDetailsAdvisoriesModule } from './advisories.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError, of } from 'rxjs';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { ProductAlertsService, DiagnosticsService } from '@sdp-api';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RacetrackInfoService } from '@services';

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

describe('AssetDetailsAdvisoriesComponent', () => {
	let component: AssetDetailsAdvisoriesComponent;
	let fixture: ComponentFixture<AssetDetailsAdvisoriesComponent>;
	let productAlertsService: ProductAlertsService;
	let diagnosticsService: DiagnosticsService;
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
				AssetDetailsAdvisoriesModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {
		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
		racetrackInfoService = TestBed.get(RacetrackInfoService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsAdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle error scenarios for general calls', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.systemAsset = MockSystemAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		jest.spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(diagnosticsService, 'getCriticalBugs')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		sendRacetrack();

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const advisoryTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });
			const bugTab = _.find(component.tabs, { key: 'bug' });

			expect(advisoryTab.data)
				.toEqual([]);
			expect(fieldTab.data)
				.toEqual([]);
			expect(bugTab.data)
				.toEqual([]);

			done();
		});
	});

	it('should attach results to the tabs data', done => {
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.systemAsset = MockSystemAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		jest.spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.mockReturnValue(of(getActiveBody(AdvisorySecurityAdvisoryScenarios[0])));
		jest.spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.mockReturnValue(of(getActiveBody(FieldNoticeAdvisoryScenarios[0])));

		sendRacetrack();

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const advisoryTab = _.find(component.tabs, { key: 'security' });
			_.set(advisoryTab, ['params', 'neInstanceId'], ['id']);
			const fieldTab = _.find(component.tabs, { key: 'field' });

			expect(advisoryTab.data.length)
				.toEqual(getActiveBody(AdvisorySecurityAdvisoryScenarios[0]).data.length);
			expect(fieldTab.data.length)
				.toEqual(getActiveBody(FieldNoticeAdvisoryScenarios[0]).data.length);

			done();
		});
	});

	it('should set the selectedAdvisory when selecting a row', fakeAsync(() => {
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.systemAsset = MockSystemAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		jest.spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.mockReturnValue(of(getActiveBody(AdvisorySecurityAdvisoryScenarios[0])));
		jest.spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.mockReturnValue(of(getActiveBody(FieldNoticeAdvisoryScenarios[0])));
		jest.spyOn(diagnosticsService, 'getCriticalBugs')
			.mockReturnValue(of({ data: CriticalBugData }));

		sendRacetrack();

		fixture.detectChanges();
		component.ngOnInit();
		fixture.detectChanges();

		tick(1000);

		const securityTab = _.find(component.tabs, { key: 'security' });
		const fieldTab = _.find(component.tabs, { key: 'field' });
		const bugsTab = _.find(component.tabs, { key: 'bug' });

		component.selectTab(bugsTab);
		_.set(bugsTab.data[0], 'active', true);
		component.onRowSelect(bugsTab.data[0]);
		fixture.detectChanges();

		expect(component.selectedAdvisory)
			.toEqual({ id: bugsTab.data[0].id, type: 'bug' });

		_.set(bugsTab.data[0], 'active', false);
		component.onRowSelect(bugsTab.data[0]);
		fixture.detectChanges();

		expect(component.selectedAdvisory)
			.toBeNull();

		component.selectTab(fieldTab);
		_.set(fieldTab.data[0], 'active', true);
		component.onRowSelect(fieldTab.data[0]);
		fixture.detectChanges();
		expect(component.selectedAdvisory)
			.toEqual({ id: fieldTab.data[0].id, type: 'field' });

		component.selectTab(securityTab);
		_.set(securityTab.data[0], 'active', true);
		component.onRowSelect(securityTab.data[0]);
		fixture.detectChanges();
		expect(component.selectedAdvisory)
			.toEqual({
				id: securityTab.data[0].id,
				type: 'security' });

		fixture.destroy();
		tick();
	}));

	it('should clear the advisory on panel close', done => {
		component.hardwareAsset = MockHardwareAssetsData[0];
		component.systemAsset = MockSystemAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		jest.spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.mockReturnValue(of(getActiveBody(AdvisorySecurityAdvisoryScenarios[0])));
		jest.spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.mockReturnValue(of(getActiveBody(FieldNoticeAdvisoryScenarios[0])));

		jest.spyOn(diagnosticsService, 'getCriticalBugs')
			.mockReturnValue(of({ data: CriticalBugData }));

		sendRacetrack();

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const bugsTab = _.find(component.tabs, { key: 'bug' });

			component.selectTab(bugsTab);
			_.set(bugsTab.data[0], 'active', true);
			component.onRowSelect(bugsTab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toEqual({ id: bugsTab.data[0].id, type: 'bug' });

			component.onPanelClose();

			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toBeNull();

			done();
		});
	});

	it('should handle changing assets', () => {
		const asset = MockHardwareAssetsData[0];
		const newAsset = MockHardwareAssetsData[1];

		component.hardwareAsset = asset;
		component.ngOnChanges({
			hardwareAsset: {
				currentValue: asset,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		fixture.detectChanges();

		expect(component.hardwareAsset)
			.toEqual(asset);

		component.hardwareAsset = newAsset;
		component.ngOnChanges({
			hardwareAsset: {
				currentValue: newAsset,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: asset,
			},
		});

		fixture.detectChanges();
		expect(component.hardwareAsset)
			.toEqual(newAsset);
	});

});
