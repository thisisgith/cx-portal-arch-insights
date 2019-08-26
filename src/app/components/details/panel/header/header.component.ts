import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { DetailsPanelStackService } from '@services';

/**
 * Component representing 360 details pan./header.component
 */
@Component({
	selector: 'details-panel-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class DetailsPanelHeaderComponent {
	@ViewChild(TemplateRef, { static: true }) public content: TemplateRef<any>;
	@Input('fullscreen') public fullscreen = false;
	@Input('fullscreenToggle') public fullscreenToggle = true;
	@Output('close') public close = new EventEmitter<boolean>();
	@Output('back') public back = new EventEmitter<boolean>();
	@Output('fullscreenChange') public fullscreenChange = new EventEmitter<boolean>();

	constructor (
		private detailsPanelStackService: DetailsPanelStackService,
	) { }

	get canGoBack () {
		return this.detailsPanelStackService.canGoBack();
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

	public backDetails () {
		this.back.emit(true);
	}
}
