import {
	Component,
	ViewChild,
	TemplateRef,
	OnDestroy,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import {
	ACC,
	ACCBookmarkSchema,
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
} from '@sdp-api';

import { SolutionService } from '../solution.service';
import * as _ from 'lodash-es';
import { Observable, of, forkJoin, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';

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
		rows?: number;
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
	};
	cgt?: {
		sessions: ACC[];
	}
	communities?: Community[];
}

/**
 * An ELearning DTO, but with extra arrays to help display the star ratings
 */
interface ELearningModel extends ELearning {
	/**
	 * The string rating parsed as a number
	 */
	fixedRating?: number;
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
	public requestModal = {
		content: null,
		context: null,
		visible: false,
	};
	public visibleContext: ATX[];
	public atxScheduleCardOpened = false;
	public sessionSelected: ATXSession;
	public customerId = '2431199';
	public selectedCategory = '';
	public selectedStatus = '';
	public selectedSuccessPaths: SuccessPath[];
	public categoryOptions: [];
	// id of ACC in request form
	public accTitleRequestForm: string;
	public accIdRequestForm: string;

	public currentPitActionsWithStatus: PitstopActionWithStatus[];
	public selectedACC: ACC[];

	public statusOptions = [
		{
			name: I18n.get('_AllTitles_'),
			value: 'allTitles',
		},
		{
			name: I18n.get('_Recommended_'),
			value: 'recommended',
		},
		{
			name: I18n.get('_Requested_'),
			value: 'requested',
		},
		{
			name: I18n.get('_InProgress_'),
			value: 'in-progress',
		},
		{
			name: I18n.get('_Completed_'),
			value: 'completed',
		},
		{
			name: I18n.get('_Bookmarked_'),
			value: 'isBookmarked',
		},
		{
			name: I18n.get('_NotBookmarked_'),
			value: 'hasNotBookmarked',
		},
	];

	public status = {
		loading: {
			acc: false,
			atx: false,
			communities: false,
			elearning: false,
			racetrack: false,
			success: false,
			cgt: false,
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

	public selectAccComponent = false;
	public selectCgtComponent = false;
	public cgtRequestTrainingClicked = false;

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
				rows: 100,
				solution: '',
				suggestedAction: '',
				usecase: '',
			},
		};
	}

	/**
	 * Select/deselect the ACCRequestForm component
	 * @param selected whether the component is visible or not
	 * @param accId accId of selected ACC
	 * @param accTitle title of selected ACC
	 */
	public selectAccRequestForm (selected: boolean, accId: string, accTitle: string) {
		if (selected) {
			this.accIdRequestForm = accId;
			this.accTitleRequestForm = accTitle;
		}

		this.selectAccComponent = selected;
	}

	/**
	 * Trigger the submitted acc success text.  Currently placeholder and will be removed
	 * because this info will come from the API
	 * @param submitted if the request was submitted
	 */
	public accRequestSubmit (submitted: boolean) {
		if (submitted) {
			this.selectAccComponent = false;
			this.loadACC()
				.subscribe();
		}
	}

	/**
	 * Select/deselect the CGTRequestForm component
	 * @param selected whether the component is visible or not
	 */
	public selectCgtRequestForm (selected: boolean) {
		this.selectCgtComponent = selected;
	}

	/**
	 * Trigger the submitted acc success text.  Currently placeholder and will be removed
	 * because this info will come from the API
	 * @param submitted if the request was submitted
	 */
	public cgtRequestSubmit (submitted: boolean) {
		if (submitted) {
			this.selectCgtComponent = false;
			this.loadCGT()
				.subscribe();
		}
	}

	/**
	 * Get button class for CGT request training
	 */
	public getCgtButtonClass () {
		let buttonClass = 'btn btn--small btn--secondary text-uppercase';
		buttonClass = this.cgtRequestTrainingClicked ? 'btn btn--small btn--gray-ghost disabled text-uppercase' : 'btn btn--small btn--secondary text-uppercase';
		return buttonClass;
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
				context: { data: this.selectedACC },
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
	 * Determines which modal to display
	 * @param acc ACC item
	 * @returns ribbon
	 */
	 public getACCRibbonClass (acc: ACC) {
		let ribbon = 'ribbon__clear';
		if (!acc) {
			return ribbon;
		}
		if (acc.status === 'completed') {
			ribbon = 'ribbon__green';
		}

		if (acc.isFavorite) {
			ribbon = 'ribbon__blue';
		}

		return ribbon;
	}

	/**
	 * Determines which modal to display
	 * @param item ACC item
	 * @returns ribbon
	 */
	 public setFavorite (item: ACC) {
		if (item.status === 'completed') {
			return;
		}

		this.status.loading.acc = true;
		if (window.Cypress) {
			window.accLoading = true;
		}
		const bookmarkParam: ACCBookmarkSchema = {
			customerId: this.customerId,
			isFavorite: !item.isFavorite,
			pitstop: this.componentData.params.pitstop,
			solution: this.componentData.params.solution,
			usecase: this.componentData.params.usecase,
		};
		const params: RacetrackContentService.UpdateACCBookmarkParams = {
			accId: item.accId,
			bookmark: bookmarkParam,
		};
		this.contentService.updateACCBookmark(params)
		.subscribe(() => {
			this.status.loading.acc = false;
			if (window.Cypress) {
				window.accLoading = false;
			}
			item.isFavorite = !item.isFavorite;
		},
		err => {
			this.status.loading.acc = false;
			if (window.Cypress) {
				window.accLoading = false;
			}
			this.logger.error(`lifecycle.component : setFavorite() :: Error  : (${
				err.status}) ${err.message}`);
		});
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
	 * @param type the item type
	 */
	public selectFilter (type: string) {
		if (type === 'productguide') {
			this.selectedSuccessPaths =
				_.filter(this.componentData.learning.success, { archetype: this.selectedCategory });
			if (this.selectedCategory === 'Not selected' || !this.selectedCategory) {
				this.selectedSuccessPaths = this.componentData.learning.success;
			}
		}
		if (type === 'acc') {
			if (this.selectedStatus === 'isBookmarked') {
				this.selectedACC =
				_.filter(this.componentData.acc.sessions, { isFavorite: true });
			} else if (this.selectedStatus === 'hasNotBookmarked') {
				this.selectedACC =
				_.filter(this.componentData.acc.sessions, { isFavorite: false });
			} else {
				this.selectedACC =
					_.filter(this.componentData.acc.sessions, { status: this.selectedStatus });
			}
			if (this.selectedStatus === 'allTitles' || !this.selectedStatus) {
				this.selectedACC = this.componentData.acc.sessions;
			}
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
			if (results.isCgtChanged) { source.push(this.loadCGT()); }
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

			if (!_.isNil(pct)) {
				return (pct === 0) ? 'start' : `${pct.toString()}%`;
			}
		}

		 return 'start';
	}

	/**
	 * Loads the ACC for the given params
	 * @returns the accResponse
	 */
	private loadACC (): Observable<ACCResponse> {
		this.status.loading.acc = true;
		if (window.Cypress) {
			window.accLoading = true;
		}

		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackACC(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: ACCResponse) => {
				this.status.loading.acc = false;
				this.selectedStatus = '';
				if (window.Cypress) {
					window.accLoading = false;
				}

				this.componentData.acc = {
					sessions: _.union(_.filter(result.items, { status: 'recommended' }),
						_.filter(result.items, { status: 'requested' }),
						_.filter(result.items, { status: 'in-progress' }),
						_.filter(result.items, { status: 'completed' })),
				};
				_.remove(this.componentData.acc.sessions, (session: ACC) =>
					!session.title && !session.description);

				this.selectedACC = this.componentData.acc.sessions;

				return result;
			}),
			catchError(err => {
				this.status.loading.acc = false;
				if (window.Cypress) {
					window.accLoading = false;
				}
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
		if (window.Cypress) {
			window.atxLoading = true;
		}
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
				if (window.Cypress) {
					window.atxLoading = false;
				}

				return result;
			}),
			catchError(err => {
				this.status.loading.atx = false;
				if (window.Cypress) {
					window.atxLoading = false;
				}
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
			_.pick(this.componentData.params,
				['customerId', 'solution', 'usecase', 'pitstop', 'rows']))
		.pipe(
			map((result: SuccessPathsResponse) => {
				this.selectedCategory = '';
				if (result.items.length) {
					_.set(this.componentData, ['learning', 'success'], result.items);
					const resultItems = _.uniq(_.map(result.items, 'archetype'));
					_.set(this.componentData, ['learning', 'archetype'], resultItems);
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
			_.pick(this.componentData.params,
				['customerId', 'solution', 'usecase', 'pitstop', 'rows']))
		.pipe(
			map((result: ELearningResponse) => {

				if (result.items.length) {
					_.set(this.componentData, ['learning', 'certifications'], []);
					_.set(this.componentData, ['learning', 'elearning'], []);
					_.set(this.componentData, ['learning', 'training'], []);

					_.each(result.items, (item: ELearning) => {
						switch (item.type) {
							case 'E-Learning': {
								const learningItem: ELearningModel = {
									...item,
									fixedRating: parseFloat(item.rating),
								};
								this.componentData.learning.elearning.push(learningItem);
								break;
							}
							case 'Certification':
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
		if (window.Cypress) {
			window.communitiesLoading = true;
		}
		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackCommunities(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: CommunitiesResponse) => {
				this.status.loading.communities = false;
				if (window.Cypress) {
					window.communitiesLoading = false;
				}

				if (result.items.length) {
					this.componentData.communities = result.items;
				}

				return result;
			}),
			catchError(err => {
				this.status.loading.communities = false;
				if (window.Cypress) {
					window.communitiesLoading = false;
				}
				this.logger.error(`lifecycle.component : loadCommunites() :: Error : (${
					err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Loads the CGT for the given params
	 * @returns the accResponse
	 */
	private loadCGT (): Observable<ACCResponse> {
		this.status.loading.cgt = true;

		// Temporarily not pick up optional query param suggestedAction
		this.logger.debug(`suggestedAction is ${this.componentData.params.suggestedAction}`);

		return this.contentService.getRacetrackACC(
			_.pick(this.componentData.params, ['customerId', 'solution', 'usecase', 'pitstop']))
		.pipe(
			map((result: ACCResponse) => {
				this.status.loading.cgt = false;

				this.componentData.cgt = {
					sessions: _.filter(result.items, { status: 'completed' }),
				};
				_.remove(this.componentData.acc.sessions, (session: ACC) =>
					!session.title && !session.description);
				console.log(`********** cgt data = ${JSON.stringify(this.componentData.cgt)}`);
				console.log(`********** cgt data = ${this.componentData.cgt.sessions[0].status}`);

				return result;
			}),
			catchError(err => {
				this.status.loading.cgt = false;
				this.logger.error(`lifecycle.component : loadCGT() :: Error : (${
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
			this.loadCGT(),
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

			const nextAction = pitstop ? _.find(pitstop.pitstopActions, { isComplete: false })
				: null;

			this.componentData.params.suggestedAction = nextAction ? nextAction.name : null;

			if (pitstop) {
				this.currentPitActionsWithStatus = _.map(
					pitstop.pitstopActions, (pitstopAction: RacetrackPitstopAction) =>
						({
							action: pitstopAction,
							selected: false,
						}));
			}

			this.componentData.params.pitstop = stage;
			// UI not handling pagination for now, temporarily set to a large number
			this.componentData.params.rows = 100;
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
