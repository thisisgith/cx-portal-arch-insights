import {
	Component,
	Output,
	EventEmitter,
	Renderer2,
} from '@angular/core';

/**
 * Header dropdown panel component
 */
@Component({
	selector: 'header-dropdown',
	styleUrls: ['./header-dropdown.component.scss'],
	templateUrl: './header-dropdown.component.html',
})
export class HeaderDropdownComponent {
	@Output('toggle') public toggle = new EventEmitter<boolean>();
	public open = false;

	constructor (private renderer: Renderer2) { }

	/**
	 * Stub definition for the clickListener
	 */
	private clickListener: Function = () => null;

	/**
	 * Closes the dropdown, emits the close event,
	 * and removes the click listener from the document
	 */
	public closeDropdown () {
		this.open = false;
		this.toggle.emit(false);
		this.clickListener();
	}

	/**
	 * Closes the dropdown and emits the close event
	 */
	public openDropdown () {
		this.open = true;
		// This set timeout is necessary because
		// we want to attach the click listener
		// AFTER the component has finished opening.
		// Otherwise the click listener fires during
		// the same click that called openDropown
		// in the first place, closing the dropdown.
		setTimeout(() => {
			this.clickListener = this.renderer.listen('document', 'click', () => {
				this.closeDropdown();
			});
		});
	}
}
