import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main gauge-panel component
 */
@Component({
	selector: 'app-gauge-panel',
	styleUrls: ['./gauge-panel.component.scss'],
	templateUrl: './gauge-panel.component.html',
})
export class GaugePanelComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('GaugePanelComponent Created!');
	}
}
