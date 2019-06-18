import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { HardwareInfo } from '@cui-x/sdp-api';
import { CuiTimelineItem } from '@cisco-ngx/cui-components';

import * as _ from 'lodash';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Asset Details Component
 */
@Component({
	selector: 'asset-activity',
	styleUrls: ['./activity.component.scss'],
	templateUrl: './activity.component.html',
})
export class AssetActivityComponent implements OnInit, OnChanges {

	@Input() public asset: HardwareInfo;
	@ViewChild('timelineItem', { static: true }) private timelineItemTemplate: TemplateRef<{ }>;

	public status = {
		loading: {
			timeline: false,
		},
	};

	public hidden = true;
	public fullscreen = false;

	public timelineData: CuiTimelineItem[];

	constructor (
		private logger: LogService,
	) { }

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.refresh();
		}
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		this.fetchTimeline();
	}

	/**
	 *  Fetch data for timeline
	 */
	private fetchTimeline () {
		// placeholder for data in Activity tab until API is planned
		const item = new CuiTimelineItem({
			data: {
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
				sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
				Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris \
				nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in \
				reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla \
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in \
				culpa qui officia deserunt mollit anim id est laborum.',
				title: 'Title',
			},
			template: this.timelineItemTemplate,
			time: new Date(),
		});

		const timelineData = [];
		for (let i = 0; i < 6; i += 1) {
			timelineData.push(item);
		}

		// Later replace with API call
		this.timelineData = timelineData;
	}

	/**
	 * Toggle fullscreen details
	 */
	public toggleFullscreen () {
		this.fullscreen = !this.fullscreen;
	}
}
