import { Component, Optional } from '@angular/core';
import { MicroMockService } from '@cui-x-views/mock';

import { environment } from '@environment';
import * as _ from 'lodash';

/**
 * Main Header Component
 */
@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class HeaderComponent {

	/**
	 * Whether we show the mocking interface
	 */
	public mocking = _.get(environment, 'mock');
	public recordingClass: 'negative' | 'gray-ghost' = 'gray-ghost';
	private isRecording = false;
	private recordBtnInterval: NodeJS.Timer;

	constructor (
		@Optional() private mockService: MicroMockService,
	) { }

	/**
	 * Open the settings for the mock component
	 */
	public openMockModal () {
		this.mockService.promptMockSettings();
	}

	/**
	 * Start recording clicks and generate a test case
	 */
	public record () {
		this.isRecording = !this.isRecording;
		if (this.isRecording) {
			this.recordBtnInterval = setInterval(() => {
				this.recordingClass = this.recordingClass === 'negative'
					? 'gray-ghost' : 'negative';
			}, 1000);
		} else {
			this.recordingClass = 'gray-ghost';
			clearInterval(this.recordBtnInterval);
		}
		this.mockService.record(this.isRecording);
	}
}
