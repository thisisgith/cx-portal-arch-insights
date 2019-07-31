import { Component, ContentChild, Input } from '@angular/core';
import { DetailsPanelHeaderComponent } from './header/header.component';

/**
 * Generic component for any 360 detail slide-out views
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'details-panel',
	styleUrls: ['./details-panel.component.scss'],
	templateUrl: './details-panel.component.html',
})
export class DetailsPanelComponent {
	@Input('fullscreen') public fullscreen = false;
	@Input('hidden') public hidden = true;
	@ContentChild(DetailsPanelHeaderComponent, { static: true })
		public headerComponent: DetailsPanelHeaderComponent;
}
