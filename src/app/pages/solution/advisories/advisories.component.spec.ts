import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoriesComponent } from './advisories.component';
import { AdvisoriesModule } from './advisories.module';
import * as _ from 'lodash-es';
import { ProductAlertsService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/** Index of the security advisories tab */
const SECURITY_ADVISORIES_INDEX = 0;
/** Index of the field notices tab */
const FIELD_NOTICES_INDEX = 1;
/** Index of the critical bugs tab */
const CRITICAL_BUGS_INDEX = 2;

describe('AdvisoriesComponent', () => {
	let component: AdvisoriesComponent;
	let fixture: ComponentFixture<AdvisoriesComponent>;

	let productAlertsService: ProductAlertsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AdvisoriesModule,
				HttpClientTestingModule,
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
	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
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

			expect(_.find(component.tabs[SECURITY_ADVISORIES_INDEX].filters,
				{ key: 'total' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.tabs[FIELD_NOTICES_INDEX].filters,
				{ key: 'total' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.tabs[CRITICAL_BUGS_INDEX].filters,
				{ key: 'total' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.tabs[SECURITY_ADVISORIES_INDEX].filters,
				{ key: 'impact' }).seriesData.length)
				.toBe(0);

			done();
		});
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
});
