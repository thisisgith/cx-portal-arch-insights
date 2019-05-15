import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import {
	RacetrackService,
	RacetrackContentService,
	RacetrackResponse,
	RacetrackPitstop,
	ATXResponse,
	ATX,
	ATXSession,
	RacetrackTechnology,
} from '@cui-x/sdp-api';

import * as _ from 'lodash';

/**
 * Lifecycle Solution component
 */
@Component({
	styleUrls: ['./lifecycle.component.scss'],
	templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent implements OnInit {
	@ViewChild('coaching') public coachingTemplate: TemplateRef<{ }>;
	@ViewChild('webinars') public webinarTemplate: TemplateRef<{ }>;
	@ViewChild('webinarPanel') public webinarPanel: TemplateRef<{ }>;

	public visiblePanel: TemplateRef<{ }>;
	public visibleTemplate: TemplateRef<{ }>;
	public visibleContext: any;

	public atxResults: ATXResponse;
	public recommendedATX: ATX;

	public racetrackResults: RacetrackResponse;
	public currentPitstop: RacetrackPitstop;
	public atxCardOpened = false;
	public sessionSelected: ATXSession;

	public status = {
		modalHidden: true,
		panelHidden: true,
		racetrackLoading: true,
		webinarsLoading: true,
	};

	constructor (
		private logger: LogService,
		private racetrackService: RacetrackService,
		private racetrackContentService: RacetrackContentService,
	) { }

	/**
	 * Determines which modal to display
	 * @param type the modal template to display
	 */
	public showModal (type: string) {
		this.visibleTemplate = (type === 'webinars') ? this.webinarTemplate : this.coachingTemplate;
		this.visibleContext = this.atxResults;
		this.status.modalHidden = false;
	}

	/**
	 * Closes the currently open modal
	 */
	public closeModal () {
		this.status.modalHidden = true;
	}

	/**
	 * Performs the API call to retrieve Interactive Webinar data
	 */
	public getATX () {
		this.status.webinarsLoading = true;
		const params: RacetrackContentService.GetRacetrackATXParams = {
			customerId: '2431199',
			pitstop: 'Onboard',
			solution: 'ibn',
			usecase: 'Wireless Assurance',
		};
		this.racetrackContentService.getRacetrackATX(params)
			.subscribe((results: ATXResponse) => {
				this.atxResults = results;
				this.status.webinarsLoading = false;
				this.recommendedATX = results.items[0];
			},
				err => {
					this.status.webinarsLoading = false;
					this.logger.error(`lifecycle.component : getATX() :: Error : (${
						err.status}) ${err.message}`);
				});
	}

	/**
	 * Click to open ATX card to view the sessions
	 */
	public openATXSchedule () {
		this.atxCardOpened = true;
	}

	/**
	 * Close the ATX detail card
	 */
	public closeAtxCard () {
		this.atxCardOpened = false;
	}

	/**
	 * Select the session to view on Click the row
	 * @param session the session row on click
	 */
	public selectSession (session: ATXSession) {
		this.sessionSelected = session;
	}

	/**
	 * API calls the Racetrack Info
	 */
	public getRacetrackInfo () {
		this.status.racetrackLoading = true;
		const params: RacetrackService.GetRacetrackParams = {
			customerId: '2431199',
		};
		this.racetrackService.getRacetrack(params)
		.subscribe((results: RacetrackResponse) => {
			this.racetrackResults = results;
			const technology: RacetrackTechnology =
			this.racetrackResults ? this.racetrackResults.solutions[0].technologies[0] : null;
			if (technology) {
				const currentPitstop = technology.currentPitstop;
				this.currentPitstop = _.find(technology.pitstops, { name: currentPitstop });
			} else {
				this.currentPitstop = null;
			}
			this.status.racetrackLoading = false;
		},
		err => {
			this.status.racetrackLoading = false;
			this.logger.error(`lifecycle.component : getRacetrackInfo() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * Function which will get webinar data on page load
	 */
	public ngOnInit () {
		this.getATX();
		this.getRacetrackInfo();
	}
}
