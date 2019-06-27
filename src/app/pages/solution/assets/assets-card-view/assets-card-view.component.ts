import {
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
	Input,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { HardwareInfo } from '@cui-x/sdp-api';

/**
 * Main component for the Assets Bubble Chart
 */
@Component({
	selector: 'assets-card-view',
	styleUrls: ['./assets-card-view.component.scss'],
	templateUrl: './assets-card-view.component.html',
})
export class AssetsCardViewComponent implements OnInit {

	@Input() public data: any;
	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetsCardViewComponent Created!');
	}

	public ngOnInit () {
		console.log(this.data)
	}

}
