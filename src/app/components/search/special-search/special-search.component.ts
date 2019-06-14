import { Component, TemplateRef } from '@angular/core';

/**
 * Abstract class representing special search content with sidebar content
 */
@Component({
	selector: 'app-special-search',
	templateUrl: './special-search.component.html',
})
export class SpecialSearchComponent {
	public sidebarContent: TemplateRef<any>;
}
