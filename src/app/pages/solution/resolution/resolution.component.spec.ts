import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CaseService } from '@cui-x/services';
import { Router } from '@angular/router';

import { ResolutionComponent } from './resolution.component';
import { ResolutionModule } from './resolution.module';
import { CaseScenarios } from '@mock';

import * as _ from 'lodash-es';

describe('ResolutionComponent', () => {
	let service: CaseService;
	let component: ResolutionComponent;
	let fixture: ComponentFixture<ResolutionComponent>;
	let router: Router;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ResolutionModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		service = TestBed.get(CaseService);
		spyOn(service, 'read')
			.and
			.returnValue(of(CaseScenarios[4].scenarios.GET[0].response.body));
		fixture = TestBed.createComponent(ResolutionComponent);
		component = fixture.componentInstance;
		router = TestBed.get(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call case list on init', () => {
		expect(service.read)
			.toHaveBeenCalled();
	});

	it('should refresh on sort', () => {
		spyOn(component, 'getCaseList')
			.and
			.callThrough();
		component.onTableSortingChanged({
			key: 'Key1',
			value: 'Value1',
		});
		expect(component.getCaseList)
			.toHaveBeenCalledTimes(1);
	});

	it('should refresh on page change', () => {
		spyOn(component, 'getCaseList')
			.and
			.callThrough();
		component.onPagerUpdated({ page: 2 });
		expect(component.getCaseList)
			.toHaveBeenCalled();
	});

	it('should show invalid input on bad casenum', () => {
		const input = fixture.debugElement.query(By.css('#input-type-search'));
		const form = fixture.debugElement.query(By.css('form'));
		const el = input.nativeElement;
		el.value = 'abc';
		el.dispatchEvent(new Event('input'));
		form.nativeElement
			.dispatchEvent(new Event('submit'));
		fixture.detectChanges();
		expect(component.isSearchCaseFormInvalid)
			.toBeTruthy();
	});

	it('should submit valid casenum search', () => {
		const input = fixture.debugElement.query(By.css('input'));
		const form = fixture.debugElement.query(By.css('form'));
		const el = input.nativeElement;
		el.value = '900000000';
		el.dispatchEvent(new Event('input'));
		form.nativeElement
			.dispatchEvent(new Event('submit'));
		fixture.detectChanges();
		expect(component.isSearchCaseFormInvalid)
			.toBeFalsy();
	});

	it('should give the correct severity color', () => {
		expect(component.getSeverityColor('1'))
			.toEqual('danger');
		expect(component.getSeverityColor('2'))
			.toEqual('warning');
		expect(component.getSeverityColor('3'))
			.toEqual('warning-alt');
		expect(component.getSeverityColor('4'))
			.toEqual('info');
		expect(component.getSeverityColor('42'))
			.toEqual(undefined);
	});

	it('should give the correct severity description', () => {
		expect(component.getSeverityDescr('1'))
			.toEqual('Network Down');
		expect(component.getSeverityDescr('2'))
			.toEqual('Severely Degraded');
		expect(component.getSeverityDescr('3'))
			.toEqual('Network Impaired');
		expect(component.getSeverityDescr('4'))
			.toEqual('Ask a Question');
		expect(component.getSeverityDescr('42'))
			.toEqual(undefined);
	});

	it('should use the case and serial queryparams', fakeAsync(() => {
		router.navigate(
			[],
			{
				queryParams: { case: '688296392', serial: 'FOX1306GBAD' },
				relativeTo: component.route,
			},
		);
		tick();
		fixture.detectChanges();
		expect(component.selectedCase)
			.toEqual({
				caseNumber: '688296392',
			});
		expect(component.caseParams.serialNumbers)
			.toEqual('FOX1306GBAD');
	}));

	it('should close the case details 360', () => {
		component.detailsClose();
		expect(component.selectedCase)
			.toBeNull();
		expect(component.selectedDetails)
			.toBeNull();
	});

	it('should select and deselect a case', fakeAsync(() => {
		const rowCase = (<any> CaseScenarios[4].scenarios.GET[0].response.body).content[0];
		component.onTableRowClicked(rowCase);
		tick();
		fixture.detectChanges();
		expect(component.selectedCase)
			.toBe(rowCase);
		component.onTableRowClicked(rowCase);
		tick();
		fixture.detectChanges();
		expect(component.selectedCase)
			.toBeNull();
	}));

	it('should switch active filters', fakeAsync(() => {
		const totalFilter = _.find(component.filters, { key: 'total' });
		const statusFilter = _.find(component.filters, { key: 'status' });

		expect(component.selectedFilters)
			.toContain(totalFilter);

		component.onSubfilterSelect('Customer Updated', statusFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(statusFilter);
	}));

	it('should select status subfilters', fakeAsync(() => {
		const statusFilter = _.find(component.filters, { key: 'status' });
		component.onSubfilterSelect('Customer Updated', statusFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(statusFilter);

		let subfilter = _.find(statusFilter.seriesData, { filter: 'Customer Updated' });

		expect(subfilter.selected)
			.toBeTruthy();

		const ciscoFilter = _.find(component.filters, { key: 'status' });
		component.onSubfilterSelect('Cisco Pending', ciscoFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(ciscoFilter);

		subfilter = _.find(ciscoFilter.seriesData, { filter: 'Cisco Pending' });

		expect(subfilter.selected)
			.toBeTruthy();
	}));

	it('should clear the filter when selecting the same subfilter twice', fakeAsync(() => {
		const statusFilter = _.find(component.filters, { key: 'status' });
		component.onSubfilterSelect('Customer Updated', statusFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(statusFilter);

		let subfilter = _.find(statusFilter.seriesData, { filter: 'Customer Updated' });

		expect(subfilter.selected)
			.toBeTruthy();

		component.onSubfilterSelect('Customer Updated', statusFilter);

		tick();
		fixture.detectChanges();

		subfilter = _.find(statusFilter.seriesData, { filter: 'Customer Updated' });

		expect(subfilter.selected)
			.toBeFalsy();
	}));

	it('should select the lastUpdated filter properly', fakeAsync(() => {
		const lastUpdatedFilter = _.find(component.filters, { key: 'lastUpdated' });
		component.onSubfilterSelect('≤24 hr', lastUpdatedFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(lastUpdatedFilter);

		component.onSubfilterSelect('>1 day', lastUpdatedFilter);

		tick();
		fixture.detectChanges();

		expect(_.get(_.find(lastUpdatedFilter.seriesData, { label: '>1 day' }), 'selected'))
			.toBeTruthy();

		expect(_.get(_.find(lastUpdatedFilter.seriesData, { label: '≤24 hr' }), 'selected'))
			.toBeFalsy();
	}));

	it('should select the durationOpen filter properly', fakeAsync(() => {
		const durationOpen = _.find(component.filters, { key: 'durationOpen' });
		component.onSubfilterSelect('≤24 hr', durationOpen);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(durationOpen);

		component.onSubfilterSelect('>1 day', durationOpen);

		tick();
		fixture.detectChanges();

		expect(_.get(_.find(durationOpen.seriesData, { label: '>1 day' }), 'selected'))
			.toBeTruthy();

		expect(_.get(_.find(durationOpen.seriesData, { label: '≤24 hr' }), 'selected'))
			.toBeFalsy();
	}));

	it('should select the RMAs filter properly', fakeAsync(() => {
		const rmaFilter = _.find(component.filters, { key: 'rma' });
		component.onSubfilterSelect('No RMAs', rmaFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(rmaFilter);

		component.onSubfilterSelect('With RMAs', rmaFilter);

		tick();
		fixture.detectChanges();

		expect(_.get(_.find(rmaFilter.seriesData, { filter: 'T' }), 'selected'))
			.toBeTruthy();

		expect(_.get(_.find(rmaFilter.seriesData, { filter: 'F' }), 'selected'))
			.toBeFalsy();
	}));

	it('should clear all status subfilters', fakeAsync(() => {
		const statusFilter = _.find(component.filters, { key: 'status' });
		component.onSubfilterSelect('Customer Updated', statusFilter);

		tick();
		fixture.detectChanges();

		expect(component.selectedFilters)
			.toContain(statusFilter);

		const ciscoFilter = _.find(component.filters, { key: 'status' });
		component.onSubfilterSelect('Cisco Pending', ciscoFilter);

		tick();
		fixture.detectChanges();

		const severityFilter = _.find(component.filters, { key: 'severity' });
		component.onSubfilterSelect('S1', severityFilter);

		tick();
		fixture.detectChanges();

		component.clearFilters();
		const totalFilter = _.find(component.filters, { key: 'total' });
		expect(component.selectedFilters)
			.toContain(totalFilter);
	}));

});
