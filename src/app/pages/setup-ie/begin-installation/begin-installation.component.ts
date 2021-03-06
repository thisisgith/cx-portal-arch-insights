import { Component, HostListener, EventEmitter, Output } from '@angular/core';
import { SetupStep } from '@interfaces';
import { KEY_CODES } from '@classes';
import { environment } from '@environment';

/**
 * Component to prompt beginning of IE installation
 */
@Component({
	selector: 'app-begin-installation',
	styleUrls: ['./begin-installation.component.scss'],
	templateUrl: './begin-installation.component.html',
})
export class BeginInstallationComponent implements SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();
	public collectorOverviewLink = environment.collectorOverview;

	/**
	 * Fired when "Begin Installation" is clicked
	 */
	public onBegin () {
		this.onStepComplete.emit();
	}

	/**
	 * Opens a new tab to view Collector Overview
	 */
	public openCollectorOverview () {
		window.open(this.collectorOverviewLink, '_blank');
	}

	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	@HostListener('window:keyup', ['$event'])
	public keyEvent (event: KeyboardEvent) {
		if (event.keyCode === KEY_CODES.ENTER) {
			this.onBegin();
		}
	}
}
