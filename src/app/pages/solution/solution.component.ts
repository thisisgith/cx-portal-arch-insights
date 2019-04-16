import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Solution Page Component
 */
@Component({
	selector: 'app-solution',
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('SolutionComponent Created!');
	}

	public showScheduled = false;
	public showRecommended = false;
	public showCourses = false;
	public showCertifications = false;
}
