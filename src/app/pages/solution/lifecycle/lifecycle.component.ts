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
	RacetrackPitstopAction,
	PitstopActionUpdateResponse,
	PitstopActionUpdateRequest,
} from '@cui-x/sdp-api';

import * as _ from 'lodash';

/**
 * Interface representing combine a seletable status with PitstopAction
 */
export interface PitstopActionWithStatus {
	selected: boolean;
	action: RacetrackPitstopAction;
}

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
	public customerId = '2431199';

	public currentPitCompActPct = '0%';
	public currentPitActionsWithStatus: PitstopActionWithStatus[];
	public suggestedAction: string;

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
	 * @param suggested_action string
	 */
	public getATX (suggested_action: string) {
		this.status.webinarsLoading = true;
		const params: RacetrackContentService.GetRacetrackATXParams = {
			customerId: this.customerId,
			pitstop: 'Onboard',
			solution: 'ibn',
			suggestedAction: suggested_action !== '' ? suggested_action : null,
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
			customerId: this.customerId,
		};
		this.racetrackService.getRacetrack(params)
		.subscribe((results: RacetrackResponse) => {
			this.racetrackResults = results;
			const technology: RacetrackTechnology =
				_.get(this.racetrackResults, 'solutions[0].technologies[0]', null);
			if (technology) {
				const currentPitstop = technology.currentPitstop;
				this.currentPitstop = _.find(technology.pitstops, { name: currentPitstop });
				this.currentPitCompActPct = this.calculateActionPercentage(this.currentPitstop);
				this.suggestedAction = _.find(this.currentPitstop.pitstopActions,
					{ isComplete: false }).name;
				this.currentPitActionsWithStatus = _.map(
					this.currentPitstop.pitstopActions, (pitstopAction: RacetrackPitstopAction) =>
					({
						action: pitstopAction,
						selected: false,
					}));
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
	 * function to show action description
	 * @param actionWithStatus the pitstopAction has been selected
	 */
	public selectAction (actionWithStatus: PitstopActionWithStatus) {
		if (!actionWithStatus.selected) {
			this.resetSelectStatus();
			actionWithStatus.selected = !actionWithStatus.selected;
		} else {
			actionWithStatus.selected = !actionWithStatus.selected;
		}
		// If suggestedAction changes, refresh ATX, ACC and others
		if (this.suggestedAction !== actionWithStatus.action.name) {
			this.suggestedAction = actionWithStatus.action.name;
			this.getATX(this.suggestedAction);
		}
	}

	/**
	 * function to call Racetrack API to complete an Action
	 * @param action the action to complete
	 */
	public completeAction (action: PitstopActionWithStatus) {
		// Call racetrack API to complete an action
		this.status.racetrackLoading = true;
		this.resetSelectStatus();
		const actionUpdated: PitstopActionUpdateRequest = {
			actionComplete: true,
			pitstop: 'Onboard',
			pitstopAction: action.action.name,
			solution: 'ibn',
			technology: 'Wireless Assurance',
		};
		const params: RacetrackService.UpdatePitstopActionParams = {
			actionUpdate: actionUpdated,
			customerId: this.customerId,
		};
		this.racetrackService.updatePitstopAction(params)
		.subscribe((results: PitstopActionUpdateResponse) => {
			if (results.isAtxChanged) {
				this.getATX(this.suggestedAction);
			}
			// check other fileds in results too to update other panel
		},
		err => {
			this.status.racetrackLoading = false;
			this.logger.error(`lifecycle.component : completeAction() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}
	/**
	 * private utility function to clear out seleted status
	 */
	private resetSelectStatus () {
		for (const pitstop of this.currentPitActionsWithStatus) {
			pitstop.selected = false;
		}
	}

	/**
	 * private function to cacluate completed percentage function
	 * @param pitstop the current pitstop
	 * @returns pertage string
	 */
	private calculateActionPercentage (pitstop: RacetrackPitstop) {
		if (pitstop) {
			const completedActions = _.filter(pitstop.pitstopActions, 'isComplete').length;
			const pct = Math.floor(
				(completedActions / pitstop.pitstopActions.length) * 100) || 0;

			return `${pct.toString()}%`;
		}

		 return '0%';
	}

	/**
	 * Function which will get webinar data on page load
	 */
	public ngOnInit () {
		this.getRacetrackInfo();
		this.getATX(this.suggestedAction);
	}
}
