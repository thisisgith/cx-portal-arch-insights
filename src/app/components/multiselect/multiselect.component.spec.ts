import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MultiselectComponent } from './multiselect.component';
import { MultiselectModule } from './multiselect.module';

describe('MultiselectComponent', () => {
	let component: MultiselectComponent;
	let fixture: ComponentFixture<MultiselectComponent>;

	const testItems = [
		{
			name: 'item one',
			value: 'item1',
		},
		{
			name: 'item two',
			value: 'item2',
		},
	];

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [MultiselectModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiselectComponent);
		component = fixture.componentInstance;
		component.items = testItems;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should toggle the dropdown menu', () => {
		const toggleBtn = fixture.debugElement.query(
			By.css(`[data-auto-id="${component.componentId}-DropdownToggle"]`),
		);

		toggleBtn.nativeElement.click();
		fixture.detectChanges();
		expect(component.dropdownActive)
			.toBeTruthy();
		toggleBtn.nativeElement.click();
		expect(component.dropdownActive)
			.toBeFalsy();
	});

	it('should select/deselect all items', () => {
		component.dropdownActive = true;
		component.toggleAllOptions();
		fixture.detectChanges();

		expect(component.allSelected)
			.toBeTruthy();

		component.toggleAllOptions();
		fixture.detectChanges();
		expect(component.allSelected)
			.toBeFalsy();
	});

	it('should handle save', () => {
		component.dropdownActive = true;
		component.selectedIndices = [0];
		spyOn(component.changed, 'emit');

		component.save();

		fixture.detectChanges();
		expect(component.changed.emit)
			.toHaveBeenCalled();
	});

	it('should handle clear', () => {
		component.dropdownActive = true;
		component.toggleAllOptions();

		expect(component.selectedIndices.length)
			.toBeGreaterThan(0);
		component.clear();
		expect(component.selectedIndices.length)
			.toBeLessThanOrEqual(0);

	});
});
