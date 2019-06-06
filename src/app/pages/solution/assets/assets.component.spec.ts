import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import * as _ from 'lodash';

describe('AssetsComponent', () => {
	let component: AssetsComponent;
	let fixture: ComponentFixture<AssetsComponent>;

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
});
