import {
	ElementRef,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';

import * as _ from 'lodash-es';

/**
 * Mult select component with search
 */
@Component({
	selector: 'multiselect',
	styleUrls: ['./multiselect.component.scss'],
	templateUrl: './multiselect.component.html',
})
export class MultiselectComponent {
	public componentId: string;

	@Input() public name: string;
	@Input() public items: any[];
	@Output() public changed: EventEmitter<any> = new EventEmitter<any>();
	public dropdownActive: boolean;
	public selectedIndices: number[] = [];
	public oldSelectedIndices: number[] = [];
	public searchValue = '';
	@Input() public nameKey = 'name';
	@Input() public valueKey = 'value';

	get inputValue (): string {
		if (this.selectedIndices.length > 0 && this.selectedIndices.length !== this.items.length) {
			return `${this.name} (${this.selectedIndices.length})`;
		}
		return this.name;
	}

	get allSelected (): boolean {
		return this.selectedIndices.length === this.items.length;
	}

	constructor (
		private elRef: ElementRef,
	) {
		this.componentId = `${this.elRef.nativeElement.tagName}-${_.uniqueId()}`;
	}

	/**
	 * Toggle item selection on/off
	 * @param index The index of list item
	 */
	public toggleOption (index): void {
		const foundPos = this.selectedIndices.indexOf(index);
		if (foundPos !== -1) {
			if (this.allSelected) {
				this.selectedIndices = [index];
			} else {
			// if (this.selectedIndices.length === 1) { return; } // if last selected.. do nothing
				this.selectedIndices.splice(foundPos, 1);
			}
		} else {
			this.selectedIndices.push(index);
		}
	}

	/**
	 * Set all list items as selected or deselect
	 */
	public toggleAllOptions (): void {
		if (this.allSelected) {
			this.selectedIndices = [];
			return;
		}
		for (let i = 0; i < this.items.length; i += 1) {
			if  (!this.selectedIndices.includes(i)) {
				this.selectedIndices.push(i);
			}
		}
	}

	/**
	 * Closes the list dropdown
	 * @param revertSelections If we need to reset the selectedIndices (not saved)
	 */
	public closeDropdown (revertSelections: boolean = true): void  {
		this.dropdownActive = false;
		this.searchValue = '';
		if (revertSelections) {
			this.selectedIndices = this.oldSelectedIndices;
		}
	}

	/**
	 * Open the list dropdown
	 */
	public openDropdown () {
		this.oldSelectedIndices = JSON.parse(JSON.stringify(this.selectedIndices));
		this.dropdownActive = true;
	}

	/**
	 * Toggle the list dropdown
	 */
	public toggleDropdown (): void {
		this.dropdownActive ? this.closeDropdown() : this.openDropdown();
	}

	/**
	 * Emits change event with selectedItems and closes dropdown without reverting.
	 */
	public save (): void {
		const selectedItems = this.selectedIndices.map(index => this.items[index]);
		this.changed.emit(selectedItems);
		this.closeDropdown(false);
	}

	/**
	 * Clears all item selections
	 */
	public clear (): void {
		this.selectedIndices = [];
	}

	/**
	 * Fired on input keypress to update searchValue
	 * @param value The key pressed
	 */
	public onSearchInputChange (value): void {
		this.searchValue = value;
	}

	/**
	 * Checks if list item included in search
	 * @param item The item
	 * @returns item inclusion
	 */
	public isIncludedInSearch (item): boolean {
		if (!this.searchValue)  {
			return true;
		}
		return this.searchValue && item[this.nameKey].toLowerCase()
			.indexOf(this.searchValue) > -1;
	}
}
