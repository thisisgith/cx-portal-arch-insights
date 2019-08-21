import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogsComponent } from './syslogs.component';
import { SyslogsModule } from './syslogs.module';
import { SyslogsService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { user } from '@mock';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
describe('SyslogsComponent', () => {
	let component: SyslogsComponent;
	let fixture: ComponentFixture<SyslogsComponent>;
	let syslogsService: SyslogsService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogsModule,
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

		syslogsService = TestBed.get(SyslogsService);
	}));

	beforeEach(() => {
		window.localStorage.clear();
		fixture = TestBed.createComponent(SyslogsComponent);
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
		spyOn(syslogsService, 'getSyslogsCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();

				expect(component.visualLabels[0].count)
				.toBe(null);
				expect(component.visualLabels[1].count)
				.toBe(null);
				done();
			});
	});
	it('Should get the syslog message count data', done => {
		spyOn(syslogsService, 'getSyslogsCount')
		.and
		.returnValue(of(SyslogScenarios[0].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.visualLabels[0].count)
				.toBe('10');
			expect(component.visualLabels[1].count)
				.toBe('5');
			done();
		});
	});

	// tslint:disable-next-line: ter-prefer-arrow-callback
	it('should clear the filters on clear button', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const timeRangeFilter = _.find(component.filters,
					{ key: 'timeRange' });
				component.onSubfilterSelect('30', timeRangeFilter, true);
				const severityFilter = _.find(component.filters,
					{ key: 'severity' });
				component.onSubfilterSelect('1', severityFilter, true);
				const catalogFilter = _.find(component.filters,
					{ key: 'catalog' });
				component.onSubfilterSelect('others', catalogFilter, true);
				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(timeRangeFilter);
				expect(_.filter(component.filters, 'selected'))
					.toContain(severityFilter);
				expect(_.filter(component.filters, 'selected'))
					.toContain(catalogFilter);
				const subfilter = _.find(timeRangeFilter.seriesData, { filter: '30' });
				const subfilterSeverity = _.find(severityFilter.seriesData, { filter: '1' });
				const subfilterCatalog = _.find(catalogFilter.seriesData, { filter: 'others' });
				expect(subfilter.selected)
					.toBeTruthy();
				expect(subfilterSeverity.selected)
					.toBeTruthy();
				expect(subfilterCatalog.selected)
					.toBeTruthy();
				component.clearFilters();
				fixture.detectChanges();

				expect(subfilter.selected)
					.toBeFalsy();
				expect(subfilterSeverity.selected)
					.toBeFalsy();
				expect(subfilterCatalog.selected)
					.toBeFalsy();
				done();
			});
	});
	it('should SyslogMessage tab active', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const index = 0;
				component.selectVisualLabel(index);
				expect(component.visualLabels[0].active)
					.toBeTruthy();
				done();
			});
	});
	it('should AssetTab tab active', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const index = 1;
				component.selectVisualLabel(index);
				expect(component.visualLabels[1].active)
					.toBeTruthy();
				done();
			});
	});
});
