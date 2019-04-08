import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryComponent } from './inventory.component';
import { InventoryModule } from './inventory.module';

describe('InventoryComponent', () => {
	let component: InventoryComponent;
	let fixture: ComponentFixture<InventoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [InventoryModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InventoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
