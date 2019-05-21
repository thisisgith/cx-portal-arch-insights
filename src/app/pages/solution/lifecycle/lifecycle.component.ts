import {
	Component,
	ViewChild,
	TemplateRef,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import {
	RacetrackResponse,
	RacetrackTechnology,
	RacetrackPitstop,
	RacetrackService,
	ELearning,
	RacetrackContentService,
	ATXResponse,
	ATX,
	ATXSession,
	ACC,
	Community,
	ACCResponse,
	CommunitiesResponse,
	SuccessPath,
	ELearningResponse,
	SuccessPathsResponse,
} from '@cui-x/sdp-api';

import { Solution, UseCase } from '../solution.component';
import { SolutionService } from '../solution.service';
import * as _ from 'lodash';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interface representing our data object
 */
interface ComponentData {
	racetrack?: {
		pitstop?: RacetrackPitstop;
		stage?: string;
	};
	params: {
		customerId: string;
		pitstop: string;
		solution: string;
		usecase: string;
	};
	atx?: {
		sessions?: ATX[];
		recommended?: ATX;
	};
	learning?: {
		certifications?: ELearning[];
		elearning?: ELearning[];
		training?: ELearning[];
		success?: SuccessPath[];
	};
	acc?: {
		sessions: ACC[];
		recommended: ACC;
	};
	communities?: Community[];
}

/**
 * Lifecycle Solution component
 */
@Component({
	styleUrls: ['./lifecycle.component.scss'],
	templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent {
	@ViewChild('atxModal') public atxTemplate: TemplateRef<{ }>;
	public modalContent: TemplateRef<{ }>;
	public modal = {
		content: null,
		context: null,
		visible: false,
	};
	public visibleContext: ATX[];
	public atxScheduleCardOpened = false;
	public sessionSelected: ATXSession;
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
			usecase: '',
		},
	};

	get currentPitstop () {
		return _.get(this.componentData, ['racetrack', 'pitstop']);
	}

	constructor (
		private logger: LogService,
		private contentService: RacetrackContentService,
		private racetrackService: RacetrackService,
		private solutionService: SolutionService,
	) {
		this.solutionService.getCurrentSolution()
		.subscribe((solution: Solution) => {
			this.componentData.params.solution = solution.key;
		});

		this.solutionService.getCurrentUseCase()
		.subscribe((useCase: UseCase) => {
			const currentSolution = this.componentData.params.solution;

			this.resetComponentData();

			this.componentData.params.usecase = useCase.key;
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
				customerId: '2431199',
				pitstop: '',
				solution: '',
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
	}

	/**
	 * Selects the session
	 * @param session the session we've clicked on
	 */
	public selectSession (session: ATXSession) {
		this.sessionSelected = (_.isEqual(this.sessionSelected, session)) ? null : session;
	}

	/**
	 * Loads the ATX data
	 * @returns the ATXResponse
	 */
	private loadATX (): Observable<ATXResponse> {
		this.status.loading.atx = true;

		return this.contentService.getRacetrackATX(this.componentData.params)
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

		return this.contentService.getRacetrackSuccessPaths(this.componentData.params)
		.pipe(
			map((result: SuccessPathsResponse) => {
				if (result.items.length) {
					_.set(this.componentData, ['learning', 'success'], result.items);
				}

				this.status.loading.success = false;

				return result;
			}),
			catchError(err => {
				this.status.loading.success = false;
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

		return this.contentService.getRacetrackElearning(this.componentData.params)
		.pipe(
			map((result: ELearningResponse) => {

				if (result.items.length) {
					_.set(this.componentData, ['learning', 'certifications'], []);
					_.set(this.componentData, ['learning', 'elearning'], []);
					_.set(this.componentData, ['learning', 'training'], []);

					_.each(result.items, (item: ELearning) => {
						if (_.get(this.componentData.learning, item.type)) {
							this.componentData.learning[item.type].push(item);
						}
					});
				}

				this.status.loading.elearning = false;

				return result;
			}),
			catchError(err => {
				this.status.loading.elearning = false;
				this.logger.error(`lifecycle.component : loadELearning() :: Error : (${
					err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Loads the ACC for the given params
	 * @returns the accResponse
	 */
	private loadACC (): Observable<ACCResponse> {
		this.status.loading.acc = true;

		return this.contentService.getRacetrackACC(this.componentData.params)
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
	 * Loads the communities for the given params
	 * @returns the communities response
	 */
	private loadCommunites (): Observable<CommunitiesResponse> {
		this.status.loading.communities = true;

		return this.contentService.getRacetrackCommunities(this.componentData.params)
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

			this.racetrackService.getRacetrack(
				_.pick(this.componentData.params, ['customerId', 'solution', 'usecase']))
			.subscribe((results: RacetrackResponse) => {
				const solution = _.find(results.solutions,
						{ name: this.componentData.params.solution.toUpperCase() });

				if (solution) {
					const usecase = _.find(solution.technologies, (tech: RacetrackTechnology) =>
						tech.name.toLowerCase() === this.componentData.params.usecase);

					if (usecase) {
						const stop = _.find(usecase.pitstops,
							(pitstop: RacetrackPitstop) =>
							pitstop.name.toLowerCase() === usecase.currentPitstop.toLowerCase());
						this.componentData.racetrack = {
							pitstop: stop,
							stage: usecase.currentPitstop.toLowerCase(),
						};
						this.componentData.params.pitstop = this.componentData.racetrack.stage;
						this.loadRacetrackInfo();
					}
				}

				this.status.loading.racetrack = false;
			},
			err => {
				this.status.loading.racetrack = false;
				this.logger.error(`lifecycle.component : getRacetrackInfo() :: Error  : (${
					err.status}) ${err.message}`);
			});
		}
	}
}
