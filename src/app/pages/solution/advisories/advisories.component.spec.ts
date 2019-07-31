import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvisoriesComponent } from './advisories.component';
import { AdvisoriesModule } from './advisories.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ProductAlertsService, DiagnosticsService } from '@sdp-api';
import * as _ from 'lodash-es';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';

describe('AdvisoriesComponent', () => {
	let component: AdvisoriesComponent;
	let fixture: ComponentFixture<AdvisoriesComponent>;
	let productAlertsService: ProductAlertsService;
	let diagnosticsService: DiagnosticsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AdvisoriesModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule.withRoutes([
					{ path: 'solution/advisories/security', component: AdvisoriesComponent },
					{ path: 'solution/advisories/field-notices', component: AdvisoriesComponent },
					{ path: 'solution/advisories/bugs', component: AdvisoriesComponent },
				]),
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
							params: of({ advisory: 'security' }),
						},
					},
				},
			],
		})
		.compileComponents();

		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
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

	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getSecurityAdvisorySeverityCountResponse')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getSecurityAdvisoryLastUpdatedCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const securityTab = _.find(component.tabs, { key: 'security' });
			const fieldTab = _.find(component.tabs, { key: 'field' });
			const bugsTab = _.find(component.tabs, { key: 'bug' });

			expect(securityTab.data.length)
				.toBe(0);
			expect(securityTab.loading)
				.toBeFalsy();

			expect(fieldTab.data.length)
				.toBe(0);
			expect(fieldTab.loading)
				.toBeFalsy();

			expect(bugsTab.data.length)
				.toBe(0);
			expect(bugsTab.loading)
				.toBeFalsy();

			done();
		});
	});

	it('should load security details if row selected', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'security' });
			component.selectTab(_.findIndex(component.tabs, { key: 'security' }));
			tab.data[0].active = true;
			component.onRowSelect(tab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toEqual({ advisory: tab.data[0], id: tab.data[0].id, type: 'security' });

			tab.data[0].active = false;
			component.onRowSelect(tab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toBeNull();

			done();
		});
	});

	it('should load field notice details if row selected', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'field' });
			component.selectTab(_.findIndex(component.tabs, { key: 'field' }));
			tab.data[0].active = true;
			component.onRowSelect(tab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toEqual({ advisory: tab.data[0], id: tab.data[0].id, type: 'field' });

			tab.data[0].active = false;
			component.onRowSelect(tab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toBeNull();

			done();
		});
	});

	it('should load bug details if row selected', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'bug' });
			component.selectTab(_.findIndex(component.tabs, { key: 'bug' }));
			tab.data[0].active = true;
			component.onRowSelect(tab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toEqual({ advisory: tab.data[0], id: tab.data[0].id, type: 'bug' });

			tab.data[0].active = false;
			component.onRowSelect(tab.data[0]);
			fixture.detectChanges();

			expect(component.selectedAdvisory)
				.toBeNull();

			done();
		});
	});
});
