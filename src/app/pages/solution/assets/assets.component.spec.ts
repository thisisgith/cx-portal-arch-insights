import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';

describe('AssetsComponent', () => {
	let component: AssetsComponent;
	let fixture: ComponentFixture<AssetsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				HttpClientModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should switch active filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const totalFilter = _.find(component.filters, { key: 'total' });
			const coverageFilter = _.find(component.filters, { key: 'coverage' });

			expect(_.find(component.filters, 'selected'))
				.toEqual(totalFilter);

			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select a coverage subfilter', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const coverageFilter = _.find(component.filters, { key: 'coverage' });
			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			const subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeTruthy();

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should clear the filter when selecting the same subfilter twice', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			const coverageFilter = _.find(component.filters, { key: 'coverage' });
			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			expect(_.filter(component.filters, 'selected'))
				.toContain(coverageFilter);

			let subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeTruthy();

			component.onSubfilterSelect('covered', coverageFilter);

			fixture.detectChanges();

			subfilter = _.find(coverageFilter.seriesData, { filter: 'covered' });

			expect(subfilter.selected)
				.toBeFalsy();

			done();
		});
	});

	it('should set a loading boolean for Cypress runs', done => {
		expect(window.loading)
			.toBeUndefined();
		window.Cypress = true;

		component.ngOnInit();
		expect(window.loading)
			.toBe(true);

		component.ngOnInit();

		fixture.whenStable()
		.then(() => {
			expect(window.loading)
				.toBe(false);

				// cleanup
			window.Cypress = undefined;
			window.loading = undefined;

			done();
		});
	});
});
