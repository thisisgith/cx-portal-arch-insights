import {
	Component,
	SimpleChanges,
	Input,
	OnInit,
	OnChanges,
	Output,
	EventEmitter,
	OnDestroy,
} from '@angular/core';
import * as _ from 'lodash-es';
import {
	Asset,
	CriticalBug,
	NetworkElement,
	DiagnosticsService,
	CriticalBugsResponse,
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';
import {
	map,
	catchError,
	takeUntil,
} from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { Alert } from '@interfaces';
import { RacetrackInfoService } from '@services';

/** Data Interface */
export interface Data {
	advisory?: CriticalBug;
}

/**
 * Bug Details Component
 */
@Component({
	selector: 'bug-details',
	styleUrls: ['./bug-details.component.scss'],
	templateUrl: './bug-details.component.html',
})
export class BugDetailsComponent implements OnInit, OnChanges, OnDestroy {

	@Input('id') public id: string;
	@Input('advisory') public advisory: CriticalBug;
	@Input('customerId') public customerId: string;
	@Output('details') public details = new EventEmitter<Data>();
	@Output('alert') public alertMessage = new EventEmitter<Alert>();
	@Output('assets') public assets = new EventEmitter<{
		impacted: (Asset | NetworkElement)[];
		potentiallyImpacted: (Asset | NetworkElement)[];
	}>();

	private params: DiagnosticsService.GetCriticalBugsParams;

	public data: Data = { };
	public activeTab = 0;
	public impactedCount = 0;
	public isLoading = false;
	private destroyed$: Subject<void> = new Subject<void>();
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	constructor (
		private logger: LogService,
		private diagnosticsService: DiagnosticsService,
		private racetrackInfoService: RacetrackInfoService,
	) { }

	/**
	 * Retrieves the bug
	 * @returns the data
	 */
	private getBug () {
		if (this.advisory) {
			_.set(this.data, 'advisory', this.advisory);

			return of({ });
		}

		return this.diagnosticsService.getCriticalBugs(this.params)
		.pipe(
			map((response: CriticalBugsResponse) => {
				this.data = {
					advisory: _.head(_.get(response, 'data', [])),
				};
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
		this.data = { };
		this.impactedCount = 0;
		this.activeTab = 0;
		if (this.id) {
			this.isLoading = true;
			this.params = {
				cdetsId: [this.id],
				customerId: this.customerId,
				page: 1,
				rows: 1,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
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
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.refresh();
			}
		});
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

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
