import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed, flush } from '@angular/core/testing';
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
import { AssetPanelLinkService, CaseDetailsService } from '@services';
import { UserResolve } from '@utilities';

describe('ResolutionComponent', () => {
	let service: CaseService;
	let component: ResolutionComponent;
	let fixture: ComponentFixture<ResolutionComponent>;
	let router: Router;
	let assetService: AssetPanelLinkService;
	let userResolve: UserResolve;
	let caseDetailsService: CaseDetailsService;

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
		assetService = TestBed.get(AssetPanelLinkService);
		userResolve = TestBed.get(UserResolve);
		caseDetailsService = TestBed.get(CaseDetailsService);
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

	it('should create', () => {
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('104959_0'));
		const comp_dummy = TestBed.createComponent(ResolutionComponent);
		const comp_dummy_instance = comp_dummy.componentInstance;
		comp_dummy.detectChanges();
		expect(comp_dummy_instance.customerId)
			.toBe('104959_0');
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
			.toBeTruthy();
		expect(component.getSeverityDescr('2'))
			.toBeTruthy();
		expect(component.getSeverityDescr('3'))
			.toBeTruthy();
		expect(component.getSeverityDescr('4'))
			.toBeTruthy();
		expect(component.getSeverityDescr('42'))
		 	.toEqual('');
	});

	it('should use the case and serial queryparams', fakeAsync(() => {
		router.navigate(
			[],
			{
				queryParams: { case: '688296392', serial: 'FOX1306GBAD', deviceName: 'LA1-AP4800-1',  serialNumber: 'FOX1306GBAD' },
				relativeTo: component.route,
			},
		);
		tick();
		fixture.detectChanges();
		expect(component.selectedCase)
			.toEqual({
				caseNumber: '688296392',
				deviceName: 'LA1-AP4800-1',
				serialNumber: 'FOX1306GBAD',
			});
		expect(component.caseParams.serialNumbers)
			.toEqual('FOX1306GBAD');

		flush();
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

		flush();
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

		flush();
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

		flush();
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

		flush();
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

		flush();
	}));

	it('should open asset view upon click on the asset label', () => {
		const params = {
			customerId: '2431199',
			serialNumber: ['FCH2139V1B0'],
		};
		spyOn(assetService, 'getAssetLinkData')
			.and
			.returnValue(of({ }));
		component.showAssetDetails(params);
		expect(assetService.getAssetLinkData)
			.toHaveBeenCalled();
	});
	it('should call getCaseDetailsInfo', () => {
		const params = {
			page: 5,
			search: 'FCH2139V1B0',
		};
		spyOn(component, 'getCaseDetailsInfo').and
		.callThrough();
		component.getCaseDetailsInfo(params);
		expect(component.getCaseDetailsInfo)
			.toHaveBeenCalled();
	});

	it('should reinitialize filters when caseCount emits true', () => {
		spyOn(component, 'initializeFilterVariables');
		caseDetailsService.refreshCaseCount(true);
		caseDetailsService.caseCount$.subscribe(() => {
			expect(component.initializeFilterVariables)
				.toHaveBeenCalled();
		});
	});

	it('should call searchCaseNumber on clearsearch', () => {
		spyOn(component, 'searchCaseNumber');
		component.clearSearch();
		fixture.detectChanges();
		expect(component.searchCasesForm.value.caseNo)
			.toBe('');
		expect(component.searchCaseNumber)
			.toHaveBeenCalledTimes(1);
	});
});
