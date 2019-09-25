import {
	Component,
	ViewChild,
	TemplateRef,
	OnDestroy,
	ElementRef,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import {
	ACC,
	ACCResponse,
	AtxSchema,
	ATXResponseModel,
	AtxSessionSchema,
	BookmarkRequestSchema,
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
	ContractQuota,
	UserTraining,
	RacetrackResponse,
} from '@sdp-api';

import * as racetrackComponent from '../../../components/racetrack/racetrack.component';
import * as _ from 'lodash-es';
import { Observable, of, forkJoin, ReplaySubject, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import { ActivatedRoute } from '@angular/router';
import { User } from '@interfaces';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { RacetrackInfoService } from '@services';
import { environment } from '@environment';

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
		rows: number;
		solution: string;
		usecase: string;
		suggestedAction?: string;
	};
	atx?: {
		sessions?: AtxSchema[];
		recommended?: AtxSchema;
		interested?: AtxSchema;
	};
	learning: {
		certifications?: ELearning[];
		certificationsUrl: string;
		elearning?: ELearning[];
		elearningUrl: string;
		training?: ELearning[];
		success?: SuccessPath[];
		archetype?: string[];
		productGuides?: SuccessPath[];
		pgArchetype?: string[];
	};
	acc?: {
		sessions: ACC[];
	};
	cgt?: {
		trainingsAvailable: number;
		sessions: string[];
		usedTrainings: string[];
	};
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
	@ViewChild('viewAllModal', { static: true }) public viewAllModalTemplate: TemplateRef<{ }>;
	@ViewChild('formatTemplate', { static: true }) private formatTemplate: TemplateRef<{ }>;
	@ViewChild('bookmarkTemplate', { static: true }) private bookmarkTemplate: TemplateRef<{ }>;
	@ViewChild('statusTemplate', { static: true }) private statusTemplate: TemplateRef<{ }>;
	@ViewChild('actionTemplate', { static: true }) private actionTemplate: TemplateRef<{ }>;
	@ViewChild('titleTemplate', { static: true }) private titleTemplate: TemplateRef<{ }>;
	@ViewChild('scrollModal', { static: false }) private scrollModalRef: ElementRef;
	@ViewChild('lifecyclePanel', { static: true }) private lifecyclePanelRef: ElementRef;
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
	public appHeaderHeight = 0;
	public visibleContext: AtxSchema[];
	public atxScheduleCardOpened = false;
	public recommendedAtxScheduleCardOpened = false;
	public panelBottomPaddingNeeded = false;
	public sessionSelected: AtxSessionSchema;
	public customerId: string;
	private user: User;
	public totalAllowedGroupTrainings: number;
	public selectedFilterForSB = '';
	public selectedFilterForATX = '';
	public selectedFilterForACC = '';
	public selectedFilterForPG = '';
	public groupTrainingsAvailable = 0;
	public selectedSuccessPaths: SuccessPath[];
	public selectedScheduledATX: AtxSchema;
	public atxCancelCoordinatesX = 0;
	public atxCancelCoordinatesY = 0;
	public eventXCoordinates = 0;
	public eventYCoordinates = 0;
	public eventClickedElement: HTMLElement;
	public scrollY = 0;
	public innerWidth: number;
	public selectedProductGuides: SuccessPath[];
	public moreATXSelected: AtxSchema;
	public moreXCoordinates = 0;
	public moreYCoordinates = 0;
	public atxMoreClicked = false;
	// id of ACC in request form
	public accTitleRequestForm: string;
	public accIdRequestForm: string;
	private destroyed$: Subject<void> = new Subject<void>();

	// Current uncompleted pitstop
	public currentWorkingPitstop: string;
	// You can schedule/view content in the n+1 pitstop aka the "viewing pitstop"
	public currentViewingPitstop: string;
	public currentPitActionsWithStatus: PitstopActionWithStatus[];
	public selectedACC: ACC[];
	public selectedATX: AtxSchema[];
	public accview: 'list' | 'grid' = 'grid';
	public atxview: 'list' | 'grid' = 'grid';
	public sbview: 'list' | 'grid' = 'grid';
	public pgview: 'list' | 'grid' = 'grid';
	public completedTrainingsList: UserTraining[] | { };
	public successBytesTable: CuiTableOptions;
	public usedTrainingsList: string[];
	public usedTrainings: string[];
	public atxTable: CuiTableOptions;
	public accTable: CuiTableOptions;
	public productGuidesTable: CuiTableOptions;
	public cgtAvailable: number;
	public trainingAvailableThrough: string;

	private stage = new ReplaySubject<string>();
	private destroy$ = new Subject();
	private selectedSolution: RacetrackSolution;
	private selectedTechnology: RacetrackTechnology;
	private currentPitstopCompPert: string;
	// Enable or disable CGT based on this flag
	public enableCGT = false;

	public categoryOptions: [];
	public pgCategoryOptions: [];
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
			name: I18n.get('_Scheduled_'),
			value: 'scheduled',
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
			bookmark: false,
			cgt: false,
			elearning: false,
			productGuides: false,
			racetrack: false,
			success: false,
		},
	};

	// Map of all scheduled ATX's
	// key: atx id, value: scheduled atx session
	public scheduledAtxMap = { };

	public componentData: ComponentData = {
		learning: {
			certificationsUrl: `${environment.learningLink}?type=certification`,
			elearningUrl: `${environment.learningLink}?type=e-learning`,
		},
		params: {
			customerId: '',
			pitstop: '',
			rows: 500,
			solution: '',
			suggestedAction: '',
			usecase: '',
		},
	};

	public selectAccComponent = false;
	public selectCgtComponent = false;
	public cgtRequestTrainingClicked = false;
	public cxLevel: number;

	get currentPitstop () {
		return _.get(this.componentData, ['racetrack', 'pitstop']);
	}

	get currentActionsCompPert () {
		return _.get(this.componentData, ['racetrack', 'actionsCompPercent'], I18n.get('_Start_'));
	}

	constructor (
		private logger: LogService,
		private contentService: RacetrackContentService,
		private racetrackService: RacetrackService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		this.cxLevel = _.get(this.user, ['service', 'cxLevel'], 0);
		const currentSBView = window.sessionStorage.getItem('cxportal.cisco.com:lifecycle:sbview');
		if (!currentSBView) {
			window.sessionStorage.setItem('cxportal.cisco.com:lifecycle:sbview', this.sbview);
		} else {
			this.sbview = <'list' | 'grid'> currentSBView;
		}

		const currentATXView = window.sessionStorage.getItem(
			'cxportal.cisco.com:lifecycle:atxview');
		if (!currentATXView) {
			window.sessionStorage.setItem('cxportal.cisco.com:lifecycle:atxview', this.atxview);
		} else {
			this.atxview = <'list' | 'grid'> currentATXView;
		}

		const currentACCView = window.sessionStorage.getItem(
			'cxportal.cisco.com:lifecycle:accview');
		if (!currentACCView) {
			window.sessionStorage.setItem('cxportal.cisco.com:lifecycle:accview', this.accview);
		} else {
			this.accview = <'list' | 'grid'> currentACCView;
		}

		const currentPGView = window.sessionStorage.getItem(
			'cxportal.cisco.com:lifecycle:pgview');
		if (!currentPGView) {
			window.sessionStorage.setItem('cxportal.cisco.com:lifecycle:pgview', this.pgview);
		} else {
			this.pgview = <'list' | 'grid'> currentPGView;
		}

		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolution = solution;
			this.componentData.params.solution = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			const currentSolution = this.componentData.params.solution;

			const newTech = (currentSolution && technology !== this.selectedTechnology);
			if (newTech) {
				this.selectedTechnology = technology;

				this.resetComponentData();

				this.componentData.params.usecase = _.get(technology, 'name');
				this.componentData.params.solution = currentSolution;
				this.currentWorkingPitstop = _.get(this.selectedTechnology, 'currentPitstop');
				const currentPitstop = _.find(
					_.get(this.selectedTechnology, 'pitstops', []), (stop: RacetrackPitstop) =>
					stop.name === this.currentWorkingPitstop);
				this.currentPitstopCompPert =
					this.calculateActionPercentage(currentPitstop);

				let viewingIndex = racetrackComponent.stages
					.indexOf(this.currentWorkingPitstop) + 1;
				if (viewingIndex === racetrackComponent.stages.length) { viewingIndex = 0; }
				this.currentViewingPitstop = racetrackComponent.stages[viewingIndex];

				this.getRacetrackInfo(this.currentWorkingPitstop);
			}
		});
	}

	/**
	 * Returns if currentWorkingPitstop or currentViewingPitstop is the currently
	 * selected pitstop
	 */
	public get notCurrentPitstop () {
		return this.currentWorkingPitstop !== this.currentPitstop.name
			&& this.currentViewingPitstop !== this.currentPitstop.name;
	}

	/**
	 * Get the localized section title
	 * @returns Title string based on type
	 * @param type string
	 */
	public getTitle (type: string) {
		let title = '';
		switch (type) {
			case 'ACC': {
				title = I18n.get('_Accelerator_');
				break;
			}
			case 'ATX': {
				title = I18n.get('_AskTheExperts_');
				break;
			}
			case 'SB': {
				title = I18n.get('_SuccessBytes_');
				break;
			}
			case 'PG': {
				title = I18n.get('_ProductGuides_');
				break;
			}
		}

		return title;
	}

	/**
	 * Get the localized section title
	 * @returns Subtitle string based on type
	 * @param type string
	 */
	public getSubtitle (type: string) {
		let title = '';
		switch (type) {
			case 'ACC': {
				title = I18n.get('_1on1Coaching_');
				break;
			}
			case 'ATX': {
				title = I18n.get('_AvailableLive_');
				break;
			}
			case 'SB': {
				title = I18n.get('_SuccessBytesSubtitle_');
				break;
			}
			case 'PG': {
				title = I18n.get('_ProductGuidesSubtitle_');
				break;
			}
		}

		return title;
	}

	/**
	 * Resets our component data to its base requirements
	 */
	private resetComponentData () {
		this.componentData = {
			learning: {
				certificationsUrl: `${environment.learningLink}?type=certification`,
				elearningUrl: `${environment.learningLink}?type=e-learning`,
			},
			params: {
				customerId: this.customerId,
				pitstop: '',
				rows: 500,
				solution: '',
				suggestedAction: '',
				usecase: '',
			},
		};
	}

	/**
	 * Will construct the assets table
	 * @returns The successBytes table
	 */
	private buildSBTable () {
		this.successBytesTable = new CuiTableOptions({
			columns: [
				{
					name: I18n.get('_Bookmark_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'bookmark',
					template: this.bookmarkTemplate,
					width: '130px',
				},
				{
					key: 'title',
					name: I18n.get('_Name_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'title',
					template: this.titleTemplate,
					value: 'title',
					width: 'auto',
				},
				{
					key: 'archetype',
					name: I18n.get('_Category_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'archetype',
					value: 'archetype',
					width: '20%',
				},
				{
					name: I18n.get('_Format_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'type',
					template: this.formatTemplate,
					width: '20%',
				},
				{
					sortable: false,
					template: this.actionTemplate,
					width: '15%',
				},
			],
		});
	}

	/**
	 * Will construct the assets table
	 * @returns The successBytes table
	 */
	private buildPGTable () {
		this.productGuidesTable = new CuiTableOptions({
			columns: [
				{
					name: I18n.get('_Bookmark_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'bookmark',
					template: this.bookmarkTemplate,
					width: '130px',
				},
				{
					key: 'title',
					name: I18n.get('_Name_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'title',
					template: this.titleTemplate,
					value: 'title',
					width: 'auto',
				},
				{
					key: 'archetype',
					name: I18n.get('_Category_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'archetype',
					value: 'archetype',
					width: '20%',
				},
				{
					name: I18n.get('_Format_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'type',
					template: this.formatTemplate,
					width: '20%',
				},
				{
					sortable: false,
					template: this.actionTemplate,
					width: '15%',
				},
			],
		});
	}

	/**
	 * Will construct the ACC table
	 */
	private buildAccTable () {
		this.accTable = new CuiTableOptions({
			columns: [
				{
					name: I18n.get('_Bookmark_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'bookmark',
					template: this.bookmarkTemplate,
					width: '160px',
				},
				{
					key: 'title',
					name: I18n.get('_Name_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'title',
					template: this.titleTemplate,
					width: 'auto',
				},
				{
					key: 'status',
					name: I18n.get('_Status_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'status',
					template: this.statusTemplate,
					width: 'auto',
				},
				{
					sortable: false,
					template: this.actionTemplate,
					width: 'auto',
				},
			],
		});
	}

	/**
	 * Will construct the ATX table
	 */
	private buildAtxTable () {
		this.atxTable = new CuiTableOptions({
			columns: [
				{
					name: I18n.get('_Bookmark_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'bookmark',
					template: this.bookmarkTemplate,
					width: '160px',
				},
				{
					key: 'title',
					name: I18n.get('_Name_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'title',
					template: this.titleTemplate,
					width: 'auto',
				},
				{
					key: 'status',
					name: I18n.get('_Status_'),
					sortable: true,
					sortDirection: 'asc',
					sortKey: 'status',
					template: this.statusTemplate,
					width: 'auto',
				},
				{
					sortable: false,
					template: this.actionTemplate,
					width: 'auto',
				},
			],
		});
	}

	/**
	 * Sorting function for successBytes table
	 * @param key the key to sort
	 * @param sortDirection sortDiretion
	 * @param type lifecycle item type
	 */
	public onSort (key: string, sortDirection: string, type: string) {
		if (type === 'SB') {
			this.selectedSuccessPaths = _.orderBy(
				this.selectedSuccessPaths, [key], [sortDirection]);

			_.find(this.successBytesTable.columns, { sortKey: key }).sortDirection
				= _.find(this.successBytesTable.columns, { sortKey: key }).sortDirection
					=== 'asc' ? 'desc' : 'asc';
		}
		if (type === 'ATX') {
			this.selectedATX = _.orderBy(
				this.selectedATX, [key], [sortDirection]);

			_.find(this.atxTable.columns, { sortKey: key }).sortDirection
				= _.find(this.atxTable.columns, { sortKey: key }).sortDirection
					=== 'asc' ? 'desc' : 'asc';
		}
		if (type === 'ACC') {
			this.selectedACC = _.orderBy(
				this.selectedACC, [key], [sortDirection]);

			_.find(this.accTable.columns, { sortKey: key }).sortDirection
				= _.find(this.accTable.columns, { sortKey: key }).sortDirection
					=== 'asc' ? 'desc' : 'asc';
		}
		if (type === 'PG') {
			this.selectedProductGuides = _.orderBy(
				this.selectedProductGuides, [key], [sortDirection]);

			_.find(this.productGuidesTable.columns, { sortKey: key }).sortDirection
				= _.find(this.productGuidesTable.columns, { sortKey: key }).sortDirection
					=== 'asc' ? 'desc' : 'asc';
		}
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
	 * @param usedTrainingData list of trainings used by the user this year
	 */
	public selectCgtRequestForm (selected: boolean,
		usedTrainingData: string[]) {
		if (selected) {
			this.usedTrainingsList = usedTrainingData;
		}
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
	 * Determines which modal to display
	 * @param type the modal template to display
	 */
	public showModal (type: string) {
		// close all popup modals upon opening viewAll modal
		this.closeViewSessions();
		// reset the view to card view
		// this.view = 'grid';
		if (type === 'atx') {
			this.modal = {
				content: this.viewAllModalTemplate,
				context: {
					data: this.selectedATX,
					type: 'ATX',
				},
				visible: true,
			};
		} else if (type === 'acc') {
			this.modal = {
				content: this.viewAllModalTemplate,
				context: {
					data: this.selectedACC,
					type: 'ACC',
				},
				visible: true,
			};
		} else if (type === '_SuccessBytes_') {
			this.modal = {
				content: this.viewAllModalTemplate,
				context: {
					data: this.selectedSuccessPaths,
					type: 'SB',
				},
				visible: true,
			};
		} else if (type === '_ProductGuides_') {
			this.modal = {
				content: this.viewAllModalTemplate,
				context: {
					data: this.selectedProductGuides,
					type: 'PG',
				},
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
		this.recommendedAtxScheduleCardOpened = false;
		this.eventXCoordinates = 0;
		this.eventYCoordinates = 0;
		this.moreXCoordinates = 0;
		this.moreYCoordinates = 0;
		this.selectSession({ });
		this.componentData.atx.interested = null;
		this.moreATXSelected = null;
		this.atxMoreClicked = false;
	}

	/**
	 * Selects the session
	 * @param session the session we've clicked on
	 */
	public selectSession (session: AtxSessionSchema) {
		this.sessionSelected = (_.isEqual(this.sessionSelected, session)) ? null : session;
	}

	/**
	 * register the ATX session
	 * @param atx the session we've clicked on
	 * @param session the crosslaunch url
	 */
	public registerATXSession (atx: AtxSchema, session: AtxSessionSchema) {
		const ssId = session.sessionId;
		this.status.loading.atx = true;
		if (window.Cypress) {
			window.atxLoading = true;
		}
		const params: RacetrackContentService.RegisterUserToAtxParams = {
			atxId: atx.atxId,
			sessionId: ssId,
		};
		this.crossLaunch(session.registrationURL);
		this.contentService.registerUserToAtx(params)
		.subscribe(() => {
			this.status.loading.atx = false;
			if (window.Cypress) {
				window.atxLoading = false;
			}
		},
		err => {
			this.status.loading.atx = false;
			if (window.Cypress) {
				window.atxLoading = false;
			}
			this.logger.error(`lifecycle.component : registerATXSession() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * Selects the session
	 * @param atx the session we've clicked on
	 */
	public cancelATXSession (atx: AtxSchema) {
		const ssId = _.find(atx.sessions, { scheduled: true }).sessionId;
		this.status.loading.atx = true;
		if (window.Cypress) {
			window.atxLoading = true;
		}
		const params: RacetrackContentService.CancelSessionATXParams = {
			atxId: atx.atxId,
			sessionId: ssId,
		};
		this.contentService.cancelSessionATX(params)
		.subscribe(() => {
			_.find(atx.sessions, { sessionId: ssId }).scheduled = false;
			atx.status = 'recommended';
			this.atxScheduleCardOpened = false;
			this.recommendedAtxScheduleCardOpened = false;
			this.status.loading.atx = false;
			if (window.Cypress) {
				window.atxLoading = false;
			}
		},
		err => {
			this.status.loading.acc = false;
			if (window.Cypress) {
				window.accLoading = false;
			}
			this.logger.error(`lifecycle.component : cancelATXSession() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * Selects the category
	 * @param type the item type
	 */
	public selectFilter (type: string) {
		if (type === 'SB') {
			this.selectedSuccessPaths =
				_.filter(this.componentData.learning.success,
					{ archetype: this.selectedFilterForSB });
			if (this.selectedFilterForSB === 'Not selected' || !this.selectedFilterForSB) {
				this.selectedSuccessPaths = this.componentData.learning.success;
			}
		}

		if (type === 'PG') {
			this.selectedProductGuides =
				_.filter(this.componentData.learning.productGuides,
					{ archetype: this.selectedFilterForPG });
			if (this.selectedFilterForPG === 'Not selected' || !this.selectedFilterForPG) {
				this.selectedProductGuides = this.componentData.learning.productGuides;
			}
		}

		if (type === 'ACC') {
			if (this.selectedFilterForACC === 'isBookmarked') {
				this.selectedACC =
				_.filter(this.componentData.acc.sessions, { bookmark: true });
			} else if (this.selectedFilterForACC === 'hasNotBookmarked') {
				this.selectedACC =
				_.filter(this.componentData.acc.sessions, { bookmark: false });
			} else {
				this.selectedACC =
					_.filter(this.componentData.acc.sessions,
						{ status: this.selectedFilterForACC });
			}
			if (this.selectedFilterForACC === 'allTitles' || !this.selectedFilterForACC) {
				this.selectedACC = this.componentData.acc.sessions;
			}
		}

		if (type === 'ATX') {
			if (this.selectedFilterForATX === 'isBookmarked') {
				this.selectedATX =
				_.filter(this.componentData.atx.sessions, { bookmark: true });
			} else if (this.selectedFilterForATX === 'hasNotBookmarked') {
				this.selectedATX =
				_.filter(this.componentData.atx.sessions, { bookmark: false });
			} else {
				this.selectedATX =
					_.filter(this.componentData.atx.sessions,
						{ status: this.selectedFilterForATX });
			}
			if (this.selectedFilterForATX === 'allTitles' || !this.selectedFilterForATX) {
				this.selectedATX = this.componentData.atx.sessions;
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
	 * Changes the view to either list or grid
	 * @param view view to set
	 * @param type lifecycle item type
	 */
	public selectView (view: 'list' | 'grid', type: string) {
		switch (type) {
			case 'SB': {
				if (this.sbview !== view) {
					this.sbview = view;
					window.sessionStorage.setItem(
						'cxportal.cisco.com:lifecycle:sbview', this.sbview);
				}
				break;
			}
			case 'ATX': {
				if (this.atxview !== view) {
					this.atxview = view;
					window.sessionStorage.setItem(
						'cxportal.cisco.com:lifecycle:atxview', this.atxview);
				}
				break;
			}
			case 'ACC': {
				if (this.accview !== view) {
					this.accview = view;
					window.sessionStorage.setItem(
						'cxportal.cisco.com:lifecycle:accview', this.accview);
				}
				break;
			}
			case 'PG': {
				if (this.pgview !== view) {
					this.pgview = view;
					window.sessionStorage.setItem(
						'cxportal.cisco.com:lifecycle:pgview', this.pgview);
				}
				break;
			}
			default:
				break;
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

			this.currentPitstopCompPert = _.get(this.componentData,
				['racetrack', 'actionsCompPercent']);

			const source = [];
			if (results.isAtxChanged) { source.push(this.loadATX()); }
			if (results.isAccChanged) { source.push(this.loadACC()); }
			if (results.isElearningChanged) { source.push(this.loadELearning()); }
			if (results.isSuccessPathChanged) {
				source.push(this.loadSuccessPaths());
				source.push(this.loadProductGuides());
			}
			if (results.isCgtChanged) { source.push(this.loadCGT()); }
			forkJoin(
				source,
			)
			.subscribe();

			if (this.componentData.racetrack.actionsCompPercent === '100%') {
				this.completePitstop();
			}
		},
		err => {
			this.status.loading.racetrack = false;
			this.logger.error(`lifecycle.component : completeAction() :: Error  : (${
				err.status}) ${err.message}`);
		});
	}

	/**
	 * function to reset PitstopAction Checklist filter
	 */
	public resetFilter () {
		this.resetSelectStatus();
		const nextAction =  _.find(this.componentData.racetrack.pitstop.pitstopActions,
			{ isComplete: false });
		const actionName = nextAction ? nextAction.name : null;
		if (this.componentData.params.suggestedAction !== actionName) {
			this.componentData.params.suggestedAction = actionName;
			this.loadRacetrackInfo();
		}
	}

	/**
	 * function to find out if any Action has been selected
	 * @returns boolean
	 */
	public hasSelectedAction () {
		return !_.isEmpty(_.filter(this.currentPitActionsWithStatus, { selected: true }));
	}

	/**
	 * Get updated racetrack info once all pitstops actions are complete
	 */
	private completePitstop () {
		const params: RacetrackService.GetRacetrackParams = {
			customerId: this.customerId,
		};

		// The selected technologies currentPitstop parameter updates once all actions are complete
		// refresh the racetrack info to get those new changes
		this.racetrackService.getRacetrack(params)
		.subscribe((results: RacetrackResponse) => {
			const responseSolution: RacetrackSolution = _.find(
				_.get(results, 'solutions', []), (solution: RacetrackSolution) =>
				solution.name === this.selectedSolution.name);

			const responseTechnology: RacetrackTechnology = _.find(
				_.get(responseSolution, 'technologies', []), (tech: RacetrackTechnology) =>
				tech.name === this.selectedTechnology.name);

			if (responseTechnology) {
				this.racetrackInfoService.sendCurrentTechnology(responseTechnology);
			}
		},
		err => {
			this.logger.error('lifecycle.component : completePitstop() ' +
				`:: Error : (${err.status}) ${err.message}`);
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
		const start = I18n.get('_Start_');
		if (pitstop) {
			const pct = _.get(pitstop, 'pitstop_adoption_percentage');
			if (!_.isNil(pct)) {
				return (pct === 0) ? start : `${pct.toString()}%`;
			}
		}

		return start;
	}

	/**
	 * Updates the bookmark of the item
	 * @param item bookmark item object
	 * @param inputCategory string of the category type
	 */
	 public updateBookmark (item: ACC | AtxSchema | SuccessPath,
			inputCategory: 'ACC' | 'ATX' | 'SB' | 'PG') {
		let bookmark;
		let id;
		let lifecycleCategory: 'ACC' | 'ATX' | 'SB';

		// Product Guides has to be submitted as a Success Bytes bookmark.
		if (inputCategory === 'PG') {
			lifecycleCategory = 'SB';
		} else {
			lifecycleCategory = <'ACC' | 'ATX' | 'SB'> inputCategory;
		}

		this.status.loading.bookmark = true;
		if (window.Cypress) {
			window.elearningLoading = true;
		}
		bookmark = !_.get(item, 'bookmark');

		switch (lifecycleCategory) {
			case 'ACC':
				id = _.get(item, 'accId');
				break;
			case 'ATX':
				id = _.get(item, 'atxId');
				break;
			case 'SB':
				id = _.get(item, 'successByteId');
				break;
		}

		const bookmarkParams: BookmarkRequestSchema = {
			bookmark,
			id,
			lifecycleCategory,
			pitstop: this.componentData.params.pitstop,
			solution: this.componentData.params.solution,
			usecase: this.componentData.params.usecase,
		};
		const params: RacetrackContentService.UpdateBookmarkParams = {
			bookmarkRequestSchema: bookmarkParams,
		};

		this.contentService.updateBookmark(params)
		.subscribe(() => {
			item.bookmark = !item.bookmark;
			this.status.loading.bookmark = false;
			if (window.Cypress) {
				window.elearningLoading = false;
			}
		},
		err => {
			this.status.loading.bookmark = false;
			if (window.Cypress) {
				window.elearningLoading = false;
			}
			this.logger.error(`lifecycle.component : updateBookmark() :: Error  : (${
				err.status}) ${err.message}`);
		});

	 }

	/**
	 * Gets the scroll coordinates for viewAll Modal
	 * @param scrollModal HTMLElement
	 */
	public getScrollCoordinates (scrollModal: HTMLElement) {
		this.scrollY = scrollModal.scrollTop;
	}

	/**
	 * Get the mouse click coordinates
	 * @param event event
	 */
	public getCoordinates (event: MouseEvent) {
		this.eventXCoordinates = event.clientX;
		this.eventYCoordinates = event.clientY;
		this.eventClickedElement = <HTMLElement> event.target;
	}

	/**
	 * Gets the coordinates of the hovered ATX item
	 * @param moreList HTMLElement
	 * @param panel string
	 */
	 public getMoreCoordinates (moreList: HTMLElement, panel: string) {
		if (_.isEqual(panel, 'moreATXList') &&
			!this.atxScheduleCardOpened && !this.atxMoreClicked) {
			this.moreXCoordinates = moreList.offsetWidth;
			this.moreYCoordinates = moreList.offsetTop;
		}
	}

	/**
	 * Changes the atxScheduleCardOpened flag and adds value to moreATXSelected
	 */
	 public atxMoreViewSessions () {
		this.atxScheduleCardOpened = true;
		this.recommendedAtxScheduleCardOpened = false;
		this.atxMoreClicked = false;
	}

	/**
	 * Changes the atxMoreClicked flag and adds value to moreATXSelected
	 * @param item ATXSchema
	 * @param panel string
	 * @param moreList HTMLElement (optional)
	 */
	 public atxMoreSelect (item: AtxSchema, panel: string, moreList?: HTMLElement) {
		 if (!this.atxMoreClicked && _.isEqual(panel, 'moreATXList')) {
			this.atxScheduleCardOpened = false;
			// deals with moreCoordinates not being re-evaluated when viewSessions
			// is open on another more select instance
			if (moreList) {
				this.getMoreCoordinates(moreList, panel);
			}
			this.recommendedAtxScheduleCardOpened = false;
			this.moreATXSelected = item;
			this.atxMoreClicked = true;
		 }
	}

	/**
	 * Changes the recommendedAtxScheduleCardOpened flag
	 */
	 public recommendedATXViewSessions () {
		if (!this.recommendedAtxScheduleCardOpened) {
		   this.recommendedAtxScheduleCardOpened = true;
		   this.atxScheduleCardOpened = false;
		   this.componentData.atx.interested = null;
		   this.atxMoreClicked = false;
		}
	}

	/**
	 * Changes the atxScheduleCardOpened flags to false to close the popupmodal
	 */
	 public closeViewSessions () {
		this.atxScheduleCardOpened = false;
		this.recommendedAtxScheduleCardOpened = false;
		this.selectSession({ });
		this.eventXCoordinates = 0;
		this.eventYCoordinates = 0;
		this.moreXCoordinates = 0;
		this.moreYCoordinates = 0;
		this.moreATXSelected = null;
		this.atxMoreClicked = false;
		this.panelBottomPaddingNeeded = false;
		if (this.componentData.atx) {
			this.componentData.atx.interested = null;
		}
	}

	/**
	 * Get the panel styles based on button coordinates
	 * @param atxMoreClick HTMLElement
	 */
	 public getATXMorePanel (atxMoreClick: HTMLElement) {
		const _div = atxMoreClick;
		if (this.atxMoreClicked && this.moreATXSelected && !this.atxScheduleCardOpened) {
			_div.style.left = `${this.moreXCoordinates + 30}px`;
			_div.style.top = `${this.moreYCoordinates - _div.offsetHeight / 2 + 10}px`;
		}
	}

	/**
	 * Opens the given URL in a new tab
	 * @param crossLaunchUrl string
	 */
	 public crossLaunch (crossLaunchUrl: string) {
		if (crossLaunchUrl) {
			window.open(crossLaunchUrl, '_blank');
			this.closeViewSessions();
		}
	}

	/**
	 * Determines the class of Register button for ATX
	 * @param data AtxSchema
	 * @returns button string
	 */
	 public getAtxRegisterButton (data: AtxSchema) {
		let button: string;
		button = '';
		if (!_.get(this.sessionSelected, 'registrationURL') || this.notCurrentPitstop ||
			_.isEqual(_.get(data, 'status'), 'scheduled')) {
			button = 'disabled';
		}

		return button;
	}

	/**
	 * Get the panel styles based on button coordinates
	 * @param viewAtxSessions HTMLElement
	 * @returns panel string
	 */
	public getPanel (viewAtxSessions: HTMLElement) {
		let panel;
		const _div = viewAtxSessions;
		const atxPopupListViewAdjustPx = 163;
		this.innerWidth = window.innerWidth;
		if (this.componentData.atx.interested) {
			switch (this.atxview) {
				case 'grid': {
					const rect = this.eventClickedElement.getBoundingClientRect();

					if ((rect.right + 500) > this.scrollModalRef.nativeElement.clientWidth) {
						_div.style.right = '98%';
						_div.style.bottom = '-132.5px';
						panel = 'panel cardpanel--openright';
					} else {
						_div.style.left = '55%';
						_div.style.bottom = '-132.5px';
						panel = 'panel cardpanel--open';
					}
					break;
				}
				case 'list': {
					const rect = this.eventClickedElement.getBoundingClientRect();
					const ht = this.eventClickedElement.scrollHeight;

					_div.style.left = `${(rect.left - _div.scrollWidth) - 3}px`;
					_div.style.top = `${(rect.top + (ht / 2))
						+ this.scrollY - atxPopupListViewAdjustPx - this.appHeaderHeight}px`;
					panel = 'panel listpanel--open';
				}
			}
		} else if (this.atxScheduleCardOpened && this.moreATXSelected) {
			const panelHeight = this.lifecyclePanelRef.nativeElement.clientHeight;
			if (_div.clientHeight + this.moreYCoordinates > panelHeight) {
				this.panelBottomPaddingNeeded = true;
			}
			_div.style.left = `${this.moreXCoordinates + 30}px`;
			_div.style.top = `${this.moreYCoordinates - _div.offsetHeight / 2 + 10}px`;
			panel = 'panel panel--open';
		} else {
			_div.style.left = '128px';
			_div.style.bottom = '-150px';
			panel = 'panel panel--open';
		}

		return panel;
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

		return this.contentService.getRacetrackACC(
			_.pick(this.componentData.params,
				['customerId', 'solution', 'usecase', 'pitstop', 'suggestedAction']))
		.pipe(
			map((result: ACCResponse) => {
				this.selectedFilterForACC = '';
				this.componentData.acc = {
					sessions: result.items,
				};
				_.remove(this.componentData.acc.sessions, (session: ACC) =>
					!session.title && !session.description);

				this.selectedACC = this.componentData.acc.sessions;
				this.buildAccTable();

				this.status.loading.acc = false;
				if (window.Cypress) {
					window.accLoading = false;
				}

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
	private loadATX (): Observable<ATXResponseModel> {
		this.closeViewSessions();
		this.status.loading.atx = true;
		if (window.Cypress) {
			window.atxLoading = true;
		}

		return this.contentService.getRacetrackATX(
			_.pick(this.componentData.params,
				['customerId', 'solution', 'usecase', 'pitstop', 'suggestedAction']))
		.pipe(
			map((result: ATXResponseModel) => {
				this.selectedFilterForATX = '';
				this.componentData.atx = {
					recommended: _.head(result.items),
					sessions: result.items,
				};
				this.selectedATX = this.componentData.atx.sessions;

				_.each(this.selectedATX, (atx: AtxSchema) => {
					_.each(atx.sessions, (session: AtxSessionSchema) => {
						if (session.scheduled) {
							this.scheduledAtxMap[atx.atxId] = session;
						}
					});
				});

				this.buildAtxTable();

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
	 * Loads success paths from the api for Product Documentation and Videos.
	 * @returns The success paths for product documentation and videos.
	 */
	private loadProductGuides (): Observable<SuccessPathsResponse> {
		this.status.loading.productGuides = true;
		if (window.Cypress) {
			window.productGuidesLoading = true;
		}

		return this.contentService.getRacetrackSuccessPaths(
			_.pick(this.componentData.params,
				['customerId', 'solution', 'usecase', 'rows']))
		.pipe(
			map((result: SuccessPathsResponse) => {
				this.selectedFilterForPG = '';
				if (result.items.length) {
					_.set(this.componentData, ['learning', 'productGuides'],
						result.items);
					const resultItems = _.uniq(_.map(result.items, 'archetype'));
					_.set(this.componentData, ['learning', 'pgArchetype'],
						resultItems);
					this.componentData.learning.pgArchetype.unshift('Not selected');
					this.selectedProductGuides = this.componentData.learning.productGuides;
					this.pgCategoryOptions = _.map(this.componentData.learning.pgArchetype,
						item => ({
							name: item,
							value: item,
						}));
				}

				this.buildPGTable();
				this.status.loading.productGuides = false;
				if (window.Cypress) {
					window.productGuidesLoading = false;
				}

				return result;
			}),
			catchError(err => {
				this.status.loading.productGuides = false;
				if (window.Cypress) {
					window.productGuidesLoading = false;
				}
				this.logger.error(`lifecycle.component : loadProductGuides() :: Error : (${
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

		return this.contentService.getRacetrackSuccessPaths(
			_.pick(this.componentData.params,
				['customerId', 'solution', 'usecase', 'pitstop', 'rows', 'suggestedAction']))
		.pipe(
			map((result: SuccessPathsResponse) => {
				this.selectedFilterForSB = '';
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

				this.buildSBTable();
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

		return this.contentService.getRacetrackElearning(
			_.pick(this.componentData.params,
			['customerId', 'solution', 'usecase', 'pitstop', 'rows', 'suggestedAction']))
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
							case 'Certification': {
								const learningItem: ELearningModel = {
									...item,
									fixedRating: parseFloat(item.rating),
								};
								this.componentData.learning.certifications.push(learningItem);
								break;
							}
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
	 * Loads the CGT for the given params
	 * @returns the ContractQuota
	 */
	private loadCGT (): Observable<ContractQuota[]> | Observable<void | { }> {
		if (window.Cypress) {
			this.enableCGT = window.forceCGTDisplay;
		}

		if (this.enableCGT) {
			this.status.loading.cgt = true;
			if (window.Cypress) {
				window.cgtLoading = true;
			}
			let startDate;
			let endDate;
			let trainingDuration;
			let trainingLocation;
			let trainingData;
			let completedTrainingData = [];
			let trainigsCompleted = 0;
			let trainigsInProcess = 0;
			this.usedTrainings = [];

			const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

			return this.contentService.getTrainingQuotas(
				_.pick(this.componentData.params, ['customerId']))
			.pipe(
				map((result: ContractQuota[]) => {
					this.status.loading.cgt = false;
					if (window.Cypress) {
						window.cgtLoading = false;
					}
					this.totalAllowedGroupTrainings = _.size(result) * 2;
					_.each(result, training => {
						if (new Date(_.get(training, 'contract_end_date')).getFullYear() ===
							new Date().getFullYear()) {
							this.usedTrainings = _.union(this.usedTrainings, [{
								contract_number: _.get(training, 'tsa_contract_no'),
								end_date: _.get(training, 'contract_end_date'),
								used_sessions: _.get(training, 'closed_ilt_courses_inprocess'),
							}]);
							trainigsInProcess += _.get(training, 'closed_ilt_courses_inprocess');
						} else {
							this.usedTrainings = _.union(this.usedTrainings, [{
								contract_number: _.get(training, 'tsa_contract_no'),
								end_date: _.get(training, 'contract_end_date'),
								used_sessions: 0,
							}]);
						}
					});
					this.contentService.getCompletedTrainings(
						_.pick(this.componentData.params, ['customerId']))
						.pipe(
							catchError(err => {
								this.logger.error(`lifecycle.component : loadCGT() :
								getCompletedTrainings() :: Error : (${err.status}) ${err.message}`);

								return of({ });
							}),
						)
						.subscribe(response => {
							this.completedTrainingsList = response;
							_.each(this.completedTrainingsList, completedTraining => {
								if (new Date(_.get(completedTraining, 'end_date')).getFullYear() ===
									new Date().getFullYear()) {
									_.each(this.usedTrainings, training => {
										if (_.get(completedTraining, 'contract_number') ===
											_.get(training, 'contract_number')) {
											training.used_sessions = training.used_sessions + 1;
										}
									});
									trainigsCompleted = trainigsCompleted + 1;
								}
								startDate = `${
									monthNames[new Date(_.get(completedTraining, 'start_date'))
									.getMonth()]
								} ${new Date(_.get(completedTraining, 'start_date')).getUTCDate()}`;
								startDate += _.isEqual(
									new Date(_.get(completedTraining, 'start_date'))
										.getUTCFullYear(),
									new Date(_.get(completedTraining, 'end_date'))
										.getUTCFullYear()) ?
									'' : ` ${
										new Date(_.get(completedTraining, 'start_date'))
											.getUTCFullYear()
									}`;
								endDate = _.isEqual(
									monthNames[new Date(_.get(completedTraining, 'start_date'))
									.getMonth()],
									monthNames[new Date(_.get(completedTraining, 'end_date'))
									.getMonth()]) ? '' : `${
										monthNames[new Date(_.get(completedTraining, 'end_date'))
										.getMonth()]
									} `;
								endDate += new Date(_.get(completedTraining, 'end_date'))
									.getUTCDate();
								endDate += _.isEqual(
									new Date(_.get(completedTraining, 'start_date'))
										.getUTCFullYear(),
									new Date(_.get(completedTraining, 'end_date'))
										.getUTCFullYear()) ?
									`, ${
										new Date(_.get(completedTraining, 'end_date'))
											.getUTCFullYear()
									}` : ` ${
										new Date(_.get(completedTraining, 'end_date'))
											.getUTCFullYear()
									}`;
								trainingDuration = `${startDate}-${endDate}`;
								trainingLocation = `with ${
									_.get(completedTraining, 'instructors')
								}, ${
									_.get(completedTraining, 'city')
								}, ${
									_.get(completedTraining, 'country')
								}`;
								trainingData = {
									trainingDuration,
									trainingLocation,
								};
								completedTrainingData =
									_.union(completedTrainingData, [trainingData]);
							});
							this.groupTrainingsAvailable = this.totalAllowedGroupTrainings -
								(trainigsCompleted + trainigsInProcess);
							this.groupTrainingsAvailable = this.groupTrainingsAvailable > 0 ?
								this.groupTrainingsAvailable : 0;
							this.componentData.cgt = {
								sessions: completedTrainingData,
								trainingsAvailable: this.groupTrainingsAvailable,
								usedTrainings: this.usedTrainings,
							};

							return result;
						});
				}),
				catchError(err => {
					this.status.loading.cgt = false;
					if (window.Cypress) {
						window.cgtLoading = false;
					}
					this.logger.error(`lifecycle.component : loadCGT() :: Error : (${
						err.status}) ${err.message}`);

					return of({ });
				}),
			);
		}

		return of({ });
	}

	/**
	 * ForkJoin to load the other API Calls
	 */
	private loadRacetrackInfo () {
		forkJoin(
			this.loadACC(),
			this.loadATX(),
			this.loadELearning(),
			this.loadSuccessPaths(),
			this.loadProductGuides(),
			this.loadCGT(),
		)
		.subscribe();
	}

	/**
	 * Fetches the racetrack info for the given params, if successful
	 * will then call loadRacetrackInfo for the other api calls
	 * @param stage selected pitstop
	 */
	public getRacetrackInfo (stage: string) {
		// If we currentWorkingPitstop has been populated, don't need to call APIs again
		const name = _.get(this.componentData, ['racetrack', 'pitstop', 'name']);
		if (stage === name) {
			return;
		}

		if (this.componentData.params.solution && this.componentData.params.usecase) {
			this.status.loading.racetrack = true;

			const pitstop = _.find(
				_.get(this.selectedTechnology, 'pitstops', []), (stop: RacetrackPitstop) =>
				stop.name === stage);

			this.componentData.racetrack = {
				pitstop,
				stage,
				actionsCompPercent: this.currentPitstopCompPert,
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
				this.componentData.params.pitstop = pitstop.name;
				this.stage.next(pitstop.name);
			}

			this.loadRacetrackInfo();

			this.status.loading.racetrack = false;
		}
	}

	/**
	 * Returns the current pitStop
	 * @returns the observable representing the pitstop
	 */
	public getCurrentPitstop (): Observable<string>  {
		return this.stage.asObservable();
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Handler for component intialization
	 */
	public ngOnInit () {
		if (window.Cypress) {
			window.activeComponents = {
				...window.activeComponents,
				LifecycleComponent: this,
			};
		}
		const appHeader = document.getElementsByTagName('app-header');
		this.appHeaderHeight = _.get(appHeader, '[0].clientHeight', 0);
	}

	/**
	 * Gets the height of the app header in pixels
	 * @returns the height in px ready to be inserted as styling
	 */
	get appHeaderHeightPX (): string {
		if (this.appHeaderHeight > 0) {
			return `${this.appHeaderHeight}px`;
		}

		return `${this.appHeaderHeight}`;
	}
}
