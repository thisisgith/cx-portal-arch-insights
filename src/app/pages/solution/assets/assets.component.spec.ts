import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { InventoryService } from '@cui-x/sdp-api';
import { environment } from '@environment';
import * as _ from 'lodash-es';

describe('AssetsComponent', () => {
	let component: AssetsComponent;
	let fixture: ComponentFixture<AssetsComponent>;
	let inventoryService: InventoryService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				HttpClientModule,
				MicroMockModule,
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
		inventoryService = TestBed.get(InventoryService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should switch active filters', () => {
		const totalFilter = _.find(component.filters, { key: 'total' });
		const coverageFilter = _.find(component.filters, { key: 'coverage' });
		expect(_.find(component.filters, 'selected'))
			.toEqual(totalFilter);

		component.selectFilter(coverageFilter);
		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(coverageFilter);
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select a coverage subfilter', () => {
		let coverageFilter = _.find(component.filters, { key: 'coverage' });
		component.selectFilter(coverageFilter);
		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(coverageFilter);

		component.onSubfilterSelect('Covered', 'coverage');
		coverageFilter = _.find(component.filters, { key: 'coverage' });
		expect(coverageFilter.subfilter)
			.toEqual('Covered');
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should clear the filter when selecting the same subfilter twice', () => {
		let coverageFilter = _.find(component.filters, { key: 'coverage' });
		component.selectFilter(coverageFilter);
		fixture.detectChanges();

		expect(_.filter(component.filters, 'selected'))
			.toContain(coverageFilter);

		component.onSubfilterSelect('Covered', 'coverage');
		coverageFilter = _.find(component.filters, { key: 'coverage' });
		expect(coverageFilter.subfilter)
			.toEqual('Covered');

		component.onSubfilterSelect('Covered', 'coverage');
		coverageFilter = _.find(component.filters, { key: 'coverage' });
		expect(coverageFilter.selected)
			.toBeFalsy();
	});

	it('should set a loading boolean for Cypress runs', () => {
		expect(window.loading)
			.toBeUndefined();
		window.Cypress = true;

		component.ngOnInit();
		expect(window.loading)
			.toBe(true);

		spyOn(inventoryService, 'getNetworkElements')
			.and
			.returnValue(of({ data: [] }));
		component.ngOnInit();
		expect(window.loading)
			.toBe(false);

		// cleanup
		window.Cypress = undefined;
		window.loading = undefined;
	});
});
