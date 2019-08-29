import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureReviewComponent } from './architecture-review.component';
import { ArchitectureReviewModule } from './architecture-review.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureReviewService } from '@sdp-api';
import { of } from 'rxjs';
import { VisualFilter } from '@interfaces';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';

fdescribe('ArchitectureReviewComponent', () => {
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
		spyOn(service, 'getDevicesCount')
			.and
			.returnValue(of({ TotalCounts: 50 }));
		spyOn(service, 'getDnacCount')
			.and
			.returnValue(of({ TotalCounts: 50 }));
		fixture = TestBed.createComponent(ArchitectureReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call Devices count on init', () => {
		expect(component.status.isLoading)
		.toBeTruthy();
		expect(service.getDevicesCount)
			.toHaveBeenCalled();
	});

	it('should call Devices count on init', () => {
		expect(component.status.isLoading)
		.toBeTruthy();
		expect(service.getDevicesCount)
			.toHaveBeenCalled();
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
		const visualLabels = { label: 'Configuration Best Practices', active: true, count: null };
		component.visualLabels =
		 [{ label: 'Configuration Best Practices', active: true, count: null }];
		component.selectVisualLabel(visualLabels);
		expect(component.visualLabels[0].active)
		.toBeFalsy();
		fixture.detectChanges();
		const dummyLabel = { label: 'Configuration Best', active: false };
		component.selectVisualLabel(dummyLabel);
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
		fixture.detectChanges();
		component.onSubfilterSelect('low', mockVisualFilter);
		expect(mockVisualFilter.seriesData[0].selected)
		.toBeFalsy();
	});

	it('should call getSelectedSubFilters ', () => {
		component.filters = [mockVisualFilter];
		component.getSelectedSubFilters('high');
	});

	it('should clear filters', () => {
		component.filters = [];
		component.clearFilters();
		expect(component.selectedFilter)
		.toEqual({ severity: '' });
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
});
