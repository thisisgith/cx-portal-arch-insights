import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { InventoryComponent } from './inventory.component';
import { InventoryModule } from './inventory.module';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { DebugElement } from '@angular/core';
import { SolutionComponent } from '../solution/solution.component';

describe('InventoryComponent', () => {
	let component: InventoryComponent;
	let fixture: ComponentFixture<InventoryComponent>;
	let de: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				InventoryModule,
				RouterTestingModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes(
					[{ path: '', component: SolutionComponent }],
				),
			],
		});
		fixture = TestBed.createComponent(InventoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should show sidebar', () => {
		fixture.detectChanges();
		de = fixture.debugElement.query(By.directive(SidebarComponent));
		expect(de)
			.toBeTruthy();
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

	describe('Right SidePanel', () => {
		beforeEach(() => {
			component.loadData();
		});

		it('Should not show sidepanel at default', () => {
			expect(component.showSidePanel)
				.toBeFalsy();
			de = fixture.debugElement.query(By.css('asset-detail-panel'));
			expect(de)
				.toBeFalsy();
		});

		it('should show sidepanel when click tablerow', () => {
			const assetId = 1;
			component.clickTableRow(assetId);
			expect(component.showSidePanel)
				.toBeTruthy();
		});

		it('should close sidepanel when click another tablerow if there is sidepanel', () => {
			component.activeAssetId = 1;
			const assetId = 2;
			component.showSidePanel = true;
			component.clickTableRow(assetId);
			expect(component.showSidePanel)
				.toBeFalsy();
		});

		it('should still show sidepanel when click the same table row', () => {
			component.activeAssetId = 1;
			const assetId = 1;
			component.showSidePanel = true;
			component.clickTableRow(assetId);
			expect(component.showSidePanel)
				.toBeTruthy();
		});

		it('should not show sidepanel when click Close button', () => {
			component.closeSidePanel();
			expect(component.showSidePanel)
				.toBeFalsy();
			de = fixture.debugElement.query(By.css('asset-detail-panel'));
			expect(de)
				.toBeFalsy();
		});

		it('should show Vulnerability tab content at default', () => {
			expect(component.currentTab)
				.toEqual('vulnerability');
			expect(component.currentButton)
				.toEqual('securityadvisory');
		});

		it('should show health tab content when selectTab called', () => {
			component.selectTab('health');
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
