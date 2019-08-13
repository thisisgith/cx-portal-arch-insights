import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, switchMap, tap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash-es';

import { LogService } from '@cisco-ngx/cui-services';
import { CaseService } from '@cui-x/services';
import { CaseRequestType } from '@classes';
import { ProblemArea, Subtech, Tech } from '@interfaces';

/**
 * Mini sub-form component for filling in tech/subtech/problem code.
 * Can be registered as a control in a larger form
 */
@Component({
	selector: 'tech-form',
	templateUrl: './tech-form.component.html',
})
export class TechFormComponent implements OnInit, OnChanges, OnDestroy {
	@Input() public requestRma?: boolean;
	@Output() private formReady: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	public form: FormGroup;

	public loadingTech = false;
	public loadingSubtech = false;
	public loadingProblemAreas = false;
	public techOptions: Tech[];
	public subtechOptions: Subtech[];
	public problemAreaOptions: ProblemArea[];
	public problemGroups: string[];

	private refreshProblemArea$ = new Subject<CaseRequestType>();
	private refreshSubtech$ = new Subject<string>();
	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService,
		private logger: LogService,
	) {
		this.form = new FormGroup({
			problemArea: new FormControl(null, Validators.required),
			subtech: new FormControl(null, Validators.required),
			technology: new FormControl(null, Validators.required),
		});
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.formReady.emit(this.form);
		this.fetchTechList();
		this.subscribeSubtech();
		this.subscribeProblemArea();
	}

	/**
	 * OnChanges lifecycle hook
	 * When requestRma changes, update problem area options
	 * @param changes simple changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		if (changes.requestRma) {
			this.refreshProblemArea$.next(
				this.requestRma ? CaseRequestType.RMA : CaseRequestType.Diagnose,
			);
		}
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Fetch select options for tech/problem area from APIs
	 */
	private fetchTechList () {
		this.loadingTech = true;
		this.caseService.fetchTechList()
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Tech :: Error ${err}`);

					return of(null);
				}),
				takeUntil(this.destroy$),
			)
			.subscribe(result => {
				this.loadingTech = false;
				this.techOptions = _.get(result, 'techList');
			});
	}

	/**
	 * Fetch subtech options for a particular tech
	 * @param techId tech id to fetch subtechs for
	 * @returns Observable with results
	 */
	private fetchSubtechList (techId: string): Observable<{ subTechList: Subtech[] }> {
		return this.caseService.fetchSubTechList(techId)
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Subtech :: Error ${err}`);

					return of(null);
				}),
			);
	}

	/**
	 * API request to get problem areas
	 * @param requestType fetch "diagnose" or "rma" problem areas
	 * @returns Observable with result
	 */
	private fetchProblemAreas (requestType: CaseRequestType) {
		return this.caseService.fetchProblemArea(requestType)
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Problem Area :: Error ${err}`);

					return of(null);
				}),
				takeUntil(this.destroy$),
			);
	}

	/**
	 * Subscribe and listen for tech to change, refresh subtech options
	 */
	private subscribeSubtech () {
		this.refreshSubtech$.pipe(
			tap(() => this.loadingSubtech = true),
			switchMap(techId => this.fetchSubtechList(techId)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingSubtech = false;
			this.subtechOptions = result.subTechList;
		});

		this.form.controls.technology.valueChanges.pipe(
			tap(() => this.form.controls.subtech.setValue(null)),
			takeUntil(this.destroy$),
		)
		.subscribe((tech: Tech) => {
			this.refreshSubtech$.next(tech._id);
		});
	}

	/**
	 * Listen for "Request RMA" change and update problem area options
	 */
	private subscribeProblemArea () {
		this.refreshProblemArea$.pipe(
			tap(() => {
				this.loadingProblemAreas = true;
				this.form.controls.problemArea.setValue(null);
			}),
			switchMap(type => this.fetchProblemAreas(type)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingProblemAreas = false;
			// If a subtech is selected, filter the problemAreas to only valid ones for that subtech
			if (this.form.controls.subtech.value) {
				const validCodes = this.form.controls.subtech.value.problemCodes;
				result.problemArea.customerActivities =
					_.filter(result.problemArea.customerActivities, activity =>
						_.includes(validCodes, activity.problemCode),
					);
			}
			const problemAreasGrouped = _.groupBy(
				_.get(result, ['problemArea', 'customerActivities'], []),
				'customerActivity',
			);
			this.problemAreaOptions = Object.values(problemAreasGrouped);
			this.problemGroups = Object.keys(problemAreasGrouped);
		});
		// Listen for "subTech" to change, update problem areas.
		this.form.controls.subtech.valueChanges.pipe(
			map(() => this.requestRma),
			takeUntil(this.destroy$),
		)
		.subscribe((rma: boolean) => {
			this.refreshProblemArea$.next(rma ? CaseRequestType.RMA : CaseRequestType.Diagnose);
		});
	}
}
