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
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Interface which represents our tabs
 */
interface Tab {
	description: string;
	image?: {
		alt: string;
		src: string;
	};
	key: string;
	selected: boolean;
	template: TemplateRef<{ }>;
	title: string;
}

/**
 * Lifecycle Solution Component
 */
@Component({
	styleUrls: ['./lifecycle.component.scss'],
	templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent implements OnInit {
	@ViewChild('coaching') public coachingTemplate: TemplateRef<{ }>;
	@ViewChild('webinars') public webinarTemplate: TemplateRef<{ }>;
	@ViewChild('webinarPanel') public webinarPanel: TemplateRef<{ }>;
	@ViewChild('productDocTab') public productTabTemplate: TemplateRef<{ }>;
	@ViewChild('supportHelpTab') public supportTabTemplate: TemplateRef<{ }>;

	public visiblePanel: TemplateRef<{ }>;
	public visibleTemplate: TemplateRef<{ }>;
	public visibleContext: WebinarResults;

	public showScheduled = true;
	public showRecommended = true;
	public showCourses = true;
	public showCertifications = true;

	public webinarResults: WebinarResults;
	public racetrackResults: RacetrackResponseObject;
	public currentPitstop: RacetrackPitstop;

	public tabs: Tab[];
	public currentTab: Tab;

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
	 * Selects a tab from our list of tabs
	 * @param tab the tab we're selecting
	 */
	public selectTab (tab: Tab) {
		this.tabs.forEach((t: Tab) => {
			t.selected = false;
		});

		tab.selected = true;
		this.currentTab = tab;
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
		},
		err => {
			this.status.racetrackLoading = false;
			this.logger.error(`lifecycle.component : getRacetrackInfo() :: Error  : (${
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
		this.tabs = [
			{
				description: I18n.get('_InteractiveTraining_'),
				image: {
					alt: I18n.get('_Handshake_'),
					src: 'assets/img/solutions/support.png',
				},
				key: 'support',
				selected: true,
				template: this.supportTabTemplate,
				title: I18n.get('_SupportHelp_'),
			},
			{
				description: I18n.get('_YourProducts_'),
				image: {
					alt: I18n.get('_Handshake_'),
					src: 'assets/img/solutions/infinity.png',
				},
				key: 'product',
				selected: false,
				template: this.productTabTemplate,
				title: I18n.get('_ProductDocumentation_'),
			},
		];
		this.currentTab = this.tabs[0];
		this.getWebinars();
		this.getRacetrackInfo();
	}
}
