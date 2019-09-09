import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	OnDestroy,
	HostListener,
	ElementRef,
	ChangeDetectorRef,
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
	VulnerabilityResponse,
} from '@sdp-api';
import { CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';
import { FeedbackComponent } from '../../components/feedback/feedback.component';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Step } from '../../../../src/app/components/quick-tour/quick-tour.component';
import { DetailsPanelStackService, UtilsService, RacetrackInfoService } from '@services';

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
	title: string;
}

/**
 * Solution Page
 */
@Component({
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit, OnDestroy {

	public selectedFacet: Facet;
	public selectedSolution: RacetrackSolution;
	public selectedTechnology: RacetrackTechnology;
	private customerId: string;

	public status = {
		dropdowns: {
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

	@ViewChild('kmWrapper', { static: true }) private kmWrapperRef: ElementRef;
	@ViewChild('advisoriesFacet', { static: true }) public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet', { static: true }) public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet', { static: true }) public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet', { static: true }) public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('insightsFacet', { static: true }) public insightsTemplate: TemplateRef<{ }>;
	@ViewChild('content', { static: true }) private contentContainer: ElementRef;

	constructor (
		private contractsService: ContractsService,
		private cuiModalService: CuiModalService,
		private productAlertsService: ProductAlertsService,
		private router: Router,
		private logger: LogService,
		private caseService: CaseService,
		private route: ActivatedRoute,
		private utils: UtilsService,
		private cdr: ChangeDetectorRef,
		private racetrackInfoService: RacetrackInfoService,
		private detailsPanelStackService: DetailsPanelStackService,
		private insightsCrashesService: InsightsCrashesService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
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
		const wrapper = this.kmWrapperRef.nativeElement;
		const itemWidth = wrapper.querySelector('.km__items__item').offsetWidth;
		wrapper.scrollTo(wrapper.scrollLeft + (shift * itemWidth), 0);
	}

	/**
	 * Checks if clicked key metric is out of view and brings it into view if needed
	 * @param {Element} target the target key metric element
	 */
	public repositionCarousel (target) {
		const wrapper = this.kmWrapperRef.nativeElement;
		const wrapperBounds = wrapper.getBoundingClientRect();
		const targetBounds = target.getBoundingClientRect();
		const itemWidth = wrapper.querySelector('.km__items__item').offsetWidth;

		if (targetBounds.left < wrapperBounds.left) {
			wrapper.scrollTo(wrapper.scrollLeft - itemWidth, 0);
		} else if (targetBounds.right > wrapperBounds.right) {
			wrapper.scrollTo(wrapper.scrollLeft + itemWidth, 0);
		}
	}

	/**
	 * Change the selected fact
	 * @param facet the facet we've clicked on
	 * @param navigate whether to adjust the route params
	 */
	public selectFacet (facet: Facet, navigate = false) {
		if (facet) {
			this.facets.forEach((f: Facet) => {
				if (f !== facet) {
					f.selected = false;
				}
			});

			const element = document.getElementById(facet.key);
			this.repositionCarousel(element);

			facet.selected = true;
			this.selectedFacet = facet;
			this.quickTourActive = facet.key === 'lifecycle' && (this.quickTourFirstTime ||
			_.isNil(this.quickTourFirstTime));
			if (facet.route && this.activeRoute !== facet.route) {
				this.activeRoute = facet.route;
				if (navigate) {
					this.router.navigate([facet.route]);
				}
			}
			if (this.selectedSolution) {
				this.racetrackInfoService.sendCurrentSolution(this.selectedSolution);

				if (this.selectedTechnology) {
					this.racetrackInfoService.sendCurrentTechnology(this.selectedTechnology);
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
				title: I18n.get('_Lifecycle_'),
			},
			{
				key: 'assets',
				label: I18n.get('_SupportCoverage_'),
				loading: true,
				route: '/solution/assets',
				template: this.assetsTemplate,
				title: I18n.get('_Assets&Coverage_'),
			},
			{
				key: 'advisories',
				loading: true,
				route: '/solution/advisories',
				template: this.advisoriesTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'resolution',
				loading: true,
				route: '/solution/resolution',
				template: this.resolutionTemplate,
				title: I18n.get('_ProblemResolution_'),
			},
			{
				key: 'insights',
				loading: false,
				route: '/solution/insights',
				template: this.insightsTemplate,
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
		return _.find(this.facets, (facet: Facet) => route.includes(facet.route));
	}

	/**
	 * Change our technology
	 * @param technology the technology
	 */
	public changeTechnology (technology: RacetrackTechnology) {
		this.selectedTechnology = technology;
		this.racetrackInfoService.sendCurrentTechnology(technology);
	}

	/**
	 * Change the solution
	 * @param solution the selected solution
	 */
	public changeSolution (solution: RacetrackSolution) {
		this.selectedSolution = solution;
		this.racetrackInfoService.sendCurrentSolution(solution);

		const topTechnology = _.head(_.get(this.selectedSolution, 'technologies', []));

		if (topTechnology) {
			this.changeTechnology(topTechnology);
		}
	}

	/**
	 * Will retrieve the solutions and associated use cases and build out the dropdowns
	 * @returns the solutions
	 */
	private fetchSolutions () {
		this.status.loading = true;
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
			map(result => this.selectedSolution = result),
			takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error(`Solution Data :: Get Current Solution :: Error ${err}`);

				return of({ });
			}),
		)
		.subscribe();

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			map(result => this.selectedTechnology = result),
			takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error(`Solution Data :: Get Current Technology :: Error ${err}`);

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

		return this.contractsService.getCoverageCounts({ customerId: this.customerId })
		.pipe(
			map((counts: CoverageCountsResponse) => {
				const covered = _.get(counts, 'covered', 0);
				const total = _.reduce(counts, (memo, value) => (memo + value), 0);

				const percent = ((covered / total) * 100);
				const gaugePercent = Math.floor(percent) || 0;
				assetsFacet.data = {
					gaugePercent,
					gaugeLabel: (percent > 0 && percent < 1) ? '<1%' : `${gaugePercent}%`,
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

		return this.productAlertsService.getVulnerabilityCounts({ customerId: this.customerId })
		.pipe(
			map((counts: VulnerabilityResponse) => {
				const seriesData = [];

				const advisories = _.get(counts, 'security-advisories', 0);
				const fieldNotices = _.get(counts, 'field-notices', 0);
				const bugs = _.get(counts, 'bugs', 0);

				if (advisories) {
					seriesData.push(
						{
							label: I18n.get('_SecurityAdvisories_'),
							percentage: advisories,
						},
					);
				}

				if (fieldNotices) {
					seriesData.push(
						{
							label: I18n.get('_FieldNotices_'),
							percentage: fieldNotices,
						},
					);
				}

				if (bugs) {
					seriesData.push(
						{
							label: I18n.get('_Bugs_'),
							percentage: bugs,
						},
					);
				}

				advisoryFacet.seriesData = seriesData;
				advisoryFacet.loading = false;
			}),
			catchError(err => {
				advisoryFacet.loading = false;
				this.logger.error('solution.component : fetchAdvisoryCounts() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
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

		return this.insightsCrashesService.getInsightsCounts()
		.pipe(
			map((counts: any) => {

				insightsFacet.seriesData = counts;
				insightsFacet.loading = false;
			}),
			catchError(err => {
				insightsFacet.loading = false;
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

				return of(null);
			}),
			takeUntil(this.destroy$),
		);
	}

	/**
	 * Initialize the Quick Tour
	 */
	private initializeQuickTour () {
		this.quickTourSteps = [
			{
				arrows: 3,
				data: {
					active: false,
				},
				description: I18n.get('_QuickTourStep2Description_'),
				relative: true,
				stepIndex: 1,
				stepPos: 'bottom',
				title: I18n.get('_QuickTourStep2Title_'),
			},
			{
				arrows: 1,
				data: { },
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
					active: false,
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
	 * Refreshes the data for the Quick Tour Step attached
	 * to the No DNAC Header 'continue' button
	 * @param info Data for the button
	 */
	public refreshButtonInfo (info) {
		if (this.quickTourSteps) {
			const step = _.find(this.quickTourSteps, { stepIndex: 2 });
			step.data = info;
		}
	}

	/**
	 * On window resize, refresh button
	 * @param event resize event
	 */
	@HostListener('window:resize')
	public refreshQuickTour () {
		this.calculateStep1();
		this.calculateStep2();
	}

	/**
	 * Calculates the position and dimensions of the second Quick Tour Step
	 */
	private calculateStep1 () {
		const step = _.find(this.quickTourSteps, { stepIndex: 0 });
		const offsetLeft = this.contentContainer.nativeElement.offsetLeft;
		const offsetTop = this.contentContainer.nativeElement.offsetTop;
		const offsetWidth = this.contentContainer.nativeElement.offsetWidth;
		const colRatio = 2 / 12;
		const arrowOffset = 20;
		step.data.left = offsetLeft + offsetWidth * colRatio - arrowOffset;
		step.data.top = offsetTop + 150;
		step.data.active = true;
		step.width = offsetWidth * colRatio * 2;
	}

	/**
	 * Calculates the position and dimensions of the second Quick Tour Step
	 */
	private calculateStep2 () {
		const step = _.find(this.quickTourSteps, { stepIndex: 1 });
		const offsetLeft = this.contentContainer.nativeElement.offsetLeft;
		const offsetTop = this.contentContainer.nativeElement.offsetTop;
		const offsetWidth = this.contentContainer.nativeElement.offsetWidth;
		const offsetHeight = this.contentContainer.nativeElement.offsetHeight;
		const colRatio = 10 / 12 / 3;
		const center = colRatio * 1.5;
		step.data.left = offsetLeft + offsetWidth * (center + 1 / 6);
		step.data.top = offsetTop + offsetHeight * 0.4;
		step.data.active = true;
		step.width = offsetWidth * colRatio * 2;
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.initializeQuickTour();
		this.initializeFacets();
		this.fetchSolutions();
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
			this.refreshQuickTour();
			this.status.loading = false;
		});
		this.collapseFeedbackTab();
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
		if (this.activeRoute) {
			this.selectFacet(this.getFacetFromRoute(this.activeRoute));
		}
		this.cdr.detectChanges();
	}

	/**
	 * Opens the feedback modal
	 * @param app the app to delete
	 */
	 public async openFeedbackModal () {
		await this.cuiModalService.showComponent(FeedbackComponent, { }, 'normal');
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
}
