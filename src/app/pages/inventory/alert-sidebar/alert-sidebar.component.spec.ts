import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertSidebarComponent } from './alert-sidebar.component';
import { AlertSidebarModule } from './alert-sidebar.module';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { alertData } from '@mock';
import { RMA } from '@interfaces';

import { I18n } from '@cisco-ngx/cui-utils';

import * as enUSJson from '../../../../assets/i18n/en-US.json';

describe('AlertSidebarComponent', () => {
	let component: AlertSidebarComponent;
	let fixture: ComponentFixture<AlertSidebarComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AlertSidebarModule,
				HttpClientModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);
		fixture = TestBed.createComponent(AlertSidebarComponent);
		component = fixture.componentInstance;
		component.alertResults = alertData;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should show the summary results by default', () => {
		expect(component.filters.length)
			.toEqual(4);

		expect(component.filters[0].data.length)
			.toEqual(1);

		expect(component.filters[1].data.length)
			.toEqual(1);

		expect(component.filters[2].data.length)
			.toEqual(1);

		expect(component.filters[3].data.length)
			.toEqual(1);
	});

	it('should show the details when clicking on a summary tab', () => {
		de = fixture.debugElement.query(By.css('#alertSummary'));

		expect(de)
			.toBeTruthy();

		de = fixture.debugElement.query(By.css('#alertSummaries > .alertSummary'));
		el = de.nativeElement;

		expect(de)
			.toBeTruthy();

		expect(component.alertDetails)
			.toBeUndefined();

		el.click();

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('#alertSummary'));

		expect(de)
			.toBeFalsy();

		de = fixture.debugElement.query(By.css('#alertDetails'));
		expect(de)
			.toBeTruthy();
	});

	it('should change details based on given alertDetails', () => {
		component.alertDetails = {
			data: alertData.vulnerabilities.fieldNotices[0],
			key: 'fieldNotices',
		};

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('#alertDetails'));
		expect(de)
			.toBeTruthy();

		de = fixture.debugElement.query(
			By.css('#detailsHeader > .col-md-10 > span.text-uppercase'));

		el = de.nativeElement;

		expect(el.innerText)
			.toEqual(component.details.fieldNotices.title);

		component.alertDetails = {
			data: alertData.lifecycle.contracts[0],
			key: 'contracts',
		};

		fixture.detectChanges();

		de = fixture.debugElement.query(
			By.css('#detailsHeader > .col-md-10 > span.text-uppercase'));

		el = de.nativeElement;

		expect(el.innerText)
			.toEqual(component.details.contracts.title);
	});

	it('should return to summary when details is clicked', () => {
		component.alertDetails = {
			data: alertData.vulnerabilities.fieldNotices[0],
			key: 'fieldNotices',
		};

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('#alertDetails'));
		expect(de)
			.toBeTruthy();

		de = fixture.debugElement.query(By.css('#detailsHeader > .col-md-10'));

		el = de.nativeElement;
		el.click();

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('#alertDetails'));
		expect(de)
			.toBeFalsy();

		de = fixture.debugElement.query(By.css('#alertSummary'));
		expect(de)
			.toBeTruthy();

		expect(component.alertDetails)
			.toBeNull();
	});

	it('should hide when collapse is clicked', () => {
		expect(component.collapsed)
			.toBeFalsy();

		de = fixture.debugElement.query(
			By.css('#alertSidebarCollapse > span.icon-arrow-left-tail'));
		el = de.nativeElement;

		expect(de)
			.toBeTruthy();

		el.click();

		fixture.detectChanges();

		expect(component.collapsed)
			.toBeTruthy();

		de = fixture.debugElement.query(
			By.css('#alertSidebarCollapse > span.icon-arrow-right-tail'));

		expect(de)
			.toBeTruthy();
	});

	it('should return the correct delivery data for an RMA', () => {
		const rma: RMA = alertData.health.rmas[0];

		rma.timeline = [
			{
				date: '2019-05-05',
				title: 'Accepted',
			},
			{
				date: '2019-05-20',
				title: 'Delivery',
			},
		];

		expect(component.rmaDelivery(rma))
			.toEqual('2019-05-20');
	});

	it('should return null if there is no delivery date', () => {
		const rma: RMA = alertData.health.rmas[0];

		rma.timeline = [
			{
				date: '2019-05-05',
				title: 'Accepted',
			},
			{
				date: '2019-05-20',
				title: 'Processing',
			},
		];

		expect(component.rmaDelivery(rma))
			.toBeNull();
	});

	it('should adjust the timeline correctly for past events', () => {
		const date = new Date();
		date.setDate(date.getDate() + 5);
		const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

		const rma = alertData.health.rmas[0];

		rma.timeline = [
			{
				date: '2019-4-5',
				title: 'Accepted',
			},
			{
				date: dateString,
				title: 'Delivery',
			},
		];

		expect(component.timeline(rma))
			.toEqual([
				{
					date: dateString,
					past: false,
					title: 'Delivery',
				},
				{
					date: '2019-4-5',
					past: true,
					title: 'Accepted',
				},
			]);
	});
});
