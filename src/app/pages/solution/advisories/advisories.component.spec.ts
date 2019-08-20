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
							params: { advisory: 'security' },
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
			const impactFilter = _.find(tab.filters, { key: 'severity' });
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
			const tab = _.find(component.tabs, { key: 'security' });
			component.selectTab(0);
			const impactFilter = _.find(tab.filters, { key: 'severity' });
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

	it('should clear filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'security' });

			const totalFilter = _.find(tab.filters, { key: 'total' });
			totalFilter.selected = false;
			const impactFilter = _.find(tab.filters, { key: 'severity' });
			impactFilter.selected = true;
			const impactSubfilter = _.find(impactFilter.seriesData, { filter: 'critical' });
			impactSubfilter.selected = true;
			tab.selectedSubfilters = [impactSubfilter];
			component.clearFilters();
			fixture.detectChanges();
			expect(tab.selectedSubfilters.length)
				.toBe(0);
			expect(tab.filtered)
				.toBeFalsy();

			_.each(_.omitBy(tab.filters, { key: 'total' }), filter => {
				expect(filter.selected)
					.toBeFalsy();
				expect(_.some(filter.seriesData, 'selected'))
					.toBeFalsy();
			});

			expect(totalFilter.selected)
				.toBeTruthy();
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

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set query params for Last Updated filter', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			spyOn(Date.prototype, 'getUTCFullYear').and
				.callFake(() => 2013);
			spyOn(Date.prototype, 'getUTCMonth').and
				.callFake(() => 9);
			spyOn(Date.prototype, 'getUTCDay').and
				.callFake(() => 23);
			const tab = _.find(component.tabs, { key: 'security' });
			const currentTime = new Date(2013, 9, 23).getTime();
			const lastUpdatedFilter = _.find(tab.filters, { key: 'lastUpdate' });
			const dayInMillis = 24 * 60 * 60 * 1000;

			component.onSubfilterSelect('gt-0-lt-30-days', lastUpdatedFilter);

			fixture.detectChanges();
			const lastUpdatedDate30 = _.map(
				_.get(tab, ['params', 'lastUpdatedDateRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastUpdatedDate30.length)
				.toBe(2);
			expect(currentTime - lastUpdatedDate30[0])
				.toBe(dayInMillis * 30);
			expect(currentTime - lastUpdatedDate30[1])
				.toBe(0);

			component.onSubfilterSelect('gt-30-lt-60-days', lastUpdatedFilter);

			fixture.detectChanges();
			const lastUpdatedDate3060 = _.map(
				_.get(tab, ['params', 'lastUpdatedDateRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastUpdatedDate3060.length)
				.toBe(2);
			expect(currentTime - lastUpdatedDate3060[0])
				.toBe(dayInMillis * 60);
			expect(currentTime - lastUpdatedDate3060[1])
				.toBe(dayInMillis * 30);

			component.onSubfilterSelect('gt-60-lt-90-days', lastUpdatedFilter);

			fixture.detectChanges();
			const lastUpdatedDate6090 = _.map(
				_.get(tab, ['params', 'lastUpdatedDateRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastUpdatedDate6090.length)
				.toBe(2);
			expect(currentTime - lastUpdatedDate6090[0])
				.toBe(dayInMillis * 90);
			expect(currentTime - lastUpdatedDate6090[1])
				.toBe(dayInMillis * 60);

			component.onSubfilterSelect('further-out', lastUpdatedFilter);

			fixture.detectChanges();
			const lastUpdatedDate90 = _.map(
				_.get(tab, ['params', 'lastUpdatedDateRange'])[0]
					.split(','),
				t => _.toSafeInteger(t));

			expect(lastUpdatedDate90.length)
				.toBe(2);
			expect(currentTime - lastUpdatedDate90[1])
				.toBe(dayInMillis * 90);
			done();
		});
	});

	it('should handle unsortable column', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = _.find(component.tabs, { key: 'security' });
			tab.filtered = false;
			const severityCol = _.find(tab.options.columns, { key: 'severity' });
			severityCol.sortable = false;
			severityCol.sortDirection = 'asc';
			const titleCol = _.find(tab.options.columns, { key: 'title' });
			titleCol.sorting = true;
			titleCol.sortDirection = 'desc';

			fixture.detectChanges();
			expect(tab.filtered)
				.toBeFalsy();
			component.onColumnSort(severityCol);
			expect(_.get(tab, ['params', 'sort']))
				.toBeFalsy();
			done();
		});
	});

	it('should handle sortable column', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = _.find(component.tabs, { key: 'security' });
			tab.filtered = false;
			const severityCol = _.find(tab.options.columns, { key: 'severity' });
			severityCol.sorting = true;
			const titleCol = _.find(tab.options.columns, { key: 'title' });
			titleCol.sorting = false;
			titleCol.sortDirection = 'asc';

			fixture.detectChanges();

			component.onColumnSort(titleCol);

			expect(tab.filtered)
				.toBeTruthy();
			expect(tab.params.sort)
				.toEqual(['title:ASC']);
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

	it('should set a loading boolean for Cypress runs', done => {
		expect(window.loading)
			.toBeUndefined();
		window.Cypress = true;

		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(window.loading)
				.toBe(false);
			// cleanup
			window.Cypress = undefined;
			window.loading = undefined;
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

	it('should change the route based on the selected tab', done => {
		spyOn(component.router, 'navigate');
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			// test bugs tab
			component.selectTab(_.findIndex(component.tabs, { key: 'bug' }));
			fixture.detectChanges();

			expect(component.router.navigate)
				.toHaveBeenCalledWith(['/solution/advisories/bugs'], { queryParams: { } });

			// test field notices tab
			component.selectTab(_.findIndex(component.tabs, { key: 'field' }));
			fixture.detectChanges();

			expect(component.router.navigate)
				.toHaveBeenCalledWith(['/solution/advisories/field-notices'], { queryParams: { } });

			// test security tab
			component.selectTab(_.findIndex(component.tabs, { key: 'security' }));
			fixture.detectChanges();

			expect(component.router.navigate)
				.toHaveBeenCalledWith(['/solution/advisories/security'], { queryParams: { } });

			done();
		});
	});

	it('should add the selected filters to the route', done => {
		spyOn(component.router, 'navigate');
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			component.selectTab(_.findIndex(component.tabs, { key: 'security' }));

			const tab = component.selectedTab;
			const impactFilter = _.find(tab.filters, { key: 'severity' });
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

			expect(component.router.navigate)
				.toHaveBeenCalledWith(
					['/solution/advisories/security'],
					{ queryParams: { severity: ['info'] } });

			done();
		});
	});

	it('should search', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'security' });

			expect(tab.filtered)
				.toBeFalsy();
			component.doSearch('query', tab);
			fixture.detectChanges();

			expect(tab.filtered)
			.toBeTruthy();

			done();
		});
	});

	it('should not search', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const tab = _.find(component.tabs, { key: 'security' });

			expect(tab.filtered)
				.toBeFalsy();
			component.doSearch('', tab);
			fixture.detectChanges();

			expect(tab.filtered)
			.toBeFalsy();

			done();
		});
	});

	it('should unset search param if search input is empty for refresh', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = _.find(component.tabs, { key: 'security' });
			_.set(tab, ['params', 'search'], 'search');
			tab.searchForm.setValue({ search: '' });

			fixture.detectChanges();

			expect(_.get(tab, ['params', 'search']))
				.toBeFalsy();
			done();
		});
	});

	it('should not refresh when valid search query', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = _.find(component.tabs, { key: 'security' });
			_.set(tab, ['params', 'search'], 'search');
			tab.searchForm.setValue({ search: 'search' });

			fixture.detectChanges();

			expect(_.get(tab, ['params', 'search']))
				.toBe('search');
			done();
		});
	});

	it('should set query params on page load for security advisories', done => {
		const queryParams = {
			lastUpdatedDateRange: '1565624197000,1597246597000',
			severity: 'low',
		};
		TestBed.resetTestingModule();
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
						queryParams: of(queryParams),
						snapshot: {
							data: {
								user,
							},
							params: { advisory: 'security' },
						},
					},
				},
			],
		})
		.compileComponents();
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		const tab = _.find(component.tabs, { key: 'security' });
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(_.get(tab.params, 'lastUpdatedDateRange'))
				.toEqual(_.castArray('1565624197000,1597246597000'));
			expect(_.get(tab.params, 'severity'))
				.toEqual(_.castArray('low'));
			done();
		});
	});

	it('should set query params on page load for field notices', done => {
		const queryParams = {
			lastUpdatedDateRange: '1565624197000,1597246597000',
		};
		TestBed.resetTestingModule();
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
						queryParams: of(queryParams),
						snapshot: {
							data: {
								user,
							},
							params: { advisory: 'field-notices' },
						},
					},
				},
			],
		})
		.compileComponents();
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		const tab = _.find(component.tabs, { key: 'field' });
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(_.get(tab.params, 'lastUpdatedDateRange'))
				.toEqual(_.castArray('1565624197000,1597246597000'));
			done();
		});
	});

	it('should set query params on page load for critical bugs', done => {
		const queryParams = {
			state: 'new',
		};
		TestBed.resetTestingModule();
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
						queryParams: of(queryParams),
						snapshot: {
							data: {
								user,
							},
							params: { advisory: 'bugs' },
						},
					},
				},
			],
		})
		.compileComponents();
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const tab = component.selectedTab;
			expect(_.get(tab.params, 'state'))
				.toEqual(_.castArray('new'));
			done();
		});
	});
});
