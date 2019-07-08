import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Component representing 360 details panel header area
 */
@Component({
	selector: 'app-panel360-header',
	styleUrls: ['./panel360-header.component.scss'],
	templateUrl: './panel360-header.component.html',
})
export class Panel360HeaderComponent {
	@ViewChild(TemplateRef, { static: true }) public content: TemplateRef<any>;
	@Input('fullscreen') public fullscreen = false;
	@Output('close') public close = new EventEmitter<boolean>();
	@Output('fullscreenChange') public fullscreenChange = new EventEmitter<boolean>();

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('Panel360HeaderComponent Created!');
	}

	/**
	 * determine if fullscreen from child data
	 */
	public toggleFullscreen () {
		this.fullscreen = !this.fullscreen;
		this.fullscreenChange.emit(this.fullscreen);
	}

	/**
	 * determine if close from child data
	 */
	public closeDetails () {
		this.close.emit(true);
	}
}
