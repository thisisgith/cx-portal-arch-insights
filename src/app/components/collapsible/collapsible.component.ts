import { Component, Input } from '@angular/core';

/**
 * Component for collapsible content, clicking on a link of text expands content below it
 */
@Component({
	selector: 'app-collapsible',
	styleUrls: ['./collapsible.component.scss'],
	templateUrl: './collapsible.component.html',
})
export class CollapsibleComponent {
	@Input() public text: string;

	public collapsed = true;
}
