import { async, fakeAsync, flush, tick, ComponentFixture, TestBed } from '@angular/core/testing';
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
import {
	FieldNoticeAdvisoryScenarios,
	AdvisorySecurityAdvisoryScenarios,
	FieldNoticeCountScenarios,
	SecurityAdvisorySeverityCountScenarios,
	SecurityAdvisoryLastUpdatedCountScenarios,
	CriticalBugScenarios,
	VulnerabilityScenarios,
	user,
} from '@mock';

fdescribe('AdvisoriesComponent', () => {
	let component: AdvisoriesComponent;
	let fixture: ComponentFixture<AdvisoriesComponent>;
	let productAlertsService: ProductAlertsService;
	let diagnosticsService: DiagnosticsService;

	const buildSpies = () => {
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(of(
				<any> FieldNoticeAdvisoryScenarios[0]
				.scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(of(
				<any> AdvisorySecurityAdvisoryScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getSecurityAdvisorySeverityCount')
			.and
			.returnValue(of(
				SecurityAdvisorySeverityCountScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getSecurityAdvisoryLastUpdatedCount')
			.and
			.returnValue(of(
				SecurityAdvisoryLastUpdatedCountScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getFieldNoticesLastUpdatedCount')
			.and
			.returnValue(of(
				FieldNoticeCountScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(of(
				VulnerabilityScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of(<any> CriticalBugScenarios[5].scenarios.GET[0].response.body));
		spyOn(diagnosticsService, 'getCriticalBugsStateCount')
			.and
			.returnValue(of(
				CriticalBugScenarios[0].scenarios.GET[0].response.body,
			));
	};

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
	}));

	beforeEach(() => {
		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should switch active filters', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick();
		const tab = _.find(component.tabs, { key: 'security' });
		component.selectTab(0);
		tick();
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
		tick();

		fixture.detectChanges();

		expect(_.filter(tab.filters, 'selected'))
			.toContain(impactFilter);
		fixture.destroy();
		flush();
	}));

	it('should clear the filter when selecting the same subfilter twice', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getFieldNoticesLastUpdatedCount')
			.and
			.returnValue(of(
				FieldNoticeCountScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(of(
				VulnerabilityScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(diagnosticsService, 'getCriticalBugsStateCount')
			.and
			.returnValue(of(
				CriticalBugScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(throwError(error));
		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(throwError(error));
		spyOn(productAlertsService, 'getSecurityAdvisorySeverityCount')
			.and
			.returnValue(throwError(error));
		spyOn(productAlertsService, 'getSecurityAdvisoryLastUpdatedCount')
			.and
			.returnValue(throwError(error));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(throwError(error));
		fixture.detectChanges();
		tick();
		const tab = _.find(component.tabs, { key: 'security' });
		component.selectTab(0);
		tick();
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
		tick();

		expect(_.filter(tab.filters, 'selected'))
			.toContain(impactFilter);

		let subfilter = _.find(impactFilter.seriesData, { filter: 'info' });

		expect(subfilter.selected)
			.toBeTruthy();

		component.onSubfilterSelect('info', impactFilter);
		tick();

		subfilter = _.find(impactFilter.seriesData, { filter: 'info' });

		expect(subfilter.selected)
			.toBeFalsy();
		fixture.destroy();
		flush();
	}));

	it('should change pages', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'security' });
		component.onPageChanged({ page: 1 }, tab);
		tick(1000);

		expect(tab.params.page)
		.toBe(2);
	}));

	it('should clear filters', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'security' });

		const totalFilter = _.find(tab.filters, { key: 'total' });
		totalFilter.selected = false;
		const impactFilter = _.find(tab.filters, { key: 'severity' });
		impactFilter.selected = true;
		const impactSubfilter = _.find(impactFilter.seriesData, { filter: 'critical' });
		impactSubfilter.selected = true;
		tab.selectedSubfilters = [impactSubfilter];
		component.clearFilters();
		tick(1000);
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
	}));

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set null values on request errors', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getFieldNoticesLastUpdatedCount')
			.and
			.returnValue(of(
				FieldNoticeCountScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(of(
				VulnerabilityScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(diagnosticsService, 'getCriticalBugsStateCount')
			.and
			.returnValue(of(
				CriticalBugScenarios[0].scenarios.GET[0].response.body,
			));
		spyOn(productAlertsService, 'getAdvisoriesFieldNotices')
			.and
			.returnValue(throwError(error));
		spyOn(productAlertsService, 'getAdvisoriesSecurityAdvisories')
			.and
			.returnValue(throwError(error));
		spyOn(productAlertsService, 'getSecurityAdvisorySeverityCount')
			.and
			.returnValue(throwError(error));
		spyOn(productAlertsService, 'getSecurityAdvisoryLastUpdatedCount')
			.and
			.returnValue(throwError(error));
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(throwError(error));

		fixture.detectChanges();
		tick(1000);
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
	}));

	it('should load security details if row selected', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'security' });
		component.selectTab(_.findIndex(component.tabs, { key: 'security' }));
		tab.data[0].active = true;
		component.onRowSelect(tab.data[0]);
		tick(1000);

		expect(component.selectedAdvisory)
			.toEqual({ advisory: tab.data[0], id: tab.data[0].id, type: 'security' });

		tab.data[0].active = false;
		component.onRowSelect(tab.data[0]);
		tick(1000);

		expect(component.selectedAdvisory)
			.toBeNull();
	}));

	/**
	 * @TODO: modify test to use UI
	 */
	it('should set query params for Last Updated filter', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);
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
		tick(1000);

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
		tick(1000);

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
		tick(1000);

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
		tick(1000);

		const lastUpdatedDate90 = _.map(
			_.get(tab, ['params', 'lastUpdatedDateRange'])[0]
				.split(','),
			t => _.toSafeInteger(t));

		expect(lastUpdatedDate90.length)
			.toBe(2);
		expect(currentTime - lastUpdatedDate90[1])
			.toBe(dayInMillis * 90);
	}));

	it('should handle unsortable column', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);
		const tab = _.find(component.tabs, { key: 'security' });
		tab.filtered = false;
		const severityCol = _.find(tab.options.columns, { key: 'severity' });
		severityCol.sortable = false;
		severityCol.sortDirection = 'asc';
		const titleCol = _.find(tab.options.columns, { key: 'title' });
		titleCol.sorting = true;
		titleCol.sortDirection = 'desc';

		expect(tab.filtered)
			.toBeFalsy();
		component.onColumnSort(severityCol);
		tick(1000);
		expect(_.get(tab, ['params', 'sort']))
			.toBeFalsy();
	}));

	it('should handle sortable column', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);
		const tab = _.find(component.tabs, { key: 'security' });
		tab.filtered = false;
		const severityCol = _.find(tab.options.columns, { key: 'severity' });
		severityCol.sorting = true;
		const titleCol = _.find(tab.options.columns, { key: 'title' });
		titleCol.sorting = false;
		titleCol.sortDirection = 'asc';

		component.onColumnSort(titleCol);
		tick(1000);

		expect(tab.filtered)
			.toBeTruthy();
		expect(tab.params.sort)
			.toEqual(['title:ASC']);
	}));

	it('should load field notice details if row selected', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'field' });
		component.selectTab(_.findIndex(component.tabs, { key: 'field' }));
		tab.data[0].active = true;
		component.onRowSelect(tab.data[0]);
		tick(1000);

		expect(component.selectedAdvisory)
			.toEqual({ advisory: tab.data[0], id: tab.data[0].id, type: 'field' });

		tab.data[0].active = false;
		component.onRowSelect(tab.data[0]);
		tick(1000);

		expect(component.selectedAdvisory)
			.toBeNull();
	}));

	it('should load bug details if row selected', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'bug' });
		component.selectTab(_.findIndex(component.tabs, { key: 'bug' }));
		tab.data[0].active = true;
		component.onRowSelect(tab.data[0]);
		tick(1000);

		expect(component.selectedAdvisory)
			.toEqual({ advisory: tab.data[0], id: tab.data[0].id, type: 'bug' });

		tab.data[0].active = false;
		component.onRowSelect(tab.data[0]);
		tick(1000);

		expect(component.selectedAdvisory)
			.toBeNull();
	}));

	it('should change the route based on the selected tab', fakeAsync(() => {
		spyOn(component.router, 'navigate');
		fixture.detectChanges();
		tick(1000);

		// test bugs tab
		component.selectTab(_.findIndex(component.tabs, { key: 'bug' }));
		tick(1000);

		expect(component.router.navigate)
			.toHaveBeenCalledWith(['/solution/advisories/bugs'],
				{ queryParams: { page: 1 } });

		// test field notices tab
		component.selectTab(_.findIndex(component.tabs, { key: 'field' }));
		tick(1000);

		expect(component.router.navigate)
			.toHaveBeenCalledWith(['/solution/advisories/field-notices'],
				{ queryParams: { page: 1 } });

		// test security tab
		component.selectTab(_.findIndex(component.tabs, { key: 'security' }));
		tick(1000);

		expect(component.router.navigate)
			.toHaveBeenCalledWith(['/solution/advisories/security'],
				{ queryParams: { page: 1 } });
	}));

	it('should add the selected filters to the route', fakeAsync(() => {
		buildSpies();
		spyOn(component.router, 'navigate');
		fixture.detectChanges();
		tick(1000);

		component.selectTab(_.findIndex(component.tabs, { key: 'security' }));
		tick(1000);

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
		tick(1000);

		expect(component.router.navigate)
			.toHaveBeenCalledWith(
				['/solution/advisories/security'],
				{ queryParams: { page: 1, severity: ['info'] } });
	}));

	it('should search', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'security' });

		expect(tab.filtered)
			.toBeFalsy();
		tab.searchForm.controls.search.setValue('query');
		component.doSearch(tab);
		tick(1000);

		expect(tab.filtered)
		.toBeTruthy();
	}));

	it('should not search', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);

		const tab = _.find(component.tabs, { key: 'security' });

		expect(tab.filtered)
			.toBeFalsy();

		tab.searchForm.controls.search.setValue('');
		component.doSearch(tab);
		tick(1000);

		expect(tab.filtered)
			.toBeFalsy();
	}));

	it('should unset search param if search input is empty for refresh', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);
		const tab = _.find(component.tabs, { key: 'security' });
		_.set(tab, ['params', 'search'], 'search');
		tab.filtered = true;
		tab.searchForm.controls.search.setValue('');

		component.doSearch(tab);
		tick(1000);

		expect(_.get(tab, ['params', 'search']))
			.toBeFalsy();
	}));

	it('should not refresh when valid search query', fakeAsync(() => {
		buildSpies();
		fixture.detectChanges();
		tick(1000);
		const tab = _.find(component.tabs, { key: 'security' });
		_.set(tab, ['params', 'search'], 'search');
		tab.searchForm.setValue({ search: 'search' });

		expect(_.get(tab, ['params', 'search']))
			.toBe('search');
	}));

	it('should set query params on page load for security advisories', fakeAsync(() => {
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
		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
		buildSpies();
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		tick(1000);
		const tab = _.find(component.tabs, { key: 'security' });
		expect(_.get(tab.params, 'lastUpdatedDateRange'))
			.toEqual(_.castArray('1565624197000,1597246597000'));
		expect(_.get(tab.params, 'severity'))
			.toEqual(_.castArray('low'));
	}));

	it('should set query params on page load for field notices', fakeAsync(() => {
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
		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
		buildSpies();
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		tick(1000);
		const tab = _.find(component.tabs, { key: 'field' });
		expect(_.get(tab.params, 'lastUpdatedDateRange'))
			.toEqual(_.castArray('1565624197000,1597246597000'));
	}));

	it('should set query params on page load for critical bugs', fakeAsync(() => {
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
		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
		buildSpies();
		fixture = TestBed.createComponent(AdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		tick(1000);
		const tab = component.selectedTab;
		expect(_.get(tab.params, 'state'))
			.toEqual(_.castArray('new'));
	}));
});
