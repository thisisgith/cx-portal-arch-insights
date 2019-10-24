import {
	Component,
	ChangeDetectorRef,
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
import { catchError, switchMap, tap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash-es';

import { LogService } from '@cisco-ngx/cui-services';
import { CaseClassifyResponse, CaseService } from '@cui-x/services';
import { CaseRequestType } from '@classes';
import { ProblemArea, Subtech, Tech } from '@interfaces';
import { environment } from '@environment';

/**
 * Mini sub-form component for filling in tech/subtech/problem code.
 * Can be registered as a control in a larger form
 */
@Component({
	selector: 'tech-form',
	styleUrls: ['./tech-form.component.scss'],
	templateUrl: './tech-form.component.html',
})
export class TechFormComponent implements OnInit, OnChanges, OnDestroy {
	@Input() public requestRma?: boolean;
	@Input() public suggestionTitle?: string;
	@Input() public suggestionDescription?: string;
	@Output() private formReady: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	public form: FormGroup;
	public suggestedForm: FormGroup;

	public loadingTech = false;
	public loadingSubtech = false;
	public loadingProblemAreas = false;
	public loadingSuggestions = false;
	public techOptions: Tech[];
	public subtechOptions: Subtech[];
	public problemAreaOptions: ProblemArea[];
	public problemGroups: string[];
	public displayAll = false;
	public displaySuggestions = true;
	public recommendedTechs: CaseClassifyResponse['predictions'];

	private refreshProblemArea$ = new Subject<CaseRequestType>();
	private refreshSubtech$ = new Subject<string>();
	private refreshPredictions$ = new Subject<{ caseTitle: string, caseDescription: string }>();
	private destroy$ = new Subject();
	public isTechSuggestionSelected = false;

	constructor (
		private caseService: CaseService,
		private cdr: ChangeDetectorRef,
		private logger: LogService,
	) {
		this.form = new FormGroup({
			problemArea: new FormControl({ value: null, disabled: true }, Validators.required),
			subtech: new FormControl({ value: null, disabled: true }, Validators.required),
			suggestedTech: new FormControl(null),
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
		this.subscribePredictions();
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
	 * When all tech options are collapsed, show suggested
	 */
	public showAllCollapse () {
		this.displaySuggestions = true;
	}

	/**
	 * When suggested tech options are collapsed, show all
	 */
	public showSuggestionsCollapse () {
		this.displayAll = true;
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
			if (tech) {
				this.form.controls.subtech.enable();
				this.refreshSubtech$.next(tech._id);
			} else {
				this.form.controls.subtech.disable();
			}
		});
	}

	/**
	 * Listen for subtech change and update problem area options
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
			if (this.form.controls.subtech.value && this.form.controls.subtech.value.problemCodes) {
				const validCodes = this.form.controls.subtech.value.problemCodes;
				result.problemArea.customerActivities =
					_.filter(result.problemArea.customerActivities, activity =>
						_.includes(validCodes, activity.problemCode),
					);
			}
			let problemAreasGrouped = _.groupBy(
				_.get(result, ['problemArea', 'customerActivities'], []),
				'customerActivity',
			);
			/* Sort problem codes alphabetically for each group */
			problemAreasGrouped =
				_.mapValues(problemAreasGrouped, group => _.sortBy(group, 'problemCodeName'));
			/* Sort groups by Customer Activity alphabetically */
			this.problemAreaOptions =
				_.sortBy(Object.values(problemAreasGrouped), o =>
					_.get(o, [0, 'customerActivity'], ''));
			this.problemGroups = Object.keys(problemAreasGrouped)
				.sort();
			if (window.Cypress) {
				window.cyProblemAreaCode = problemAreasGrouped;
			}
		});
		// Listen for "subTech" to change, update problem areas.
		this.form.controls.subtech.valueChanges.pipe(
			tap(subtech => {
				if (subtech) {
					this.form.controls.problemArea.enable();
				} else {
					this.form.controls.problemArea.disable();
					this.form.controls.problemArea.setValue(null);
				}
			}),
			takeUntil(this.destroy$),
		)
		.subscribe((subtech: Subtech) => {
			if (subtech) {
				this.refreshProblemArea$
					.next(this.requestRma ? CaseRequestType.RMA : CaseRequestType.Diagnose);
			}
		});
	}

	/**
	 * Refresh tech predictions, can be triggered from a parent Component
	 * For that reason, we run change detection.
	 * @param caseTitle case title
	 * @param caseDescription case description
	 */
	public refreshPredictions () {
		this.refreshPredictions$.next({
			caseDescription: this.suggestionDescription,
			caseTitle: this.suggestionTitle,
		});
		this.cdr.detectChanges();
	}

	/**
	 * When user clicks "See all Options" button, display full dropdown selects
	 */
	public onSeeAll () {
		this.isTechSuggestionSelected = false;
		this.displaySuggestions = false;
	}

	/**
	 * When user clicks "Refresh Suggestions" clear selection and update suggested options
	 */
	public onRefreshSuggestions () {
		this.displayAll = false;
		this.isTechSuggestionSelected = false;
		this.form.controls.suggestedTech.setValue(null);
		this.refreshPredictions();
	}

	/**
	 * Subscribe to subject to refresh tech predictions
	 */
	private subscribePredictions () {
		this.refreshPredictions$.pipe(
			tap(() => this.loadingSuggestions = true),
			switchMap(params =>
				this.fetchPredictions(params.caseTitle, params.caseDescription)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingSuggestions = false;
			if (!result || result.Status !== 'success') {
				this.displaySuggestions = false;

				return;
			}

			this.recommendedTechs = _.slice(result.predictions, 0, 3);

			this.form.controls.suggestedTech.setValue(this.recommendedTechs[0]);
		});

		// Watch for the suggested tech selection to change,
		// update tech/subtech in the form appropriately
		this.form.controls.suggestedTech.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((value: CaseClassifyResponse['predictions'][0]) => {
				if (value) {
					this.form.controls.technology.setValue({
						_id: value.tech.id,
						techName: value.tech.name,
					});
					this.fetchSubtechByName(value.sub_tech.name)
					.pipe(takeUntil(this.destroy$))
					.subscribe(response =>
						this.form.controls.subtech.setValue(response.subTech));
				} else {
					this.form.controls.technology.setValue(null);
					this.form.controls.subtech.setValue(null);
				}
			});
	}

	/**
	 * Fetch tech/subTech predictions to display suggestions based on a case title/desc
	 * @param caseTitle case title
	 * @param caseDescription case description
	 * @returns Observable with result
	 */
	private fetchPredictions (caseTitle: string, caseDescription: string):
		Observable<CaseClassifyResponse> {
		return this.caseService.fetchClassification({
			data: {
				caseTitle,
				appId: environment.csone.classifyAppId,
				caseClientTrxId: 'case-100777', // TODO: figure out this id
				caseCsymptom: caseDescription,
			},
		})
		.pipe(
			catchError(err => {
				this.logger.error(`Fetch Case Predictions :: Error ${err}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetches the subtech matching a specific name.
	 * @param subTechName The name of the subtech to fetch.
	 * @returns observable with results.
	 */
	private fetchSubtechByName (subTechName: string) {
		return this.caseService.fetchSubTechByName(subTechName)
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Subtech :: Error ${err}`);

					return of(null);
				}),
			);
	}

	/**
	 * hide user message on technology select
	 * @param event receives boolean value
	 */
	public suggestionSelected (event: boolean) {
		this.isTechSuggestionSelected = event;
	}
}
