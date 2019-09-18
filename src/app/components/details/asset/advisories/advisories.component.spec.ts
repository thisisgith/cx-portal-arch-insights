import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
	AssetScenarios,
	AdvisorySecurityAdvisoryScenarios,
	FieldNoticeAdvisoryScenarios,
	Mock,
	user,
	CriticalBugData,
	MockNetworkElements,
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
		component.asset = getActiveBody(AssetScenarios[0]).data[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

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
		component.asset = getActiveBody(AssetScenarios[0]).data[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(of(getActiveBody(AdvisorySecurityAdvisoryScenarios[0])));
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(of(getActiveBody(FieldNoticeAdvisoryScenarios[0])));

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const advisoryTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });

			expect(advisoryTab.data.length)
				.toEqual(getActiveBody(AdvisorySecurityAdvisoryScenarios[0]).data.length);
			expect(fieldTab.data.length)
				.toEqual(getActiveBody(FieldNoticeAdvisoryScenarios[0]).data.length);

			done();
		});
	});

	it('should set the selectedAdvisory when selecting a row', fakeAsync(() => {
		component.asset = getActiveBody(AssetScenarios[0]).data[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(of(getActiveBody(AdvisorySecurityAdvisoryScenarios[0])));
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(of(getActiveBody(FieldNoticeAdvisoryScenarios[0])));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of({ data: CriticalBugData }));

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
	}));

	it('should clear the advisory on panel close', done => {
		component.asset = getActiveBody(AssetScenarios[0]).data[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(of(getActiveBody(AdvisorySecurityAdvisoryScenarios[0])));
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(of(getActiveBody(FieldNoticeAdvisoryScenarios[0])));

		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of({ data: CriticalBugData }));

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
