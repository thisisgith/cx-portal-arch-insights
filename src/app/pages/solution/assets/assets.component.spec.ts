import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import { InventoryService, ProductAlertsService, ContractsService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';

describe('AssetsComponent', () => {
	let component: AssetsComponent;
	let fixture: ComponentFixture<AssetsComponent>;

	let inventoryService: InventoryService;
	let productAlertsService: ProductAlertsService;
	let contractsService: ContractsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
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

		inventoryService = TestBed.get(InventoryService);
		productAlertsService = TestBed.get(ProductAlertsService);
		contractsService = TestBed.get(ContractsService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
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
	it('should set null values on request errors', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(inventoryService, 'getRoleCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(contractsService, 'getContractCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(contractsService, 'getCoverageCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.inventory.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'role' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'advisories' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'contractNumber' }).seriesData.length)
				.toBe(0);
			expect(_.find(component.filters, { key: 'coverage' }).seriesData.length)
				.toBe(0);

			done();
		});
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

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select view', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.view)
				.toBe('list');

			component.selectView('grid');

			fixture.detectChanges();

			expect(component.view)
				.toBe('grid');

			done();
		});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should detect selection changes', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.selectedAssets.length)
				.toBe(0);

			component.onSelectionChanged([{ }]);

			fixture.detectChanges();

			expect(component.selectedAssets.length)
				.toBe(1);

			done();
		});
	});

	it('should clear selected filters', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			component.clearSelectedFilters();

			expect(_.some(component.filters, 'selected'))
				.toBeFalsy();

			done();
		});
	});

	it('should set a loading boolean for Cypress runs', () => {
		expect(window.loading)
			.toBeUndefined();
		window.Cypress = true;

		component.ngOnInit();

		fixture.detectChanges();
		expect(window.loading)
			.toBe(true);

		// cleanup
		window.Cypress = undefined;
		window.loading = undefined;
	});
});
