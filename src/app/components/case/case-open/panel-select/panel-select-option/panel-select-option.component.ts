import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Represents a single panel select option
 */
@Component({
	selector: 'panel-select-option',
	template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class PanelSelectOptionComponent<T> {
	@ViewChild(TemplateRef, { static: true }) public content: TemplateRef<any>;
	@Input() public value: T;

	public selected = false;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('PanelSelectOptionComponent Created!');
	}
}
