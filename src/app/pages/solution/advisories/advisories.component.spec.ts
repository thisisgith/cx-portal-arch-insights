import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoriesComponent } from './advisories.component';
import { AdvisoriesModule } from './advisories.module';
import * as _ from 'lodash-es';

describe('AdvisoriesComponent', () => {
	let component: AdvisoriesComponent;
	let fixture: ComponentFixture<AdvisoriesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AdvisoriesModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdvisoriesComponent);
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
			const tab = _.find(component.tabs, { key: 'security' });
			component.selectTab(0);
			const totalFilter = _.find(tab.filters, { key: 'total' });
			const impactFilter = _.find(tab.filters, { key: 'impact' });
			impactFilter.seriesData = [
				{
					filter: 'info',
					label: 'Info',
					selected: false,
					value: 4,
				},
			];

			expect(_.find(tab.filters, 'selected'))
				.toEqual(totalFilter);

			component.onSubfilterSelect('info', impactFilter);

			fixture.detectChanges();

			expect(_.filter(tab.filters, 'selected'))
				.toContain(impactFilter);

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
			const tab = _.find(component.tabs, { key: 'security' });
			component.selectTab(0);
			const impactFilter = _.find(tab.filters, { key: 'impact' });
			impactFilter.seriesData = [
				{
					filter: 'info',
					label: 'Info',
					selected: false,
					value: 4,
				},
			];
			component.onSubfilterSelect('info', impactFilter);

			fixture.detectChanges();

			expect(_.filter(tab.filters, 'selected'))
				.toContain(impactFilter);

			let subfilter = _.find(impactFilter.seriesData, { filter: 'info' });

			expect(subfilter.selected)
				.toBeTruthy();

			component.onSubfilterSelect('info', impactFilter);

			fixture.detectChanges();

			subfilter = _.find(impactFilter.seriesData, { filter: 'info' });

			expect(subfilter.selected)
				.toBeFalsy();

			done();
		});
	});
});
