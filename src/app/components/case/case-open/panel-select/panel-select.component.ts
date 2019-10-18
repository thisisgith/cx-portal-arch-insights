import { Component, ContentChildren, Input, AfterContentInit, QueryList } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PanelSelectOptionComponent } from './panel-select-option/panel-select-option.component';

/**
 * Component for radio-style selection with big ol' panel buttons
 */
@Component({
	providers: [{
		multi: true,
		provide: NG_VALUE_ACCESSOR,
		useExisting: PanelSelectComponent,
	}],
	selector: 'panel-select',
	styleUrls: ['./panel-select.component.scss'],
	templateUrl: './panel-select.component.html',
})
export class PanelSelectComponent implements AfterContentInit, ControlValueAccessor {
	@ContentChildren(PanelSelectOptionComponent) public options:
		QueryList<PanelSelectOptionComponent<any>>;
	@Input() public layout?: 'default' | 'vertical' = 'default';
	public isSubtechSelected = false;
	public onChange: any;
	public initialValue: any;

	/**
	 * AfterContentInit lifecycle hook, initialize any selection
	 */
	public ngAfterContentInit () {
		this.options.forEach(o => {
			if (o.value === this.initialValue) {
				o.selected = true;
			} else {
				o.selected = false;
			}
		});
	}

	/**
	 * Fires when a user clicks an option
	 * @param option the option to select
	 */
	public select (option: PanelSelectOptionComponent<any>) {
		this.isSubtechSelected = true;
		this.options.forEach(o => {
			o.selected = false;
		});
		option.selected = true;
		this.onChange(option.value);
	}

	/**
	 * Register FormControl onChange
	 * @param fn function
	 */
	public registerOnChange (fn: any) {
		this.onChange = fn;
	}

	/**
	 * Called when FormControl updates value
	 * @param value incoming value
	 */
	public writeValue (value: any) {
		this.isSubtechSelected = false;
		if (this.options) {
			this.options.forEach(o => {
				o.selected = false;
			});
			const found = this.options.find(o => o.value === value);
			if (found) {
				found.selected = true;
			}
		} else {
			this.initialValue = value;
		}
	}

	/**
	 * Register component for touch
	 * Do nothing.
	 * @param fn function
	 */
	/* tslint:disable-next-line no-empty no-unused*/
	public registerOnTouched (fn: any) { }
}
