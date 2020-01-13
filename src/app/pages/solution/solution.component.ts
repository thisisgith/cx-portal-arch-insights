import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	OnDestroy,
	HostListener,
	ElementRef,
	ChangeDetectorRef,
	AfterViewInit,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	Router,
	Event as RouterEvent,
	NavigationEnd,
	ActivatedRoute,
} from '@angular/router';

import * as _ from 'lodash-es';
import { Subscription, forkJoin, of, Subject } from 'rxjs';
import {
	Asset,
	ContractsService,
	RacetrackSolution,
	RacetrackTechnology,
	CoverageCountsResponse,
	ProductAlertsService,
	InsightsCrashesService,
	DiagnosticsService,
	SecurityAdvisoriesResponse,
	CriticalBugsResponse,
	FieldNoticeAdvisoryResponse,
} from '@sdp-api';
import { CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';
import { FeedbackComponent } from '../../components/feedback/feedback.component';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Step } from '../../../../src/app/components/quick-tour/quick-tour.component';
import { DetailsPanelStackService, UtilsService, RacetrackInfoService, CaseDetailsService } from '@services';
import { SmartAccount } from '@interfaces';
import { UserResolve } from '@utilities';
import { ACTIVE_TECHNOLOGY_KEY } from '@constants';
import { ContactSupportComponent } from '../../components/contact-support/contact-support.component';

/**
 * Interface representing a facet
 */
interface Facet {
	data?: any;
	key: string;
	label?: string;
	loading: boolean;
	route: string;
	selected?: boolean;
	template: TemplateRef<{ }>;
	srOnlyTemplate?: TemplateRef<{ }>;
	title: string;
}

/**
 * Solution Page
 */
@Component({
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit, OnDestroy, AfterViewInit {
	public smartAccounts: SmartAccount[];
	public activeSmartAccount: SmartAccount;
	public showSmartAccountSelection: boolean;
	public selectedFacet: Facet;
	public selectedSolution: RacetrackSolution;
	public selectedTechnology: RacetrackTechnology;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	private customerId: string;

	public status = {
		dropdowns: {
			smartAccount: false,
			solution: false,
			technology: false,
		},
		loading: false,
	};
	private activeRoute: string;
	public facets: Facet[];
	public selectedAsset: Asset;
	private eventsSubscribe: Subscription;
	public solutions: RacetrackSolution[];
	public casesCount: number;
	public RMACount: number;

	public quickTourSteps: Step[];
	public buttonDims: any;
	public observableButton: Subscription;
	public quickTourActive: boolean;
	private quickTourFirstTime: boolean;
	private destroy$ = new Subject();
	public cxLevel: number;
	public alert: any = { };
	public showErrorMessage = false;

	@ViewChild('facetNavigationWrapper', { static: true }) private facetNavigationWrapperRef: ElementRef;
	@ViewChild('advisoriesFacet', { static: true }) public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('advisoriesSrOnly', { static: true }) public advisoriesSrOnly: TemplateRef<{ }>;
	@ViewChild('assetsFacet', { static: true }) public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet', { static: true }) public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('percentageGaugeSrOnly', { static: true }) public percentageGaugeSrOnly: TemplateRef<{ }>;
	@ViewChild('resolutionFacet', { static: true }) public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionSrOnly', { static: true }) public resolutionSrOnlyTemplate: TemplateRef<{ }>;
	@ViewChild('insightsFacet', { static: true }) public insightsTemplate: TemplateRef<{ }>;
	@ViewChild('content', { static: true }) private contentContainer: ElementRef;

	constructor (
		private contractsService: ContractsService,
		private cuiModalService: CuiModalService,
		private productAlertsService: ProductAlertsService,
		private diagnosticsService: DiagnosticsService,
		private router: Router,
		private logger: LogService,
		private caseService: CaseService,
		private route: ActivatedRoute,
		private utils: UtilsService,
		private cdr: ChangeDetectorRef,
		private racetrackInfoService: RacetrackInfoService,
		private detailsPanelStackService: DetailsPanelStackService,
		private insightsCrashesService: InsightsCrashesService,
		private userResolve: UserResolve,
		private caseDetailsService: CaseDetailsService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.smartAccounts = _.get(user, ['info', 'companyList'], []);

		this.userResolve.getSaId()
		.subscribe((saId: number) => {
			this.showSmartAccountSelection = this.smartAccounts.length > 1;
			this.activeSmartAccount = _.find(this.smartAccounts, {
				companyId: saId,
			});
		});

		this.customerId = _.get(user, ['info', 'customerId']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
		this.eventsSubscribe = this.router.events.subscribe(
			(event: RouterEvent): void => {
				if (event instanceof NavigationEnd && event.url) {
					const routePath = _.split(
						(_.isArray(event.url) ? event.url[0] : event.url), '?')[0];
					if (routePath.includes('solution')) {
						this.activeRoute = routePath;
						const routeFacet = this.getFacetFromRoute(this.activeRoute);
						if (routeFacet) {
							this.selectFacet(routeFacet);
						}
					}
					if (routePath.includes('lifecycle') || routePath === '/') {
						this.quickTourFirstTime = _.get(
							this.utils.getLocalStorage('quickTourFirstTime'),
							'firstTime');
						this.quickTourActive = this.quickTourFirstTime ||
							_.isNil(this.quickTourFirstTime);
						if (window.Cypress) {
							this.quickTourActive = _.get(
								window, 'Cypress.showQuickTour', this.quickTourActive);
						}
						this.utils.setLocalStorage('quickTourFirstTime', { firstTime: false });
					}
				}
			},
		);

	}

	get technologies (): RacetrackTechnology[] {
		const name = _.get(this.selectedSolution, 'name');

		return _.get(_.find(this.solutions, { name }), 'technologies', []);
	}

	/**
	 * Shifts the Key metrics carousel items.
	 * Positive values shift right, negative values shift left.
	 * Shift is multiplied with the width of a single item.
	 * @param {number} shift The direction and magnitude of shift.
	 */
	public shiftCarousel (shift) {
		const wrapper = this.facetNavigationWrapperRef.nativeElement;
		const itemWidth = wrapper.querySelector('.facet-navigation__list-item').offsetWidth;
		wrapper.scrollTo(wrapper.scrollLeft + (shift * itemWidth) + 32, 0);
	}

	/**
	 * Checks if clicked key metric is out of view and brings it into view if needed
	 * @param {Element} target the target key metric element
	 */
	public repositionCarousel (target) {
		const wrapper = this.facetNavigationWrapperRef.nativeElement;
		const wrapperBounds = wrapper.getBoundingClientRect();
		const targetBounds = target.getBoundingClientRect();
		const itemWidth = wrapper.querySelector('.facet-navigation__list-item').offsetWidth;

		if (targetBounds.left < wrapperBounds.left) {
			wrapper.scrollTo(wrapper.scrollLeft - itemWidth, 0);
		} else if (targetBounds.right > wrapperBounds.right) {
			wrapper.scrollTo(wrapper.scrollLeft + itemWidth, 0);
		}
	}

	/**
	 * Directs the user to the lifecycles facet
	 */
	public goHome () {
		const lifecycleFacet = _.find(this.facets, { key: 'lifecycle' });
		this.selectFacet(lifecycleFacet, true);
	}

	/**
	 * Change the selected fact
	 * @param facet the facet we've clicked on
	 * @param navigate whether to adjust the route params
	 */
	public selectFacet (facet: Facet, navigate = false) {
		if (facet) {
			this.facets.forEach((otherFacet: Facet) => {
				if (otherFacet !== facet) {
					otherFacet.selected = false;
				}
			});

			const element = document.getElementById(facet.key);
			this.repositionCarousel(element);

			facet.selected = true;
			this.selectedFacet = facet;
			this.quickTourActive = facet.key === 'lifecycle'
				&& (this.quickTourFirstTime || _.isNil(this.quickTourFirstTime));

			if (facet.route && this.activeRoute !== facet.route) {
				this.activeRoute = facet.route;
				if (navigate) {
					// calling case service on every Prob-Res tile click
					if (facet.key === 'resolution') { this.fetchCaseAndRmaCountOnRefresh(); }
					this.router.navigate([facet.route]);
				}
			}
			if (this.selectedSolution) {
				this.racetrackInfoService.sendCurrentSolution(this.selectedSolution);

				if (this.selectedTechnology) {
					this.racetrackInfoService.sendCurrentTechnology(this.selectedTechnology);
					this.racetrackInfoService.sendCurrentAdoptionPercentage(
						this.selectedTechnology.usecase_adoption_percentage);
				}
			}

			this.detailsPanelStackService.reset();
		}
	}

	/**
	 * Used to initialize our facets
	 */
	private initializeFacets () {
		this.facets = [
			{
				key: 'lifecycle',
				label: I18n.get('_AdoptionProgress_'),
				loading: false,
				route: '/solution/lifecycle',
				template: this.lifecycleTemplate,
				srOnlyTemplate: this.percentageGaugeSrOnly,
				title: I18n.get('_Lifecycle_'),
			},
			{
				key: 'assets',
				label: I18n.get('_SupportCoverage_'),
				loading: true,
				route: '/solution/assets',
				template: this.assetsTemplate,
				srOnlyTemplate: this.percentageGaugeSrOnly,
				title: I18n.get('_Assets&Coverage_'),
			},
			{
				key: 'advisories',
				loading: true,
				route: '/solution/advisories',
				template: this.advisoriesTemplate,
				srOnlyTemplate: this.advisoriesSrOnly,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'resolution',
				loading: false,
				route: '/solution/resolution',
				template: this.resolutionTemplate,
				srOnlyTemplate: this.resolutionSrOnlyTemplate,
				title: I18n.get('_ProblemResolution_'),
			},
			{
				key: 'insights',
				loading: false,
				route: '/solution/insights',
				template: this.insightsTemplate,
				srOnlyTemplate: this.percentageGaugeSrOnly,
				title: I18n.get('_Insights_'),
			},
		];
	}

	/**
	 * Returns the selected facet based on the route
	 * @param route the route string
	 * @returns the facet
	 */
	private getFacetFromRoute (route: string) {
		return route ? _.find(this.facets, (facet: Facet) => route.includes(facet.route)) : this.facets[0];
	}

	public changeTechnology (technology: RacetrackTechnology) {
		this.selectedTechnology = technology;
		this.racetrackInfoService.sendCurrentTechnology(technology);
		this.racetrackInfoService.sendCurrentAdoptionPercentage(
				technology.usecase_adoption_percentage);
		window.localStorage.setItem(ACTIVE_TECHNOLOGY_KEY, technology.name);
	}

	public changeSolution (solution: RacetrackSolution) {
		this.selectedSolution = solution;
		this.racetrackInfoService.sendCurrentSolution(solution);

		const topTechnology = _.head(_.get(this.selectedSolution, 'technologies', []));

		if (topTechnology) {
			this.changeTechnology(topTechnology);
		}
	}

	public changeSmartAccount (saId: number) {
		this.userResolve.setSaId(saId);
	}

	/**
	 * Update the dropdown information in status
	 * @param selectedDropdown the selected dropdown option
	 */
	public changeDropdownSelection (selectedDropdown: 'smartAccount' | 'solution' | 'technology') {
		this.status.dropdowns = {
			smartAccount: false,
			solution: false,
			technology: false,
			[selectedDropdown]: !this.status.dropdowns[selectedDropdown],
		};
	}

	/**
	 * Will retrieve the solutions and associated use cases and build out the dropdowns
	 * @returns the solutions
	 */
	private fetchSolutions () {
		this.status.loading = true;
		const lifecycleFacet = _.find(this.facets, { key: 'lifecycle' });
		this.racetrackInfoService.getRacetrack()
		.pipe(
			map(result => {
				this.solutions = result.solutions;
			}),
			takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error(`Solution Data :: Get Racetrack :: Error ${err}`);

				return of({ });
			}),
		)
		.subscribe();

		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			map((result: RacetrackSolution) => {
				this.selectedSolution = result;
				this.selectedSolutionName = _.get(this.selectedSolution, 'name');
			}),
			takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error(`Solution Data :: Get Current Solution :: Error ${err}`);

				return of({ });
			}),
		)
		.subscribe();

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			map((result: RacetrackTechnology) => {
				if (this.selectedTechnologyName !== _.get(result, 'name')) {
					this.selectedTechnology = result;
					this.selectedTechnologyName = _.get(this.selectedTechnology, 'name');
					_.set(this.selectedSolution.technologies,
						{ name: this.selectedTechnologyName }, this.selectedTechnology);
					this.reloadFacets();
				}
			}),
			takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error(`Solution Data :: Get Current Technology :: Error ${err}`);

				return of({ });
			}),
		)
		.subscribe();

		this.racetrackInfoService.getCurrentAdoptionPercentage()
		.pipe(
			map((result: number) => {
				this.selectedTechnology.usecase_adoption_percentage = result;
				lifecycleFacet.data = {
					gaugePercent: result,
				};
			}),
			takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error(
					`Solution Data :: Get Current AdoptionPercentage :: Error ${err}`);

				return of({ });
			}),
		)
		.subscribe();
	}

	/**
	 * Function used to fetch and build the assets & coverage facet
	 * @returns the coverage count
	 */
	private fetchCoverageCount () {
		const assetsFacet = _.find(this.facets, { key: 'assets' });
		assetsFacet.loading = true;

		return this.contractsService.getCoverageCounts({
			customerId: this.customerId,
			solution: this.selectedSolution.name,
			useCase: this.selectedTechnology.name,
		})
		.pipe(
			map((counts: CoverageCountsResponse) => {
				const covered = _.get(counts, 'covered', 0);
				const total = _.reduce(counts, (memo, value) => (memo + value), 0);

				assetsFacet.data = {
					gaugePercent: total === 0 ? 0 : ((covered / total) * 100),
				};

				assetsFacet.loading = false;
			}),
			catchError(err => {
				assetsFacet.loading = false;
				this.logger.error('solution.component : fetchCoverageCount() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
			takeUntil(this.destroy$),
		);
	}

	/**
	 * Fetches the counts for the advisories chart
	 * @returns the advisory counts
	 */
	private fetchAdvisoryCounts () {
		const advisoryFacet = _.find(this.facets, { key: 'advisories' });

		advisoryFacet.loading = true;
		advisoryFacet.seriesData = [];

		let advisoryTotal = 0;
		let bugsTotal = 0;
		let fieldTotal = 0;

		return forkJoin([
			this.productAlertsService.getAdvisoriesFieldNotices({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
				rows: 1,
				page: 1,
			})
			.pipe(
				map((response: FieldNoticeAdvisoryResponse) => {
					fieldTotal = _.toNumber(_.get(response, ['Pagination', 'total'], 0)) || 0;
				}),
				catchError(err => {
					this.logger.error('solution.component : fetchAdvisoryCounts():field ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
			this.productAlertsService.getAdvisoriesSecurityAdvisories({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
				page: 1,
				rows: 1,
			})
			.pipe(
				map((response: SecurityAdvisoriesResponse) => {
					advisoryTotal = _.toNumber(_.get(response, ['Pagination', 'total'], 0)) || 0;
				}),
				catchError(err => {
					this.logger.error('solution.component : fetchAdvisoryCounts():security ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
			this.diagnosticsService.getCriticalBugs({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
				rows: 1,
				page: 1,
			})
			.pipe(
				map((response: CriticalBugsResponse) => {
					bugsTotal = _.toNumber(_.get(response, ['Pagination', 'total'], 0)) || 0;
				}),
				catchError(err => {
					this.logger.error('solution.component : fetchAdvisoryCounts():bugs ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
		])
		.pipe(
			map(() => {
				const total = advisoryTotal + fieldTotal + bugsTotal;

				advisoryFacet.seriesData = [
					{
						label: I18n.get('_SecurityAdvisories_'),
						percentage: (advisoryTotal / total) * 100,
						value: advisoryTotal,
					},
					{
						label: I18n.get('_FieldNotices_'),
						percentage: (fieldTotal / total) * 100,
						value: fieldTotal,
					},
					{
						label: I18n.get('_PriorityBugs_'),
						percentage: (bugsTotal / total) * 100,
						value: bugsTotal,
					},
				];

				advisoryFacet.loading = false;
			}),
			takeUntil(this.destroy$),
		);
	}

	public get advisoryIndex () {
		if (this.router.url.indexOf('/solution/advisories/security') !== -1) {
			return 0;
		}

		if (this.router.url.indexOf('/solution/advisories/field-notices') !== -1) {
			return 1;
		}

		if (this.router.url.indexOf('/solution/advisories/bugs') !== -1) {
			return 2;
		}

		return null;
	}

	/**
	 * Fetches the counts for the advisories chart
	 * @returns the advisory counts
	 */
	private fetchInsightsCounts () {
		const insightsFacet = _.find(this.facets, { key: 'insights' });

		insightsFacet.loading = true;
		insightsFacet.isError = false;

		return this.insightsCrashesService.getInsightsCounts({
			customerId: this.customerId,
			timePeriod: '0',
		})
		.pipe(
			map((counts: any) => {

				insightsFacet.seriesData = counts;
				insightsFacet.loading = false;
			}),
			catchError(err => {
				insightsFacet.loading = false;
				insightsFacet.isError = true;
				this.logger.error('solution.component : fetchInsightsCounts() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
			takeUntil(this.destroy$),
		);
	}

	/**
	 * Fetch Case/RMA counts for the given serial number
	 * @returns Observable with array of case followed by RMA counts
	 */
	public getCaseAndRMACount () {
		const resolutionFacet = _.find(this.facets, { key: 'resolution' });
		resolutionFacet.loading = true;
		const params = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return forkJoin(
			// Case Count
			this.caseService.read(params)
			.pipe(
				catchError(err => {
					this.logger.error(`Case Data :: Case Count :: Error ${err}`);
					resolutionFacet.loading = false;

					return of(null);
				}),
				takeUntil(this.destroy$),
			),
			// RMA count
			this.caseService.read({
				...params,
				hasRMAs: 'T',
			})
			.pipe(
				catchError(err => {
					this.logger.error(`RMA Data :: RMA Count :: Error ${err}`);
					this.casesCount = 0;
					this.RMACount = 0;
					resolutionFacet.loading = false;

					return of(null);
				}),
				takeUntil(this.destroy$),
			),
		)
		.pipe(
			map(counts => {
				resolutionFacet.loading = false;
				this.casesCount = _.get(counts, [0, 'totalElements'], 0);
				this.RMACount = _.get(counts, [1, 'totalElements'], 0);
			}),
			catchError(err => {
				this.logger.error(`RMA Data :: Case and RMA Count :: Error ${err}`);
				resolutionFacet.loading = false;

				return of(null);
			}),
			takeUntil(this.destroy$),
		);
	}

	/**
	 * Open contact support modal small
	 */
	public openPortalSupport () {
		this.cuiModalService.showComponent(ContactSupportComponent, { }, 'small');
	}

	/**
	 * Initialize the Quick Tour
	 */
	private initializeQuickTour () {
		this.quickTourSteps = [
			{
				arrows: 3,
				data: {
					active: true,
				},
				description: I18n.get('_QuickTourStep2Description_'),
				relative: false,
				stepIndex: 1,
				stepPos: 'bottom',
				title: I18n.get('_QuickTourStep2Title_'),
			},
			{
				arrows: 1,
				data: {
					active: true,
				},
				description: I18n.get('_QuickTourStep3Description_'),
				maxWidth: 300,
				relative: false,
				stepIndex: 2,
				stepPos: 'bottom',
				title: I18n.get('_QuickTourStep3Title_'),
			},
			{
				arrows: 1,
				data: {
					active: true,
				},
				description: I18n.get('_QuickTourStep1Description_'),
				maxWidth: 400,
				relative: false,
				stepIndex: 0,
				stepPos: 'right',
				title: I18n.get('_QuickTourStep1Title_'),
			},
		];
	}

	/**
	 * On window resize, refresh button
	 * @param event resize event
	 */
	@HostListener('window:resize')
	public refreshQuickTour () {
		this.calculateSteps();
	}

	private calculateStep1 (colRatio, offsetTop, offsetWidth) {
		const step = _.find(this.quickTourSteps, { stepIndex: 0 });
		const arrowOffset = 20;
		step.data.left = offsetWidth * colRatio - arrowOffset;
		step.data.top = offsetTop + 150;
		step.data.active = true;
		step.width = offsetWidth * colRatio * 2;
	}

	private calculateStep2 (colRatio, offsetTop, offsetWidth, offsetHeight) {
		const step = _.find(this.quickTourSteps, { stepIndex: 1 });
		const center = colRatio * 2.5;
		step.data.left = offsetWidth * center;
		step.data.top = offsetTop + offsetHeight * 0.4;
		step.data.active = true;
		step.width = offsetWidth * colRatio * 2;
	}

	private calculateStep3 (colRatio, offsetTop, offsetWidth) {
		// Step 3 points to the Assets Facet card on top. So, unlike Step 1 and Step 2,
		// the position is always constant.
		const leftPos = 564;
		const step = _.find(this.quickTourSteps, { stepIndex: 2 });
		step.data.left = leftPos;
		step.data.top = offsetTop * 0.75;
		step.data.active = true;
		step.width = offsetWidth * colRatio * 2;
	}

	/**
	 * Calculates the offsets for the positions of quick guide tour steps.
	 * Each individual step calculation method is then called with these offset values.
	 */
	private calculateSteps () {
		const offsetTop = this.contentContainer.nativeElement.offsetTop;
		const offsetWidth = this.contentContainer.nativeElement.offsetWidth;
		const offsetHeight = this.contentContainer.nativeElement.offsetHeight;
		const colRatio = 0.25;
		this.calculateStep1(colRatio, offsetTop, offsetWidth);
		this.calculateStep2(colRatio, offsetTop, offsetWidth, offsetHeight);
		this.calculateStep3(colRatio, offsetTop, offsetWidth);
	}

	/**
	 * Reloads our facets
	 */
	private reloadFacets () {
		this.status.loading = true;
		forkJoin(
			this.fetchCoverageCount(),
			this.fetchAdvisoryCounts(),
			this.fetchInsightsCounts(),
			this.getCaseAndRMACount(),
		)
		.pipe(
			catchError(err => {
				this.status.loading = false;
				this.logger.error('solution.component : ngOnInit() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
			takeUntil(this.destroy$),
		)
		.subscribe(() => {
			this.status.loading = false;
		});
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.initializeQuickTour();
		this.initializeFacets();
		this.fetchSolutions();
		this.refreshQuickTour();
		this.collapseFeedbackTab();

		this.caseDetailsService.caseCount$
			.subscribe((data: boolean) => {
				if (data && this.destroy$) {
					this.fetchCaseAndRmaCountOnRefresh();
				}
			});
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		if (this.eventsSubscribe) {
			_.invoke(this.eventsSubscribe, 'unsubscribe');
		}
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Detects changes to the view after init
	 */
	public async ngAfterViewInit () {
		this.calculateSteps();
		this.selectFacet(this.getFacetFromRoute(this.activeRoute));
		this.racetrackInfoService.getPitStopApiFailure()
		.pipe(
			map(() => {
				const advisoryFacet = _.find(this.facets, { key: 'advisories' });
				advisoryFacet.loading = false;
				this.showErrorMessage = true;
			}),
			takeUntil(this.destroy$),
		)
		.subscribe();
	}

	/**
	 * Detects changes to the view after check
	 */
	public async ngAfterViewChecked () {
		this.cdr.detectChanges();
	}

	/**
	 * Opens the feedback modal
	 * @param app the app to delete
	 */
	 public async openFeedbackModal () {
		await this.cuiModalService.showComponent(FeedbackComponent, {
			saId: this.activeSmartAccount.companyId,
			facet: this.selectedFacet.title,
			pitstop: this.selectedTechnology.currentPitstop,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnology.name,
		}, 'normal');
	}

	/**
	 * Collapses the initially opened feedback tab
	 */
	public collapseFeedbackTab () {
		window.addEventListener('scroll', () => {
			document.getElementById('slideout').classList
				.remove('expand-on-load');
		}, { once: true, capture: true });
	}

	/**
	 * Close the dropdowns if clicked outside of the dropdown
	 * @param clickedOutsideDropdown clicked outside of the dropdown
	 */
	public clickOutsideDropdown (clickedOutsideDropdown: 'smartAccount' | 'solution' | 'technology') {
		this.status.dropdowns[clickedOutsideDropdown] = false;
	}

	/**
	 * calling fetchCaseAndRmaCountOnRefresh on case creation and when routed to Problem-Resolution tile
	 */
	public fetchCaseAndRmaCountOnRefresh () {
		this.getCaseAndRMACount()
			.pipe(catchError(err => {
				this.logger.error('solution.component : fetchCaseAndRmaCountOnRefresh() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({  });
			}),
			takeUntil(this.destroy$))
			.subscribe();
	}
}
