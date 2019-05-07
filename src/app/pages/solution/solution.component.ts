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

/**
 * Main Solution Page Component
 */
@Component({
	selector: 'app-solution',
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit {
	@ViewChild('coaching') public coachingTemplate: TemplateRef<any>;
	@ViewChild('webinars') public webinarTemplate: TemplateRef<any>;
	@ViewChild('webinarPanel') public webinarPanel: TemplateRef<any>;

	public visiblePanel: TemplateRef<any>;
	public visiblePanelContext: any;
	public visibleTemplate: TemplateRef<any>;
	public visibleContext: any;

	public showScheduled = true;
	public showRecommended = true;
	public showCourses = true;
	public showCertifications = true;
	// supportTab is the default open racetrack tab
	public showSupportTab = true;
	public showProductTab = false;

	public webinarResults: WebinarResults;
	public racetrackResults: RacetrackResponseObject;
	public currentPitstop: RacetrackPitstop;

	public status = {
		modalHidden: true,
		panelHidden: true,
		waiting: true,
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
		this.visibleContext = (type === 'webinars') ? this.webinarResults : this.webinarResults;
		this.status.modalHidden = false;
	}

	/**
	 * Closes the currently open modal
	 */
	public closeModal () {
		this.status.modalHidden = true;
	}

	/**
	 * Opens the support help tab
	 */
	public toggleSupportTab () {
		this.showSupportTab = true;
		this.showProductTab = false;
	}

	/**
	 * Opens the product docs tab
	 */
	public toggleProductTab () {
		this.showProductTab = true;
		this.showSupportTab = false;
	}

	/**
	 * Performs the API call to retrieve Interactive Webinar data
	 */
	public getWebinars () {
		this.status.waiting = true;
		this.service.queryWebinars()
		.subscribe((results: WebinarResults) => {
			this.webinarResults = results;
		},
		err => {
			this.logger.error(`solution.component : getWebinars() :: Error : (${
				err.status}) ${err.message}`);
		},
		() => {
			this.status.waiting = false;
		});
	}

	/**
	 * Performs the API call to retrieve Racetrack information
	 * and populates racetrack tabs
	 */
	public getRacetrackInfo () {
		this.service.queryRacetrack()
		.subscribe((results: RacetrackResponseObject) => {
			this.racetrackResults = results;
		},
		err => {
			this.logger.error(`solution.component : getRacetrackInfo() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * Sets this components current pitstop
	 * @param currentPitstop the current pitstop
	 */
	public onTechChange (currentPitstop: RacetrackPitstop) {
		this.currentPitstop = currentPitstop;
	}

	/**
	 * Function which will get webinar data on page load
	 */
	public ngOnInit () {
		this.getWebinars();
		this.getRacetrackInfo();
	}
}
