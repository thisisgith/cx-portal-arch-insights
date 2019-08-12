import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * An option
 */
export interface SelectOption<T> {
	name: string;
	selected?: boolean;
	subtitle: string;
	value: T;
}

/**
 * Component for radio-style selection with big ol' panel buttons
 */
@Component({
	providers: [{
		multi: true,
		provide: NG_VALUE_ACCESSOR,
		useExisting: PanelSelectComponent,
	}],
	selector: 'app-panel-select',
	styleUrls: ['./panel-select.component.scss'],
	templateUrl: './panel-select.component.html',
})
export class PanelSelectComponent implements ControlValueAccessor {
	@Input() public options: SelectOption<any>[];
	public onChange: any;

	/**
	 * Fires when a user clicks an option
	 * @param option the option to select
	 */
	public select (option: SelectOption<any>) {
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
		this.options.forEach(o => {
			o.selected = false;
		});
		const found = this.options.find(o => o.value === value);
		if (found) {
			found.selected = true;
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
