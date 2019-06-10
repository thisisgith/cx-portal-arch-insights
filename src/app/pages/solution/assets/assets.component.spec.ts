import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { InventoryService } from '@cui-x/sdp-api';
import { environment } from '@environment';
import * as _ from 'lodash';

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
	 * @TODO modify test to use UI
	 */
	it('should switch active filters', () => {
		const totalFilter = _.find(component.filters, { key: 'total' });
		const casesFilter = _.find(component.filters, { key: 'cases' });
		expect(_.find(component.filters, 'selected'))
			.toEqual(totalFilter);

		component.selectFilter(casesFilter);

		fixture.detectChanges();

		expect(_.find(component.filters, 'selected'))
			.toEqual(casesFilter);
	});

	it('should default to first filter if unselecting all filters', () => {
		const totalFilter = _.find(component.filters, { key: 'total' });
		const casesFilter = _.find(component.filters, { key: 'cases' });

		expect(_.find(component.filters, 'selected'))
			.toEqual(totalFilter);

		component.selectFilter(casesFilter);

		fixture.detectChanges();

		expect(_.find(component.filters, 'selected'))
			.toEqual(casesFilter);

		component.selectFilter(casesFilter);

		fixture.detectChanges();

		expect(_.find(component.filters, 'selected'))
			.toEqual(totalFilter);
	});

	it('should set a loading boolean for Cypress runs', () => {
		expect(window.loading)
			.toBeUndefined();
		window.Cypress = true;

		component.ngOnInit();
		expect(window.loading)
			.toBe(true);

		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(of({ data: [] }));
		component.ngOnInit();
		expect(window.loading)
			.toBe(false);
	});
});
