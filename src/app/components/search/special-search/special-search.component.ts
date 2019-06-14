import { Component, EventEmitter, TemplateRef } from '@angular/core';

/**
 * Abstract class representing special search content with sidebar content
 */
@Component({
	selector: 'app-special-search',
	templateUrl: './special-search.component.html',
})
export class SpecialSearchComponent {
	/**
	 * Template containing any sidebar content to be shown in the main search view
	 */
	public sidebarContent: TemplateRef<any>;
	/**
	 * Event emitter for the component to tell its parent whether it should be hidden or not.
	 * Emits "true" to hide the component "false" to show the component
	 */
	public hide: EventEmitter<boolean>;
}
