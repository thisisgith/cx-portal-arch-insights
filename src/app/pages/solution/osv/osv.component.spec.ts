import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimalSoftwareVersionComponent } from './osv.component';
import { OptimalSoftwareVersionModule } from './osv.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user, OSVScenarios } from '@mock';
import { OSVService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';

describe('OptimalSoftwareVersionComponent', () => {
	let component: OptimalSoftwareVersionComponent;
	let fixture: ComponentFixture<OptimalSoftwareVersionComponent>;

	let osvService: OSVService;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				OptimalSoftwareVersionModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
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
						},
					},
				},
			],
		});
	});

	beforeEach(async(() => {

		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		window.localStorage.clear();
		fixture = TestBed.createComponent(OptimalSoftwareVersionComponent);
		component = fixture.componentInstance;
		component.summaryParams.solution = 'ibn';
		component.summaryParams.useCase = 'Campus Network Assurance';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();

		fixture.detectChanges();

		expect(_.find(component.filters))
			.toBeUndefined();
		expect(component.view)
			.toEqual('swGroups');
	});

	it('should switch active filters', () => {
		const summaryResponse = <any> OSVScenarios[0].scenarios.GET[0].response.body;
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of(summaryResponse));
		component.ngOnInit();
		component.selectView('assets');
		fixture.detectChanges();
		const assetType = _.find(component.filters, { key: 'assetType' });

		component.onSubfilterSelect('assets_without_profile', assetType);

		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(assetType);

	});

	it('should select a assetType subfilter', () => {
		const summaryResponse = <any> OSVScenarios[0].scenarios.GET[0].response.body;
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of(summaryResponse));
		component.ngOnInit();
		component.selectView('assets');
		fixture.detectChanges();
		const assetTypeFilter = _.find(component.filters,
			{ key: 'assetType' });
		component.onSubfilterSelect('assets_without_profile', assetTypeFilter);

		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(assetTypeFilter);

		const subfilter = _.find(assetTypeFilter.seriesData,
			{ filter: 'assets_without_profile' });

		expect(subfilter.selected)
			.toBeTruthy();

	});

	it('should clear the filter when selecting the same subfilter twice', () => {
		const summaryResponse = <any> OSVScenarios[0].scenarios.GET[0].response.body;
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of(summaryResponse));
		component.ngOnInit();
		component.selectView('assets');
		fixture.detectChanges();
		const assetTypeFilter = _.find(component.filters,
			{ key: 'assetType' });
		component.onSubfilterSelect('assets_without_profile', assetTypeFilter);

		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(assetTypeFilter);

		let subfilter = _.find(assetTypeFilter.seriesData,
			{ filter: 'assets_without_profile' });

		expect(subfilter.selected)
			.toBeTruthy();

		component.onSubfilterSelect('assets_without_profile', assetTypeFilter);

		fixture.detectChanges();

		subfilter = _.find(assetTypeFilter.seriesData,
			{ filter: 'assets_without_profile' });

		expect(subfilter.selected)
			.toBeFalsy();

	});

	it('should clear the filters on clear button', () => {
		const summaryResponse = <any> OSVScenarios[0].scenarios.GET[0].response.body;
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of(summaryResponse));
		component.ngOnInit();
		component.selectView('assets');
		fixture.detectChanges();
		const assetTypeFilter = _.find(component.filters,
			{ key: 'assetType' });
		component.onSubfilterSelect('assets_without_profile', assetTypeFilter);

		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(assetTypeFilter);

		const subfilter = _.find(assetTypeFilter.seriesData,
			{ filter: 'assets_without_profile' });

		expect(subfilter.selected)
			.toBeTruthy();

		component.clearFilters();
		fixture.detectChanges();

		expect(subfilter.selected)
			.toBeFalsy();
	});

	it('selectView should change the view ', () => {
		component.selectView('swGroups');
		expect(component.view)
			.toEqual('swGroups');
		component.selectView('swVersions');
		expect(component.view)
			.toEqual('swVersions');
	});
});
