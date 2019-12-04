import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';
import playerLoader from '@brightcove/player-loader';
import { LogService } from '@cisco-ngx/cui-services';

interface AtxWatchData {
	src: BrightcovePlayerData;
	title?: string;
}

export interface BrightcovePlayerData {
	playerId: string;
	accountId: string;
	videoId: string;
}

@Component({
	selector: 'atx-watch-modal',
	styleUrls: ['./atx-watch-modal.component.scss'],
	templateUrl: './atx-watch-modal.component.html',
})
export class AtxWatchModalComponent implements OnInit, AfterViewInit {
	@ViewChild('videoPlayer', { static: false }) public videoPlayerRef: ElementRef;
	public data: AtxWatchData;
	public playerId: string;
	public accountId: string;
	public videoId: string;

	constructor (
		public cuiModalService: CuiModalService,
		private logger: LogService,
	) { }

	/**
	 * Lifecycle On Init. Set player info based on passed-in data
	 */
	public ngOnInit () {
		const videoInfo: BrightcovePlayerData = this.data.src;
		if (videoInfo) {
			this.playerId = videoInfo.playerId;
			this.accountId = videoInfo.accountId;
			this.videoId = videoInfo.videoId;
		}
	}

	/**
	 * Lifecycle After view init. Load the brightcove player and autoplay
	 */
	public ngAfterViewInit () {
		playerLoader({
			refNode: this.videoPlayerRef.nativeElement,
			refNodeInsert: 'append',
			playerId: this.playerId,
			accountId: this.accountId,
			videoId: this.videoId,
		})
		.then(success => {
			const player = success.ref;
			player.on('loadedmetadata', player.play);
		})
		.catch(err => {
			this.logger.error(`atx-watch-modal.component : brightcoverPlayerLoader :: Error - ${err}`);
		});
	}
}
