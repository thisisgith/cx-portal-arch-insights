import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { AlertService } from '@services';
import { InventoryComponent } from './inventory.component';
import { InventoryModule } from './inventory.module';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { alertData } from '@mock';
import { I18n } from '@cisco-ngx/cui-utils';

import * as enUSJson from '../../../assets/i18n/en-US.json';

describe('InventoryComponent', () => {
	let component: InventoryComponent;
	let fixture: ComponentFixture<InventoryComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	let service: AlertService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				InventoryModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(AlertService);
		I18n.injectDictionary(enUSJson);

		fixture = TestBed.createComponent(InventoryComponent);
		component = fixture.componentInstance;

		spyOn(service, 'read')
			.and
			.returnValue(of(alertData));

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('assets', () => {
		it('should show the table', () => {
			de = fixture.debugElement.query(By.css('.responsive-table'));

			expect(de)
				.toBeTruthy();
		});

		it('should have the search field', () => {
			de = fixture.debugElement.query(By.css('#asset-search'));

			expect(de)
				.toBeTruthy();
		});
	});

	describe('sidebar', () => {
		it('should show the sidebar by default', () => {
			expect(component.status.sidebarCollapsed)
				.toEqual(false);

			de = fixture.debugElement.query(By.css('.inventory-sidebar'));

			expect(de)
				.toBeTruthy();
		});

		it('should hide the sidebar when collapsed', () => {
			expect(component.status.sidebarCollapsed)
				.toEqual(false);

			component.status.sidebarCollapsed = true;

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('.inventory-sidebar'));

			expect(de)
				.toBeFalsy();
		});
	});

	describe('advisories', () => {
		it('should have tabs created', () => {
			expect(component.tabs.length)
				.toEqual(3);

			expect(component.tabs[0].key)
				.toEqual('vulnerabilities');

			expect(component.tabs[0].subTabs.length)
				.toEqual(2);

			expect(component.tabs[1].key)
				.toEqual('health');

			expect(component.tabs[1].subTabs.length)
				.toEqual(3);

			expect(component.tabs[2].key)
				.toEqual('lifecycle');

			expect(component.tabs[2].subTabs.length)
				.toEqual(3);
		});

		it('should show the advisory tabs', () => {
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#advisory-tabs'));

			expect(de)
				.toBeTruthy();
		});

		it('should have vulnerability selected by default', () => {
			expect(component.selectedTab.key)
				.toEqual('vulnerabilities');

			de = fixture.debugElement.query(By.css('.alert-tab-selected'));
			el = de.nativeElement;

			expect(el.innerText)
				.toEqual('Vulnerability');
		});

		it('should hide the tabs if the selected is clicked', () => {
			de = fixture.debugElement.query(By.css('.alert-tab-selected'));
			el = de.nativeElement;

			expect(de)
				.toBeTruthy();

			el.click();

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('.alert-tab-selected'));
			expect(de)
				.toBeFalsy();
		});

		it('should change the tab', () => {
			expect(component.selectedTab.key)
				.toEqual('vulnerabilities');

			de = fixture.debugElement.query(By.css('.alert-tab-selected'));
			el = de.nativeElement;

			expect(el.innerText)
				.toEqual('Vulnerability');

			component.selectTab(component.tabs[1]);

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('.alert-tab-selected'));
			el = de.nativeElement;

			expect(el.innerText)
				.toEqual('Network Health');
		});

		it('should show the dropdown', () => {
			expect(component.selectedTab.key)
				.toEqual('vulnerabilities');

			expect(component.selectedTab.subTabs[0].selected)
				.toBeFalsy();

			component.selectSubTab(component.selectedTab.subTabs[0]);

			fixture.detectChanges();

			expect(component.selectedTab.subTabs[0].selected)
				.toEqual(true);
		});

		it('should allow setting the alertDetails', () => {

			const data = component.alertData.vulnerabilities.advisories[0];
			const testObject = {
				data,
				key: 'advisories',
				selected: true,
			};

			expect(component.alertDetails)
				.toBeUndefined();

			component.onSelect(testObject);

			fixture.detectChanges();

			expect(component.alertDetails.key)
				.toEqual('advisories');
		});
	});

	it('should show Assets panel', () => {
		de = fixture.debugElement.query(By.css('#tableheaderpanel'));
		expect(de)
			.toBeTruthy();
	});

	it('Should not show sidepanel at default', () => {
		expect(component.showSidePanel)
			.toBeFalsy();
	});

	describe('Should show Assets table', () => {
		beforeEach(() => {
			component.loadData();
		});

		it('should show Asset table if Asset data has been load', () => {
			de = fixture.debugElement.query(By.css('table'));
			expect(de)
				.toBeTruthy();
		});

		it('should show table header', () => {
			de = fixture.debugElement.query(By.css('thead'));
			expect(de)
				.toBeTruthy();
		});
	});

	describe('details', () => {
		beforeEach(() => {
			component.loadData();
		});

		it('should not show details at default', () => {
			expect(component.showSidePanel)
				.toBeFalsy();
			de = fixture.debugElement.query(By.css('asset-detail-panel'));
			expect(de)
				.toBeFalsy();
		});

		it('should show details when clicking table row', () => {
			const assetId = 1;
			component.clickTableRow(assetId);
			expect(component.showSidePanel)
				.toBeTruthy();
		});

		it('should close details when click another table row if there is details', () => {
			component.activeAssetId = 1;
			const assetId = 2;
			component.showSidePanel = true;
			component.clickTableRow(assetId);
			expect(component.showSidePanel)
				.toBeFalsy();
		});

		it('should still show details when click the same table row', () => {
			component.activeAssetId = 1;
			const assetId = 1;
			component.showSidePanel = true;
			component.clickTableRow(assetId);
			expect(component.showSidePanel)
				.toBeTruthy();
		});

		it('should not show details when click Close button', () => {
			component.closeSidePanel();
			expect(component.showSidePanel)
				.toBeFalsy();
			de = fixture.debugElement.query(By.css('asset-detail-panel'));
			expect(de)
				.toBeFalsy();
		});

		it('should show vulnerability tab content at default', () => {
			expect(component.currentTab)
				.toEqual('vulnerability');
			expect(component.currentButton)
				.toEqual('securityadvisory');
		});

		it('should show health tab content when selectTab called', () => {
			component.selectDetailTab('health');
			fixture.detectChanges();
			expect(component.currentTab)
				.toEqual('health');
		});

		it('should show showLess link after click showMore link', () => {
			component.showMore();
			fixture.detectChanges();
			expect(component.less)
				.toBeFalsy();
		});

		it('should show showLess link after click showMore link', () => {
			component.showLess();
			fixture.detectChanges();
			expect(component.less)
				.toBeTruthy();
		});

		it('should change the sortDirection after click sort icon', () => {
			component.sortDirection = 'desc';
			component.onSort();
			expect(component.sortDirection)
				.toEqual('asc');
			component.onSort();
			expect(component.sortDirection)
				.toEqual('desc');
		});
	});
});
