import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimalSoftwareVersionComponent } from './osv.component';
import { OptimalSoftwareVersionModule } from './osv.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user } from '@mock';
import { OSVService } from '@sdp-api';
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

	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(osvService, 'getSummary')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();

				expect(_.find(component.filters, { key: 'totalAssets' }).data.length)
					.toBe(0);
				done();
			});
	});

	it('should switch active filters', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const totalFilter = _.find(component.filters, { key: 'totalAssets' });
				const deploymentStatus = _.find(component.filters, { key: 'deploymentStatus' });

				expect(_.find(component.filters, 'selected'))
					.toEqual(totalFilter);

				component.onSubfilterSelect('none', deploymentStatus);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(deploymentStatus);

				done();
			});
	});

	it('should select a deploymentStatus subfilter', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const deploymentStatusFilter = _.find(component.filters,
					{ key: 'deploymentStatus' });
				component.onSubfilterSelect('none', deploymentStatusFilter);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(deploymentStatusFilter);

				const subfilter = _.find(deploymentStatusFilter.data, { filter: 'none' });

				expect(subfilter.selected)
					.toBeTruthy();

				done();
			});
	});

	it('should clear the filter when selecting the same subfilter twice', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const deploymentStatusFilter = _.find(component.filters,
					{ key: 'deploymentStatus' });
				component.onSubfilterSelect('none', deploymentStatusFilter);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(deploymentStatusFilter);

				let subfilter = _.find(deploymentStatusFilter.data, { filter: 'none' });

				expect(subfilter.selected)
					.toBeTruthy();

				component.onSubfilterSelect('none', deploymentStatusFilter);

				fixture.detectChanges();

				subfilter = _.find(deploymentStatusFilter.data, { filter: 'none' });

				expect(subfilter.selected)
					.toBeFalsy();

				done();
			});
	});

	it('should clear the filters on clear button', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const deploymentStatusFilter = _.find(component.filters,
					{ key: 'deploymentStatus' });
				component.onSubfilterSelect('none', deploymentStatusFilter);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(deploymentStatusFilter);

				const subfilter = _.find(deploymentStatusFilter.data, { filter: 'none' });

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
			.toEqual('assets');
		component.selectView('swVersions');
		expect(component.view)
			.toEqual('swVersions');
	});

	it('should showUp the sw profile info dialog if not found in localstorage', () => {
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.hideProfileInfo)
			.toBe(false);
		expect(component.showProfileInfo)
			.toBe(true);
		window.localStorage.setItem('hideProfileInfo', 'true');
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.hideProfileInfo)
			.toBe(true);
		expect(component.showProfileInfo)
			.toBe(false);
	});
});
