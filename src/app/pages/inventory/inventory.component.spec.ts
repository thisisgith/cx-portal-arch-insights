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
	});
});
