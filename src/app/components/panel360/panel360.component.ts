import { Component, ContentChild, Input } from '@angular/core';
import { Panel360HeaderComponent } from './panel360-header/panel360-header.component';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Generic component for any 360 detail slide-out views
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'app-panel360',
	styleUrls: ['./panel360.component.scss'],
	templateUrl: './panel360.component.html',
})
export class Panel360Component {
	@Input('fullscreen') public fullscreen = false;
	@Input('hidden') public hidden = true;
	@ContentChild(Panel360HeaderComponent, { static: true })
		public headerComponent: Panel360HeaderComponent;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('Panel360Component Created!');
	}
}
