import {
	Component,
	ViewChild,
	TemplateRef,
	OnDestroy,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import {
	ACC,
	ACCResponse,
	ATX,
	ATXResponse,
	ATXSession,
	CommunitiesResponse,
	Community,
	ELearning,
	ELearningResponse,
	PitstopActionUpdateRequest,
	PitstopActionUpdateResponse,
	RacetrackContentService,
	RacetrackPitstop,
	RacetrackPitstopAction,
	RacetrackService,
	RacetrackSolution,
	RacetrackTechnology,
	SuccessPath,
	SuccessPathsResponse,
} from '@cui-x/sdp-api';

import { SolutionService } from '../solution.service';
import * as _ from 'lodash';
import { Observable, of, forkJoin, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interface representing our data object
 */
interface ComponentData {
	racetrack?: {
		pitstop?: RacetrackPitstop;
		stage?: string;
		actionsCompPercent?: string;
	};
	params: {
		customerId: string;
		pitstop: string;
		solution: string;
		usecase: string;
		suggestedAction?: string;
	};
	atx?: {
		sessions?: ATX[];
		recommended?: ATX;
		interested?: ATX;
	};
	learning?: {
		certifications?: ELearning[];
		elearning?: ELearning[];
		training?: ELearning[];
		success?: SuccessPath[];
		archetype?: string[];
	};
	acc?: {
		sessions: ACC[];
		recommended: ACC;
	};
	communities?: Community[];
}

/**
 * Interface representing combine a seletable status with PitstopAction
 */
export interface PitstopActionWithStatus {
	selected: boolean;
	action: RacetrackPitstopAction;
}

/**
 * Lifecycle Solution component
 */
@Component({
	styleUrls: ['./lifecycle.component.scss'],
	templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent implements OnDestroy {
	@ViewChild('accModal', { static: true }) public accTemplate: TemplateRef<{ }>;
	@ViewChild('atxModal', { static: true }) public atxTemplate: TemplateRef<{ }>;
	@ViewChild('successModal', { static: true }) public successPathTemplate: TemplateRef<{ }>;
	public modalContent: TemplateRef<{ }>;
	public modal = {
		content: null,
		context: null,
		visible: false,
	};
	public visibleContext: ATX[];
	public atxScheduleCardOpened = false;
	public sessionSelected: ATXSession;
	public customerId = '2431199';
	public selectedCategory = '';
	public selectedSuccessPaths: SuccessPath[];
	public categoryOptions: [];

	public currentPitActionsWithStatus: PitstopActionWithStatus[];

	public status = {
		loading: {
			acc: false,
			atx: false,
			communities: false,
			elearning: false,
			racetrack: false,
			success: false,
		},
	};

	public componentData: ComponentData = {
		params: {
			customerId: '',
			pitstop: '',
			solution: '',
			suggestedAction: '',
			usecase: '',
		},
	};

	private selectedSolution: RacetrackSolution;
	private selectedTechnology: RacetrackTechnology;
	private solutionSubscribe: Subscription;
	private technologySubscribe: Subscription;

	get currentPitstop () {
		return _.get(this.componentData, ['racetrack', 'pitstop']);
	}

	get currentActionsCompPert () {
		return _.get(this.componentData, ['racetrack', 'actionsCompPercent'], '0%');
	}

	constructor (
		private logger: LogService,
		private contentService: RacetrackContentService,
		private racetrackService: RacetrackService,
		private solutionService: SolutionService,
	) {
		this.solutionSubscribe = this.solutionService.getCurrentSolution()
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolution = solution;
			this.componentData.params.solution = solution.name;
		});

		this.technologySubscribe = this.solutionService.getCurrentTechnology()
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnology = technology;
			const currentSolution = this.componentData.params.solution;

			this.resetComponentData();

			this.componentData.params.usecase = technology.name;
			this.componentData.params.solution = currentSolution;

			this.getRacetrackInfo();
		});
	}

	/**
	 * Resets our component data to its base requirements
	 */
	private resetComponentData () {
		this.componentData = {
			params: {
				customerId: this.customerId,
				pitstop: '',
				solution: '',
				suggestedAction: '',
				usecase: '',
			},
		};
	}

	/**
	 * Determines which modal to display
	 * @param type the modal template to display
	 */
	public showModal (type: string) {
		if (type === 'atx') {
			this.modal = {
				content: this.atxTemplate,
				context: { data: this.componentData.atx.sessions },
				visible: true,
			};
		} else if (type === 'acc') {
			this.modal = {
				content: this.accTemplate,
				context: { data: this.componentData.acc.sessions },
				visible: true,
			};
		} else if (type === '_ProductGuide_') {
			this.modal = {
				content: this.successPathTemplate,
				context: { data: this.selectedSuccessPaths },
				visible: true,
			};
		}
	}

	/**
	 * Closes the currently open modal
	 */
	public closeModal () {
		this.modal = {
			content: null,
			context: null,
			visible: false,
		};
		this.atxScheduleCardOpened = false;
	}

	/**
	 * Determines which modal to display
	 * @param atx ATX item
	 * @returns ribbon
	 */
	public getRibbonClass (atx: ATX) {
		let ribbon = 'ribbon__clear';
		switch (_.get(atx, 'status')) {
			case 'completed': {
				ribbon = 'ribbon__green';
				break;
			}
			case 'scheduled':
			case 'inProgress': {
				ribbon = 'ribbon__blue';
				break;
			}
			default: {
				ribbon = 'ribbon__clear';
				break;
			}
		}

		return ribbon;
	}
	/**
	 * Selects the session
	 * @param session the session we've clicked on
	 */
	public selectSession (session: ATXSession) {
		this.sessionSelected = (_.isEqual(this.sessionSelected, session)) ? null : session;
	}

	/**
	 * Selects the category
	 */
	public selectFilter () {
		this.selectedSuccessPaths =
			_.filter(this.componentData.learning.success, { archetype: this.selectedCategory });
		if (this.selectedCategory === 'Not selected' || !this.selectedCategory) {
			this.selectedSuccessPaths = this.componentData.learning.success;
		}
	}

	/**
	 * function to show action description
	 * @param actionWithStatus the pitstopAction has been selected
	 */
	public selectAction (actionWithStatus: PitstopActionWithStatus) {
		if (!actionWithStatus.selected) {
			this.resetSelectStatus();
		}
		actionWithStatus.selected = !actionWithStatus.selected;

		// If suggestedAction changes, refresh ATX, ACC and others
		if (this.componentData.params.suggestedAction !== actionWithStatus.action.name) {
			this.componentData.params.suggestedAction = actionWithStatus.action.name;
			this.loadRacetrackInfo();
		}
	}

	/**
	 * function to call Racetrack API to complete an Action
	 * @param action the action to complete
	 */
	public completeAction (action: RacetrackPitstopAction) {
		// Call racetrack API to complete an action
		this.status.loading.racetrack = true;
		this.resetSelectStatus();
		const actionUpdated: PitstopActionUpdateRequest = {
			actionComplete: true,
			pitstop: this.componentData.params.pitstop,
			pitstopAction: action.name,
			solution: this.componentData.params.solution,
			technology: this.componentData.params.usecase,
		};
		const params: RacetrackService.UpdatePitstopActionParams = {
			actionUpdate: actionUpdated,
			customerId: this.customerId,
		};
		this.racetrackService.updatePitstopAction(params)
		.subscribe((results: PitstopActionUpdateResponse) => {
			this.status.loading.racetrack = false;
			this.componentData.racetrack.actionsCompPercent =
				this.calculateActionPercentage(this.componentData.racetrack.pitstop);

			const source = [];
			if (results.isAtxChanged) { source.push(this.loadATX()); }
			if (results.isAccChanged) { source.push(this.loadACC()); }
			if (results.isElearningChanged) { source.push(this.loadELearning()); }
			if (results.isCommunitiesChanged) { source.push(this.loadCommunites()); }
			if (results.isSuccessPathChanged) { source.push(this.loadSuccessPaths()); }
			forkJoin(
				source,
			)
			.subscribe();
		},
		err => {
			this.status.loading.racetrack = false;
			this.logger.error(`lifecycle.component : completeAction() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * private utility function to clear out seleted status
	 */
	private resetSelectStatus () {
		for (const pitstop of this.currentPitActionsWithStatus) {
			pitstop.selected = false;
		}
	}

	/**
	 * private function to cacluate completed percentage function
	 * @param pitstop the current pitstop
	 * @returns pertage string
	 */
	private calculateActionPercentage (pitstop: RacetrackPitstop) {
		if (pitstop) {
			const completedActions = _.filter(pitstop.pitstopActions, 'isComplete').length;
			const pct = Math.floor(
				(completedActions / pitstop.pitstopActions.length) * 100) || 0;

			return pct === 0 ? 'start' : `${pct.toString()}%`;
		}

		 return 'start';
	}

	/**
	 * Loads the ACC for the given params
	 * @returns the accResponse
	 */
	private loadACC (): Observable<ACCResponse> {
		this.status.loading.acc = true;

		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackACC(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: ACCResponse) => {
				this.status.loading.acc = false;

				this.componentData.acc = {
					recommended: result.items[0],
					sessions: result.items,
				};

				return result;
			}),
			catchError(err => {
				this.status.loading.acc = false;
				this.logger.error(`lifecycle.component : loadACC() :: Error : (${
					err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Loads the ATX data
	 * @returns the ATXResponse
	 */
	private loadATX (): Observable<ATXResponse> {
		this.status.loading.atx = true;
		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackATX(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: ATXResponse) => {
				this.componentData.atx = {
					recommended: _.head(result.items),
					sessions: result.items,
				};
				this.status.loading.atx = false;

				return result;
			}),
			catchError(err => {
				this.status.loading.atx = false;
				this.logger.error(`lifecycle.component : loadATX() :: Error : (${
				err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Loads the success paths from the api
	 * @returns the success paths
	 */
	private loadSuccessPaths (): Observable<SuccessPathsResponse> {
		this.status.loading.success = true;
		if (window.Cypress) {
			window.successPathsLoading = true;
		}
		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackSuccessPaths(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: SuccessPathsResponse) => {
				if (result.items.length) {
					_.set(this.componentData, ['learning', 'success'], result.items);
					_.set(this.componentData, ['learning', 'archetype'],
						_.chain(result.items)
						.map('archetype')
						.uniq()
						.value());
					this.componentData.learning.archetype.unshift('Not selected');
					this.selectedSuccessPaths = this.componentData.learning.success;
					this.categoryOptions =
						_.map(this.componentData.learning.archetype, item => ({
							name: item,
							value: item,
						}));
				}

				this.status.loading.success = false;
				if (window.Cypress) {
					window.successPathsLoading = false;
				}

				return result;
			}),
			catchError(err => {
				this.status.loading.success = false;
				if (window.Cypress) {
					window.successPathsLoading = false;
				}
				this.logger.error(`lifecycle.component : loadSuccessPaths() :: Error : (${
					err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Loads the e-learning api response
	 * @returns the elearning response
	 */
	private loadELearning (): Observable<ELearningResponse> {
		this.status.loading.elearning = true;
		if (window.Cypress) {
			window.elearningLoading = true;
		}
		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackElearning(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: ELearningResponse) => {

				if (result.items.length) {
					_.set(this.componentData, ['learning', 'certifications'], []);
					_.set(this.componentData, ['learning', 'elearning'], []);
					_.set(this.componentData, ['learning', 'training'], []);

					_.each(result.items, (item: ELearning) => {
						switch (item.type) {
							case 'E-Course': {
								this.componentData.learning.elearning.push(item);
								break;
							}
							case 'Cisco Training on Demand Courses':
							case 'Videos': {
								this.componentData.learning.certifications.push(item);
								break;
							}
							default: {
								this.componentData.learning.training.push(item);
								break;
							}
						}
					});
					// To do order the list by ranking
					this.componentData.learning.elearning =
						_.orderBy(this.componentData.learning.elearning, ['ranking', 'asc']);
					this.componentData.learning.certifications =
						_.orderBy(this.componentData.learning.certifications, ['ranking', 'asc']);
					this.componentData.learning.training =
						_.orderBy(this.componentData.learning.training, ['ranking', 'asc']);
				}

				this.status.loading.elearning = false;
				if (window.Cypress) {
					window.elearningLoading = false;
				}

				return result;
			}),
			catchError(err => {
				this.status.loading.elearning = false;
				if (window.Cypress) {
					window.elearningLoading = false;
				}
				this.logger.error(`lifecycle.component : loadELearning() :: Error : (${
					err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Loads the communities for the given params
	 * @returns the communities response
	 */
	private loadCommunites (): Observable<CommunitiesResponse> {
		this.status.loading.communities = true;
		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackCommunities(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: CommunitiesResponse) => {
				this.status.loading.communities = false;

				if (result.items.length) {
					this.componentData.communities = result.items;
				}

				return result;
			}),
			catchError(err => {
				this.status.loading.communities = false;
				this.logger.error(`lifecycle.component : loadCommunites() :: Error : (${
					err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * ForkJoin to load the other API Calls
	 */
	private loadRacetrackInfo () {
		forkJoin(
			this.loadACC(),
			this.loadATX(),
			this.loadCommunites(),
			this.loadELearning(),
			this.loadSuccessPaths(),
		)
		.subscribe();
	}

	/**
	 * Fetches the racetrack info for the given params, if successful
	 * will then call loadRacetrackInfo for the other api calls
	 */
	private getRacetrackInfo () {
		if (this.componentData.params.solution && this.componentData.params.usecase) {
			this.status.loading.racetrack = true;

			const stage = _.get(this.selectedTechnology, 'currentPitstop', 'Onboard');

			const pitstop = _.find(
				_.get(this.selectedTechnology, 'pitstops', []), (stop: RacetrackPitstop) =>
				stop.name.toLowerCase() === stage.toLowerCase());

			this.componentData.racetrack = {
				pitstop,
				actionsCompPercent: this.calculateActionPercentage(pitstop),
				stage: stage.toLowerCase(),
			};

			const nextAction = _.find(pitstop.pitstopActions, { isComplete: false });

			this.componentData.params.suggestedAction = nextAction ? nextAction.name : null;

			this.currentPitActionsWithStatus = _.map(
				pitstop.pitstopActions, (pitstopAction: RacetrackPitstopAction) =>
					({
						action: pitstopAction,
						selected: false,
					}));

			this.componentData.params.pitstop = stage;
			this.loadRacetrackInfo();

			this.status.loading.racetrack = false;
		}
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		if (this.solutionSubscribe) {
			_.invoke(this.solutionSubscribe, 'unsubscribe');
		}

		if (this.technologySubscribe) {
			_.invoke(this.technologySubscribe, 'unsubscribe');
		}
	}
}
