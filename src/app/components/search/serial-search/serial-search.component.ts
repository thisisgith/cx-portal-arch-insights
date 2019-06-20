import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	Output,
	OnInit,
	TemplateRef,
	ViewChild,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { SpecialSearchComponent } from '../special-search/special-search.component';

/**
 * A Component to house the search results by serial number
 */
@Component({
	providers: [{
		provide: SpecialSearchComponent,
		useExisting: forwardRef(() => SerialSearchComponent,
	)}],
	selector: 'serial-search',
	styleUrls: ['./serial-search.component.scss'],
	templateUrl: './serial-search.component.html',
})
export class SerialSearchComponent extends SpecialSearchComponent implements OnInit {
	@ViewChild('sidebar', { static: true, read: TemplateRef })
		public sidebarContent: TemplateRef<any>;
	@Input('serialNumber') public serialNumber: string;
	@Output('hide') public hide = new EventEmitter<boolean>();
	public loading = true;

	constructor (
		private logger: LogService,
	) {
		super();
		this.logger.debug('SerialSearchComponent Created!');
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.loading = false;
	}
}
