import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	SecurityAdvisoryScenarios,
	SecurityAdvisoryBulletinScenarios,
	FieldNoticeScenarios,
	FieldNoticeBulletinScenarios,
	Mock,
	CriticalBugData,
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

	beforeEach(async(() => {
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
		})
		.compileComponents();

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
		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNotice')
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
				.toEqual({ });
			expect(fieldTab.data)
				.toEqual({ });
			expect(bugTab.data)
				.toEqual({ });

			done();
		});
	});

	it('should handle error scenarios for bulletin calls', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		component.asset = getActiveBody(AssetScenarios[0]).data[0];

		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(of(getActiveBody(SecurityAdvisoryScenarios[0])));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of(getActiveBody(FieldNoticeScenarios[0])));

		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const advisoryTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });

			expect(advisoryTab.data.notice.length)
				.toEqual(getActiveBody(SecurityAdvisoryScenarios[0]).data.length);
			expect(fieldTab.data.notice.length)
				.toEqual(getActiveBody(FieldNoticeScenarios[0]).data.length);

			expect(advisoryTab.data.bulletin)
				.toBeUndefined();
			expect(fieldTab.data.bulletin)
				.toBeUndefined();

			done();
		});
	});

	it('should attach results to the tabs data', done => {
		component.asset = getActiveBody(AssetScenarios[0]).data[0];

		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(of(getActiveBody(SecurityAdvisoryScenarios[0])));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of(getActiveBody(FieldNoticeScenarios[0])));

		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(of(getActiveBody(SecurityAdvisoryBulletinScenarios[0])));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(of(getActiveBody(FieldNoticeBulletinScenarios[0])));

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const advisoryTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });

			expect(advisoryTab.data.notice.length)
				.toEqual(getActiveBody(SecurityAdvisoryScenarios[0]).data.length);
			expect(fieldTab.data.notice.length)
				.toEqual(getActiveBody(FieldNoticeScenarios[0]).data.length);

			expect(advisoryTab.data.bulletin.length)
			.toEqual(getActiveBody(SecurityAdvisoryBulletinScenarios[0]).data.length);
			expect(fieldTab.data.bulletin.length)
			.toEqual(getActiveBody(FieldNoticeBulletinScenarios[0]).data.length);

			done();
		});
	});

	it('should set the selectedAdvisory when selecting a row', done => {
		component.asset = getActiveBody(AssetScenarios[0]).data[0];

		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(of(getActiveBody(SecurityAdvisoryScenarios[0])));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of(getActiveBody(FieldNoticeScenarios[0])));

		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(of(getActiveBody(SecurityAdvisoryBulletinScenarios[0])));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(of(getActiveBody(FieldNoticeBulletinScenarios[0])));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of({ data: CriticalBugData }));

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const securityTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });
			const bugsTab = _.find(component.tabs, { key: 'bug' });

			component.selectTab(bugsTab);
			_.set(bugsTab.data.bulletin[0], 'active', true);
			component.onRowSelect(bugsTab.data.bulletin[0]);
			fixture.detectChanges();
			expect(component.selectedAdvisory)
				.toEqual({ id: bugsTab.data.bulletin[0].id, type: 'bug' });

			_.set(bugsTab.data.bulletin[0], 'active', false);
			component.onRowSelect(bugsTab.data.bulletin[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toBeNull();

			component.selectTab(fieldTab);
			_.set(fieldTab.data.bulletin[0], 'active', true);
			component.onRowSelect(fieldTab.data.bulletin[0]);
			fixture.detectChanges();
			expect(component.selectedAdvisory)
				.toEqual({ id: fieldTab.data.bulletin[0].fieldNoticeId, type: 'field' });

			component.selectTab(securityTab);
			_.set(securityTab.data.bulletin[0], 'active', true);
			component.onRowSelect(securityTab.data.bulletin[0]);
			fixture.detectChanges();
			expect(component.selectedAdvisory)
				.toEqual({
					id: securityTab.data.bulletin[0].securityAdvisoryInstanceId,
					type: 'security' });

			done();
		});
	});
});
