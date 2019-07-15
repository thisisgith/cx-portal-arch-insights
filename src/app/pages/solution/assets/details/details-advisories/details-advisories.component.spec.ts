import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	SecurityAdvisoryScenarios,
	SecurityAdvisoryBulletinScenarios,
	FieldNoticeScenarios,
	FieldNoticeBulletinScenarios,
	Mock,
} from '@mock';
import { DetailsAdvisoriesComponent } from './details-advisories.component';
import { DetailsAdvisoriesModule } from './details-advisories.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError, of } from 'rxjs';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { ProductAlertsService } from '@sdp-api';
import { RouterTestingModule } from '@angular/router/testing';

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

describe('DetailsAdvisoriesComponent', () => {
	let component: DetailsAdvisoriesComponent;
	let fixture: ComponentFixture<DetailsAdvisoriesComponent>;
	let productAlertsService: ProductAlertsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				DetailsAdvisoriesModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();

		productAlertsService = TestBed.get(ProductAlertsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailsAdvisoriesComponent);
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

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const advisoryTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });

			expect(advisoryTab.data)
				.toBeUndefined();
			expect(fieldTab.data)
				.toBeUndefined();

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
});
