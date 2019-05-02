import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AlertInfoComponent, AlertInfoOptions } from './alert-info.component';
import { AlertInfoModule } from './alert-info.module';
import { alertData } from '@mock';
import { I18n } from '@cisco-ngx/cui-utils';
import * as enUSJson from '../../../../assets/i18n/en-US.json';
import * as _ from 'lodash';

describe('AlertInfoComponent', () => {
	let component: AlertInfoComponent;
	let fixture: ComponentFixture<AlertInfoComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	const options: AlertInfoOptions = {
		data: alertData.vulnerabilities.advisories,
		key: 'advisories',
		table: [
			{
				key: 'title',
				name: 'Summary',
				sortable: true,
				sortDirection: 'asc',
				sorting: true,
			},
		],
		title: 'Security Advisories',
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AlertInfoModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);
		fixture = TestBed.createComponent(AlertInfoComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle changing the options while being displayed', () => {
		component.options = _.cloneDeep(options);

		fixture.detectChanges();

		expect(component.options.data.length)
			.toEqual(8);

		expect(component.options.key)
			.toEqual('advisories');

		const newOptions: AlertInfoOptions = {
			data: alertData.vulnerabilities.fieldNotices,
			key: 'fieldNotices',
			table: [
				{
					key: 'title',
					name: I18n.get('_Summary_'),
					sortable: true,
					sorting: true,
				},
			],
			title: 'Field Notices',
		};

		component.options = newOptions;

		fixture.detectChanges();

		expect(component.options.data.length)
			.toEqual(3);

		expect(component.options.key)
			.toEqual('fieldNotices');

		expect(component.options.data)
			.toEqual(_.orderBy(
				component.options.data,
				[component.options.table[0].key],
				[component.options.table[0].sortDirection],
			));
	});

	describe('gauges', () => {
		it('should display if they exist', () => {
			const clonedOptions = _.cloneDeep(options);
			clonedOptions.gauges = [
				{
					color: 'danger',
					count: 5,
					percent: 50,
					selected: false,
					title: 'Critical',
				},
				{
					color: 'warning',
					count: 5,
					percent: 50,
					selected: false,
					title: 'Warning',
				},
			];
			component.options = clonedOptions;

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('cui-gauge'));
			expect(de)
				.toBeTruthy();
		});

		it('should not display if they do not exist', () => {
			component.options = _.cloneDeep(options);

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('cui-gauge'));
			expect(de)
				.toBeFalsy();
		});

		it('should filter the table if clicked', () => {
			const clonedOptions = _.cloneDeep(options);
			clonedOptions.gauges = [
				{
					color: 'danger',
					count: 5,
					percent: 50,
					selected: false,
					title: 'Critical',
				},
			];
			component.options = clonedOptions;

			fixture.detectChanges();

			expect(component.options.data.length)
				.toEqual(8);

			expect(component.options.gauges[0].selected)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('cui-gauge'));
			el = de.nativeElement;
			el.click();

			fixture.detectChanges();

			expect(component.options.gauges[0].selected)
				.toBeTruthy();

			expect(component.options.data.length)
				.toEqual(3);
		});
	});

	describe('table', () => {
		it('should sort the data if column is clicked', () => {
			component.options = _.cloneDeep(options);

			fixture.detectChanges();

			expect(component.options.data)
				.toEqual(_.orderBy(
					component.options.data,
					[component.options.table[0].key],
					[component.options.table[0].sortDirection],
				));

			expect(component.options.table[0].sortDirection)
				.toEqual('asc');

			de = fixture.debugElement.query(By.css('th.sortable'));
			el = de.nativeElement;
			el.click();

			fixture.detectChanges();

			expect(component.options.table[0].sortDirection)
				.toEqual('desc');

			expect(component.options.data)
				.toEqual(_.orderBy(
					component.options.data,
					[component.options.table[0].key],
					[component.options.table[0].sortDirection],
				));
		});

		it('should filter the data based on search', () => {
			component.options = _.cloneDeep(options);

			fixture.detectChanges();

			expect(component.options.data.length)
				.toEqual(8);

			const searchTerm = 'ISM Malformed';

			component.doSearch(searchTerm);

			fixture.detectChanges();

			expect(component.options.data.length)
				.toEqual(1);
		});

		it('should highlight the row on selection', () => {
			component.options = _.cloneDeep(options);

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('tbody > tr.active'));
			expect(de)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('tbody > tr'));
			el = de.nativeElement;
			el.click();

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('tbody > tr.active'));
			expect(de)
				.toBeTruthy();
		});
	});
});
