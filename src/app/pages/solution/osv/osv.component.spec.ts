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
import { OSVService, SummaryResponse } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';

describe('OptimalSoftwareVersionComponent', () => {
	let component: OptimalSoftwareVersionComponent;
	let fixture: ComponentFixture<OptimalSoftwareVersionComponent>;

	let osvService: OSVService;
	beforeEach(async(() => {
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
		})
			.compileComponents();

		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		window.localStorage.clear();
		fixture = TestBed.createComponent(OptimalSoftwareVersionComponent);
		component = fixture.componentInstance;
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

		expect(_.find(component.filters, { key: 'totalAssets' }).seriesData.length)
			.toBe(0);
		expect(component.view)
			.toBeUndefined();
	});

	it('should switch active filters', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const totalFilter = _.find(component.filters, { key: 'totalAssets' });
				const assetType = _.find(component.filters, { key: 'assetType' });

				expect(_.find(component.filters, 'selected'))
					.toEqual(totalFilter);

				component.onSubfilterSelect('assets_without_profile', assetType);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(assetType);

				done();
			});
	});

	it('should select a assetType subfilter', done => {
		fixture.whenStable()
			.then(() => {
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

				done();
			});
	});

	it('should clear the filter when selecting the same subfilter twice', done => {
		fixture.whenStable()
			.then(() => {
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

				done();
			});
	});

	it('should clear the filters on clear button', done => {
		fixture.whenStable()
			.then(() => {
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

				done();
			});
	});

	it('should turn of loading indicator once we have result from getSummary', done => {
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of());
		expect(component.status.isLoading)
			.toBe(true);
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.status.isLoading)
					.toBe(false);
				done();
			});
	});

	it('seleceView should change the view ', () => {
		expect(component.view)
			.toEqual('swGroups');
		component.selectView('swVersions');
		expect(component.view)
			.toEqual('swVersions');
	});

	it('select softwareGroups view if the swProfile count is greater than zero', () => {
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of(<SummaryResponse> OSVScenarios[0].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.view)
			.toEqual('swGroups');
	});

	it('select assets view if the assets count is equal to zero', () => {
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of({
				asset_profile: {
					assets_profile: 444,
					assets_without_profile: 520,
				},
				assets: 964,
				deployment: {
					none: 963,
					upgrade: 400,
				},
				profiles: 0,
				versions: 50,
			}));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.view)
			.toEqual('assets');
	});

	it('select versions view if the versions count is equal to zero', () => {
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of({
				asset_profile: {
					assets_profile: 444,
					assets_without_profile: 520,
				},
				assets: 0,
				deployment: {
					none: 963,
					upgrade: 400,
				},
				profiles: 0,
				versions: 50,
			}));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.view)
			.toEqual('swVersions');
	});

	it('select show no data if all counts are zero', () => {
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(of({
				asset_profile: {
					assets_profile: 444,
					assets_without_profile: 520,
				},
				assets: 0,
				deployment: {
					none: 963,
					upgrade: 400,
				},
				profiles: 0,
				versions: 0,
			}));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.view)
			.toBeUndefined();
	});
});
