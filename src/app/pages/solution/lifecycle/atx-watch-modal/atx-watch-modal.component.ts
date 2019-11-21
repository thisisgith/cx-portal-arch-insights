import { Component, OnInit } from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface AtxWatchData {
	src: string;
	title?: string;
}

@Component({
	selector: 'atx-watch-modal',
	styleUrls: ['./atx-watch-modal.component.scss'],
	templateUrl: './atx-watch-modal.component.html',
})
export class AtxWatchModalComponent implements OnInit {
	public data: AtxWatchData;

	public src: SafeResourceUrl = '';
	public title;

	constructor (
		private cuiModalService: CuiModalService,
		private sanitizer: DomSanitizer,
	) { }

	/**
	 * Lifecycle On Init. Set src based on passed-in data
	 */
	public ngOnInit () {
		this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.src);
		this.title = this.data.title || '';
	}
}
