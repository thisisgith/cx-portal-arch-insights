import {
	Component,
	OnInit,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { OSVService } from '@sdp-api';

/**
 * SoftwareGroupDetail Component
 */
@Component({
	selector: 'app-software-group-detail',
	styleUrls: ['./software-group-detail.component.scss'],
	templateUrl: './software-group-detail.component.html',
})
export class SoftwareGroupDetailComponent implements OnInit {
	constructor (
		private logger: LogService,
		private osvService: OSVService,
	) {
		this.logger.debug('SoftwareGroupDetailComponent Created!');
	}

	/**
	 * Initialization hook
	 */
	public ngOnInit () {

	}

}
