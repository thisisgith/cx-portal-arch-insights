import {
	Component,
	SimpleChanges,
	Input,
	OnInit,
	OnChanges,
	Output,
	EventEmitter,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	CriticalBug, DiagnosticsService, CriticalBugsResponse,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Bug Details Component
 */
@Component({
	selector: 'bug-details',
	templateUrl: './bug-details.component.html',
})
export class BugDetailsComponent implements OnInit, OnChanges {

	@Input('id') public id: string;
	@Input('advisory') public advisory: CriticalBug;
	@Input('customerId') public customerId: string;
	@Output('details') public details = new EventEmitter<CriticalBug>();

	private params: DiagnosticsService.GetCriticalBugsParams;

	public data: CriticalBug = { };
	public isLoading = false;

	constructor (
		private logger: LogService,
		private diagnosticsService: DiagnosticsService,
	) { }

	/**
	 * Retrieves the bug
	 * @returns the data
	 */
	private getBug () {
		if (this.advisory) {
			this.data = this.advisory;

			return of(this.data);
		}

		return this.diagnosticsService.getCriticalBugs(this.params)
		.pipe(
			map((response: CriticalBugsResponse) => {
				this.data = _.head(_.get(response, 'data', []));
			}),
			catchError(err => {
				this.logger.error('bug-details.component : getBug() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Refresh Function
	 */
	public refresh () {
		if (this.id) {
			this.isLoading = true;
			this.params = {
				customerId: this.customerId,
				id: this.id,
				page: 1,
				rows: 1,
			};

			this.getBug()
			.subscribe(() => {
				this.isLoading = false;
				this.details.emit(this.data);
			});
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentId = _.get(changes, ['id', 'currentValue']);
		if (currentId && !changes.id.firstChange) {
			this.refresh();
		}
	}
}
