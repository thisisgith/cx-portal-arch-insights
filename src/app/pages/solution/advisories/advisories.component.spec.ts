import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, flush, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvisoriesComponent } from './advisories.component';
import { AdvisoriesModule } from './advisories.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ProductAlertsService, DiagnosticsService } from '@sdp-api';
import * as _ from 'lodash-es';
import { throwError, of } from 'rxjs';
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

describe('AdvisoriesComponent', () => {
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
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of(<any> CriticalBugScenarios[5].scenarios.GET[0].response.body));
		spyOn(diagnosticsService, 'getCriticalBugsStateCount')
			.and
			.returnValue(of(
				CriticalBugScenarios[0].scenarios.GET[0].response.body,
			));
	};

	describe('No Query Params', () => {

		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					AdvisoriesModule,
					HttpClientTestingModule,
					MicroMockModule,
					RouterTestingModule.withRoutes([
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/security',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/field-notices',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/bugs',
						},
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
			});
		});

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

			component.selectTab(_.findIndex(component.tabs, { key: 'security' }));

			const tab = component.selectedTab;
			component.onSubfilterSelect('critical', _.find(tab.filters, { key: 'severity' }));

			fixture.detectChanges();
			tick(1000);

			expect(_.find(tab.filters, { key: 'total' }).selected)
				.toBeFalsy();

			expect(tab.selectedSubfilters.length)
				.toBe(1);

			component.clearFilters();

			fixture.detectChanges();
			tick(1000);

			expect(tab.selectedSubfilters.length)
				.toBe(0);
			expect(_.find(tab.filters, { key: 'total' }).selected)
				.toBeTruthy();
		}));

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

		it('should set query params for Last Updated filter', fakeAsync(() => {
			buildSpies();
			fixture.detectChanges();
			tick(1000);

			const tab = _.find(component.tabs, { key: 'security' });
			const lastUpdatedFilter = _.find(tab.filters, { key: 'lastUpdate' });

			component.onSubfilterSelect('gt-0-lt-30-days', lastUpdatedFilter);
			tick(1000);

			expect(_.get(tab, ['params', 'lastUpdatedDateRange']))
				.toEqual(['gt-0-lt-30-days']);

			component.onSubfilterSelect('gt-30-lt-60-days', lastUpdatedFilter);
			tick(1000);

			expect(_.get(tab, ['params', 'lastUpdatedDateRange']))
				.toEqual(['gt-30-lt-60-days']);

			component.onSubfilterSelect('gt-60-lt-90-days', lastUpdatedFilter);
			tick(1000);

			expect(_.get(tab, ['params', 'lastUpdatedDateRange']))
				.toEqual(['gt-60-lt-90-days']);

			component.onSubfilterSelect('further-out', lastUpdatedFilter);
			tick(1000);

			expect(_.get(tab, ['params', 'lastUpdatedDateRange']))
				.toEqual(['further-out']);
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
					{ queryParams: { page: 1, sort: ['id:ASC'] } });

			// test field notices tab
			component.selectTab(_.findIndex(component.tabs, { key: 'field' }));
			tick(1000);

			expect(component.router.navigate)
				.toHaveBeenCalledWith(['/solution/advisories/field-notices'],
					{ queryParams: { page: 1, sort: ['id:ASC'] } });

			// test security tab
			component.selectTab(_.findIndex(component.tabs, { key: 'security' }));
			tick(1000);

			expect(component.router.navigate)
				.toHaveBeenCalledWith(['/solution/advisories/security'],
					{ queryParams: { page: 1, sort: ['severity:ASC'] } });
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
					{ queryParams: { page: 1, sort: ['severity:ASC'], severity: ['info'] } });
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
	});

	describe('Query Params: Security Advisory', () => {
		const queryParams = {
			lastUpdatedDateRange: 'gt-30-lt-60-days',
			severity: 'low',
		};

		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					AdvisoriesModule,
					HttpClientTestingModule,
					MicroMockModule,
					RouterTestingModule.withRoutes([
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/security',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/field-notices',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/bugs',
						},
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
			});
		});

		beforeEach(() => {
			productAlertsService = TestBed.get(ProductAlertsService);
			diagnosticsService = TestBed.get(DiagnosticsService);
			fixture = TestBed.createComponent(AdvisoriesComponent);
			component = fixture.componentInstance;
		});

		it('should set query params on page load for security advisories', fakeAsync(() => {
			buildSpies();
			fixture = TestBed.createComponent(AdvisoriesComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			tick(1000);
			const tab = _.find(component.tabs, { key: 'security' });
			expect(_.get(tab.params, 'lastUpdatedDateRange'))
				.toEqual(_.castArray('gt-30-lt-60-days'));
			expect(_.get(tab.params, 'severity'))
				.toEqual(_.castArray('low'));
		}));
	});

	describe('Query Params: Field Notice', () => {
		const queryParams = {
			lastUpdatedDateRange: 'gt-0-lt-30-days',
		};
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					AdvisoriesModule,
					HttpClientTestingModule,
					MicroMockModule,
					RouterTestingModule.withRoutes([
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/security',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/field-notices',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/bugs',
						},
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
			});
		});

		beforeEach(() => {
			productAlertsService = TestBed.get(ProductAlertsService);
			diagnosticsService = TestBed.get(DiagnosticsService);
			fixture = TestBed.createComponent(AdvisoriesComponent);
			component = fixture.componentInstance;
		});

		it('should set query params on page load for field notices', fakeAsync(() => {
			buildSpies();
			fixture = TestBed.createComponent(AdvisoriesComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			tick(1000);
			const tab = _.find(component.tabs, { key: 'field' });
			expect(_.get(tab.params, 'lastUpdatedDateRange'))
				.toEqual(_.castArray('gt-0-lt-30-days'));
		}));
	});

	describe('Query Params: Critical Bug', () => {
		const queryParams = {
			state: 'new',
		};
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					AdvisoriesModule,
					HttpClientTestingModule,
					MicroMockModule,
					RouterTestingModule.withRoutes([
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/security',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/field-notices',
						},
						{
							component: AdvisoriesComponent,
							path: 'solution/advisories/bugs',
						},
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
			});
		});

		beforeEach(() => {
			productAlertsService = TestBed.get(ProductAlertsService);
			diagnosticsService = TestBed.get(DiagnosticsService);
			fixture = TestBed.createComponent(AdvisoriesComponent);
			component = fixture.componentInstance;
		});

		it('should set query params on page load for critical bugs', fakeAsync(() => {
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
});
