import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import {
	SolutionService,
	WebinarResults,
	RacetrackResponseObject,
	RacetrackPitstop,
} from '@services';
import { Webinar } from '@interfaces';
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
	public visiblePanelContext: any;
	public visibleTemplate: TemplateRef<{ }>;
	public visibleContext: any;

	public webinarResults: WebinarResults;
	public recommendedATX: Webinar;

	public racetrackResults: RacetrackResponseObject;
	public currentPitstop: RacetrackPitstop;

	public status = {
		modalHidden: true,
		panelHidden: true,
		racetrackLoading: true,
		webinarsLoading: true,
	};

	constructor (
		private logger: LogService,
		private service: SolutionService,
	) { }

	/**
	 * Determines which modal to display
	 * @param type the modal template to display
	 */
	public showModal (type: string) {
		this.visibleTemplate = (type === 'webinars') ? this.webinarTemplate : this.coachingTemplate;
		this.visibleContext = this.webinarResults;
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
	public getWebinars () {
		this.status.webinarsLoading = true;
		this.service.queryWebinars()
		.subscribe((results: WebinarResults) => {
			this.webinarResults = results;
			this.status.webinarsLoading = false;
			this.recommendedATX = results.webinars[0];
		},
		err => {
			this.status.webinarsLoading = false;
			this.logger.error(`lifecycle.component : getWebinars() :: Error : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * Performs the API call to retrieve Racetrack information
	 * and populates racetrack tabs
	 */
	public getRacetrackInfo () {
		this.status.racetrackLoading = true;
		this.service.queryRacetrack()
		.subscribe((results: RacetrackResponseObject) => {
			this.racetrackResults = results;
			this.status.racetrackLoading = false;
			this.currentPitstop = _.get(this.racetrackResults,
				'solutions[0].technologies[0].pitstops[0]');
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
		this.getWebinars();
		this.getRacetrackInfo();
	}
}
