import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
 } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { SolutionService, WebinarResults } from '@services';

/**
 * Main Solution Page Component
 */
@Component({
	selector: 'app-solution',
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit {
	@ViewChild('coaching') public coachingTemplate: TemplateRef<{ }>;
	@ViewChild('webinars') public webinarTemplate: TemplateRef<{ }>;

	public visibleTemplate: TemplateRef<{ }>;
	public visibleContext: WebinarResults;

	public showScheduled = false;
	public showRecommended = false;
	public showCourses = false;
	public showCertifications = false;
	// supportTab is the default open racetrack tab
	public showSupportTab = true;
	public showProductTab = false;
	public webinarResults: WebinarResults;
	public webinarWaiting = true;

	public status = {
		hidden: true,
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
		this.status.hidden = false;
	}

	/**
	 * Closes the currently open modal
	 */
	public closeModal () {
		this.status.hidden = true;
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
		this.webinarWaiting = true;
		this.service.queryWebinars()
		.subscribe((results: WebinarResults) => {
			this.webinarResults = results;
		},
		err => {
			this.logger.error(`solution.component : getWebinars() :: Error : (${
				err.status}) ${err.message}`);
		},
		() => {
			this.webinarWaiting = false;
		});
	}

	/**
	 * Function which will get webinar data on page load
	 */
	public ngOnInit () {
		this.getWebinars();
	}
}
