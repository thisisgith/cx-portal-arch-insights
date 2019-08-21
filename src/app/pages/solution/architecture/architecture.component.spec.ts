import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureComponent } from './architecture.component';
import { ArchitectureModule } from './architecture.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of } from 'rxjs';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArchitectureComponent', () => {
	let component: ArchitectureComponent;
	let fixture: ComponentFixture<ArchitectureComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ArchitectureModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
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
	});

	it('should call assets exceptions count on init', () => {
		expect(service.getAssetsExceptionsCount)
			.toHaveBeenCalled();
	});

	it('should clear the filters on clear button', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const exceptionFilter = _.find(this.filters, { key: 'exceptions' });
				component.onSubfilterSelect('none', exceptionFilter);

				fixture.detectChanges();

				expect(_.filter(component.filters, 'selected'))
					.toContain(exceptionFilter);

				const subfilter = _.find(exceptionFilter.seriesData,
					 { filter: 'High' || 'Medium' || 'Low' });

				expect(subfilter.selected)
					.toBeTruthy();

				component.clearFilters();
				fixture.detectChanges();

				expect(subfilter.selected)
					.toBeFalsy();

				done();
			});
	});

	it('should clear the filter when selecting the same subfilter twice', done => {
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
