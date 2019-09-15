import { Component, ContentChild, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { DetailsPanelHeaderComponent } from './header/header.component';

/**
 * Generic component for any 360 detail slide-out views
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
		'[style.minWidth]': 'minWidth',
	},
	selector: 'details-panel',
	styleUrls: ['./details-panel.component.scss'],
	templateUrl: './details-panel.component.html',
})
export class DetailsPanelComponent {
	@Input('fullscreen') public fullscreen = false;
	@Input('hidden') public hidden = true;
	@Output('hiddenChange') public hiddenChange = new EventEmitter<boolean>();
	@ContentChild(DetailsPanelHeaderComponent, { static: true })
		public headerComponent: DetailsPanelHeaderComponent;
	@Input() public minWidth;

	/**
	 * Handler for mouse clicks to close panel
	 * @param event mousedown event
	 */
	@HostListener('document:mousedown', ['$event'])
	public onPageClick (event) {
		let path = event.path || event.composedPath();
		path = path.slice(0, -2);  // exclude the document and Window
		const classesToExclude = ['not-close-360'];
		if (!this.hidden && this.pathExcludesClasses(path, classesToExclude)) {
			this.hidden = true;
			this.hiddenChange.emit(this.hidden);
		}
	}

	/**
	 * helper function
	 * @param path an array of HTMLElements as EventTargets
	 * @param targetClasses strings (context of <myEl class="blah">) to exclude
	 * @returns True if the path (e.g. the stack of elements underneath the mouse on
	 *          click) excludes all the given classes. False if the set of classes in
	 *          the path intersects with the set of classes given.
	 */
	private pathExcludesClasses (path: EventTarget[], targetClasses: string[]): boolean {
		return !path.some((step: HTMLElement) => targetClasses
			.some((targetClass: string) => step.classList.contains(targetClass)));
	}
}
