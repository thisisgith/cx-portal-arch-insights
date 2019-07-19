import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoriesComponent } from './advisories.component';
import { AdvisoriesModule } from './advisories.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ProductAlertsService } from '@sdp-api';
import * as _ from 'lodash-es';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AdvisoriesComponent', () => {
	let component: AdvisoriesComponent;
	let fixture: ComponentFixture<AdvisoriesComponent>;
	let productAlertsService: ProductAlertsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AdvisoriesModule,
				HttpClientTestingModule,
				MicroMockModule,
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
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should switch active filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = _.find(component.tabs, { key: 'security' });
			component.selectTab(0);
			const totalFilter = _.find(tab.filters, { key: 'total' });
			const impactFilter = _.find(tab.filters, { key: 'impact' });
			impactFilter.seriesData = [
				{
					filter: 'info',
					label: 'Info',
					selected: false,
					value: 4,
				},
			];

			expect(_.find(tab.filters, 'selected'))
				.toEqual(totalFilter);

			component.onSubfilterSelect('info', impactFilter);

			fixture.detectChanges();

			expect(_.filter(tab.filters, 'selected'))
				.toContain(impactFilter);

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should clear the filter when selecting the same subfilter twice', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = _.find(component.tabs, { key: 'security' });
			component.selectTab(0);
			const impactFilter = _.find(tab.filters, { key: 'impact' });
			impactFilter.seriesData = [
				{
					filter: 'info',
					label: 'Info',
					selected: false,
					value: 4,
				},
			];
			component.onSubfilterSelect('info', impactFilter);

			fixture.detectChanges();

			expect(_.filter(tab.filters, 'selected'))
				.toContain(impactFilter);

			let subfilter = _.find(impactFilter.seriesData, { filter: 'info' });

			expect(subfilter.selected)
				.toBeTruthy();

			component.onSubfilterSelect('info', impactFilter);

			fixture.detectChanges();

			subfilter = _.find(impactFilter.seriesData, { filter: 'info' });

			expect(subfilter.selected)
				.toBeFalsy();

			done();
		});
	});

	it('should change pages', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'security' });
			component.onPageChanged({ page: 1 }, tab);

			fixture.detectChanges();

			expect(tab.params.page)
			.toBe(2);

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getTopSecurityAdvisories')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getSecurityAdvisorySummaryResponse')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const securityTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });
			const bugsTab = _.find(component.tabs, { key: 'bugs' });

			expect(securityTab.data.length)
				.toBe(0);
			expect(securityTab.loading)
				.toBeFalsy();

			expect(_.find(securityTab.filters, { key: 'total' }).seriesData.length)
				.toBe(0);
			expect(_.find(fieldTab.filters,
				{ key: 'total' }).seriesData.length)
				.toBe(0);
			expect(_.find(bugsTab.filters,
				{ key: 'total' }).seriesData.length)
				.toBe(0);
			expect(_.find(securityTab.filters,
				{ key: 'impact' }).seriesData.length)
				.toBe(0);

			done();
		});
	});

});
