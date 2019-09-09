import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureComponent } from './architecture.component';
import { ArchitectureModule } from './architecture.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of } from 'rxjs';
import { VisualFilter } from '@interfaces';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';

describe('ArchitectureComponent', () => {
	let component: ArchitectureComponent;
	let fixture: ComponentFixture<ArchitectureComponent>;
	let service: ArchitectureService;
	const mockVisualFilter: VisualFilter = Object.create({ });

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ArchitectureModule,
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

		service = TestBed.get(ArchitectureService);
	}));

	beforeEach(() => {
		spyOn(service, 'getExceptionsCount')
			.and
			.returnValue(of({ CBPRulesCount: 5000 }));
		spyOn(service, 'getAssetsExceptionsCount')
			.and
			.returnValue(of({ AssetsExceptionCount: 5000 }));
		fixture = TestBed.createComponent(ArchitectureComponent);
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
});
