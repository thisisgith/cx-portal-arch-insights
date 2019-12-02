import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsDetailsComponent } from './bugs-details.component';
import { configureTestSuite } from 'ng-bullet';
import { BugsDetailsModule } from './bugs-details.module';
import { OSVScenarios } from '@mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import * as _ from 'lodash-es';

describe('BugsDetailsComponent', () => {
	let component: BugsDetailsComponent;
	let fixture: ComponentFixture<BugsDetailsComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				BugsDetailsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BugsDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should return the current tab info', () => {
		const sgRecommendations = <any> OSVScenarios[9].scenarios.GET[0].response.body;
		component.data = sgRecommendations.recommendationSummaries;
		component.params = { viewType: 'bug' };
		component.ngOnInit();
		fixture.detectChanges();
		component.tabIndex = 0;
		expect(component.getCurrentTabData())
			.toBeDefined();
		component.tabIndex = 1;
		expect(component.getCurrentTabData())
			.toBeDefined();
		component.tabIndex = 2;
		expect(component.getCurrentTabData())
			.toBeDefined();
		component.tabIndex = 3;
		expect(component.getCurrentTabData())
			.toBeDefined();
	});

	it('should switch active filters for bugs', () => {
		const sgRecommendations = <any> OSVScenarios[9].scenarios.GET[0].response.body;
		component.data = sgRecommendations.recommendationSummaries;
		component.params = { viewType: 'bug' };
		component.ngOnInit();
		fixture.detectChanges();
		component.tabIndex = 0;
		const currentTabData = component.getCurrentTabData();
		fixture.detectChanges();
		const totalFilter = _.find(currentTabData.filters, { key: 'total' });
		const stateFilter = _.find(currentTabData.filters, { key: 'state' });
		const severityFilter = _.find(currentTabData.filters, { key: 'severity' });

		expect(_.find(currentTabData.filters, 'selected'))
			.toEqual(totalFilter);

		component.onSubfilterSelect('Fixed', stateFilter);

		fixture.detectChanges();

		expect(_.filter(currentTabData.filters, 'selected'))
			.toContain(stateFilter);
		expect(currentTabData.appliedFilters.state)
			.toContain('Fixed');

		component.onSubfilterSelect('High', severityFilter);
		fixture.detectChanges();

		expect(_.filter(currentTabData.filters, 'selected'))
			.toContain(severityFilter);
		expect(currentTabData.appliedFilters.severity)
			.toEqual(['High']);

		component.onSubfilterSelect('High', severityFilter);
		expect(currentTabData.appliedFilters.state)
			.toContain('Fixed');
		expect(currentTabData.appliedFilters.severity)
			.toEqual([]);

		component.clearFilters();
		expect(currentTabData.appliedFilters.state)
			.toEqual([]);
		expect(currentTabData.appliedFilters.severity)
			.toEqual([]);

		component.onSearchQuery('velit');
		fixture.detectChanges();

		expect(currentTabData.data.bugs.length)
			.toEqual(1);
	});

	it('should create table based on view type', () => {
		const sgRecommendations = <any> OSVScenarios[9].scenarios.GET[0].response.body;
		component.data = sgRecommendations.recommendationSummaries;
		component.params = { viewType: 'bug' };
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.bugsTable)
			.toBeDefined();
		component.params = { viewType: 'psirt' };
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.psirtsTable)
			.toBeDefined();
	});

});
