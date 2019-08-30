import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

	beforeEach(async(() => {
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
		})
			.compileComponents();

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

	it('customerId should be present', () => {
		expect(component.customerId)
			.toBeDefined();
		expect(component.filtered)
			.toBeDefined();
		expect(component.selectedFilter)
			.toBeDefined();
		expect(component.status)
			.toBeDefined();
		expect(component.filters)
			.toBeDefined();
		const advisoryFilter = _.find(component.filters, { key: 'exceptions' });
		expect(advisoryFilter)
			.toBeDefined();
	});

	it('should call clear filters', () => {
		component.clearFilters();
		expect(component.filtered)
			.toBeFalsy();
	});

	it('should call selectVisualLabel', () => {
		const visualLabel = { label: 'DNAC', active: false, count: null };

		component.visualLabels =
		[{
			active: false,
			count: null,
			key: 'devices',
			label: 'Devices',
		},
		{ label: 'DNAC', active: true, count: null, key: 'dnac' }];
		component.selectVisualLabel(visualLabel);
		expect(component.visualLabels[0].active)
			.toBeFalsy();
	});

	it('should call onsubfilterselect', () => {
		mockVisualFilter.seriesData = [{
			filter: 'high',
			label: '',
			selected: false,
			value: 123,
		},
		];
		mockVisualFilter.key = 'exception';
		component.onSubfilterSelect('high', mockVisualFilter);
		expect(mockVisualFilter.seriesData[0].selected)
			.toBeTruthy();
	});

	it('should call selected filter onsubfilterselect', () => {
		mockVisualFilter.seriesData = [{
			filter: '',
			label: '',
			selected: false,
			value: 123,
		},
		];
		mockVisualFilter.key = 'exceptions';
		component.onSubfilterSelect('high', mockVisualFilter);
		expect(mockVisualFilter.seriesData[0].selected)
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
		spyOn(component, 'loadData');
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

	it('should load the data', () => {
		spyOn(service, 'getSDAReadinessCountResponse')
			.and
			.returnValue(of(ArchitectureReviewScenarios[0]
				.scenarios.GET[0].response.body.TotalCounts));

		component.loadData();
		expect(service.getSDAReadinessCountResponse)
			.toHaveBeenCalled();
	});

	it('should call getDevicesCount on init', () => {
		spyOn(service, 'getDevicesCountResponse')
			.and
			.returnValue(of(ArchitectureReviewScenarios[0]
				.scenarios.GET[0].response.body.TotalCounts));

		spyOn(service, 'getDnacCountResponse')
			.and
			.returnValue(of(ArchitectureReviewScenarios[0]
				.scenarios.GET[0].response.body.TotalCounts));

		component.ngOnInit();
		expect(service.getDevicesCountResponse)
			.toHaveBeenCalled();
		expect(service.getDnacCountResponse)
			.toHaveBeenCalled();
	});

	it('should throw errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getSDAReadinessCountResponse')
			.and
			.returnValue(
				throwError(new HttpErrorResponse(error)),
			);
		component.loadData();
		expect(component.getDevicesCount)
			.toThrowError();
	});
});
