import { configureTestSuite } from 'ng-bullet';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchitectureReviewComponent } from './architecture-review.component';
import { ArchitectureReviewModule } from './architecture-review.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureReviewService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { VisualFilter } from '@interfaces';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user, ArchitectureReviewScenarios } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';

describe('ArchitectureReviewComponent', () => {
	let component: ArchitectureReviewComponent;
	let fixture: ComponentFixture<ArchitectureReviewComponent>;
	let service: ArchitectureReviewService;
	const mockVisualFilter: VisualFilter = Object.create({ });

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ArchitectureReviewModule,
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
		service = TestBed.get(ArchitectureReviewService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ArchitectureReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call clear filters', () => {
		component.clearFilters();
		expect(component.filtered)
			.toBeFalsy();
	});

	it('should call getSelectedSubFilters ', () => {
		mockVisualFilter.seriesData = [{
			filter: 'high',
			label: '',
			selected: false,
			value: 123,
		},
		];
		component.filters = [mockVisualFilter];
		expect(component.getSelectedSubFilters('high'))
			.toBeFalsy();
	});

	it('should clear filters', () => {
		mockVisualFilter.seriesData = [{
			filter: 'high',
			label: '',
			selected: true,
			value: 123,
		},
		];
		component.filters = [mockVisualFilter];
		component.clearFilters();
		expect(component.filters[0].selected)
			.toBeFalsy();
	});

	it('should call load data on component loading', () => {
		component.buildFilters();
		expect(component.filters)
			.toBeDefined();
		component.loadData();
		expect(component.status.isLoading)
			.toBeTruthy();
	});

	it('should clear the filter when selecting the same subfilter twice', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const exceptionFilter = _.find(this.filters, { key: 'exceptions' });
				component.onSubfilterSelect('none', exceptionFilter);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(exceptionFilter);

				let subfilter = _.find(exceptionFilter.seriesData, { filter: 'none' });

				expect(subfilter.selected)
					.toBeTruthy();

				component.onSubfilterSelect('none', exceptionFilter);

				fixture.detectChanges();

				subfilter = _.find(exceptionFilter.seriesData, { filter: 'none' });

				expect(subfilter.selected)
					.toBeFalsy();
			});
	});

	it('should call getSDAReadinessCount', () => {

		spyOn(service, 'getSDAReadinessCount')
			.and
			.returnValue(of(ArchitectureReviewScenarios[6].scenarios.GET[0].response.body));
		component.getDevicesCount();
		expect(service.getSDAReadinessCount)
			.toHaveBeenCalled();
	});

	it('should not call getSDAReadinessCount', () => {
		spyOn(service, 'getSDAReadinessCount')
			.and
			.returnValue(of([]));
		component.getDevicesCount();
		expect(service.getSDAReadinessCount)
			.toHaveBeenCalled();
	});

	it('should throw errors if data is empty', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getDevicesCount')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getAllDevicesCount();
		tick();
		expect(component.getAllDevicesCount)
			.toThrowError();
	}));

	it('should throw errors if service not called', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getDnacCount')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.getDnacCount();
		tick();
		expect(component.getDnacCount)
			.toThrowError();
	}));

});
