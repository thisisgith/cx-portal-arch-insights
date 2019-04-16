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
});
