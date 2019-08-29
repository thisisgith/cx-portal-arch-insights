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
		spyOn(service, 'getExceptionsCount')
			.and
			.returnValue(of({ CBPRulesCount: 5000 }));
		spyOn(service, 'getAssetsExceptionsCount')
			.and
			.returnValue(of({ AssetsExceptionCount: 5000 }));
		fixture = TestBed.createComponent(ArchitectureReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call exceptions count on init', () => {
		expect(service.getExceptionsCount)
			.toHaveBeenCalled();
	});

	it('should call assets exceptions count on init', () => {
		expect(service.getAssetsExceptionsCount)
			.toHaveBeenCalled();
	});

	it('should call clear filters', () => {
		component.clearFilters();
		expect(component.filtered)
		.toBeFalsy();
	});

	it('should call selectVisualLabel', () => {
		const visualLabels = { label: 'Configuration Best Practices', active: false, count: null };

		component.selectVisualLabel(visualLabels);
		expect(visualLabels.active)
		.toBeTruthy();
	});

	it('should call onsubfilterselect', () => {
		mockVisualFilter.seriesData = [{
			filter: '',
			label: '',
			selected: false,
			value: 123,
		},
		];
		component.onSubfilterSelect('high', mockVisualFilter);
	});

	xit('should clear the filter when selecting the same subfilter twice', done => {
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

				done();
			});
	});
});
