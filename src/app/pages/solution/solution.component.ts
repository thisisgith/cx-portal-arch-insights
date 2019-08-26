import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	OnDestroy,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	Router,
	Event as RouterEvent,
	NavigationEnd,
	ActivatedRoute,
} from '@angular/router';

import * as _ from 'lodash-es';
import { Subject, Subscription, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import {
	Asset,
	ContractsService,
	RacetrackService,
	RacetrackSolution,
	RacetrackTechnology,
	CoverageCountsResponse,
	ProductAlertsService,
	VulnerabilityResponse,
} from '@sdp-api';
import { CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';
import { RacetrackInfoService } from '@services';
import { DetailsPanelStackService } from '@services';

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

	private destroy$ = new Subject();

	@ViewChild('advisoriesFacet', { static: true }) public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet', { static: true }) public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet', { static: true }) public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet', { static: true }) public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('insightsFacet', { static: true }) public insightsTemplate: TemplateRef<{ }>;

	constructor (
		private contractsService: ContractsService,
		private productAlertsService: ProductAlertsService,
		private router: Router,
		private racetrackService: RacetrackService,
		private logger: LogService,
		private caseService: CaseService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
		private detailsPanelStackService: DetailsPanelStackService,
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
				}
			},
		);
	}

	get technologies (): RacetrackTechnology[] {
		const name = _.get(this.selectedSolution, 'name');

		return _.get(_.find(this.solutions, { name }), 'technologies', []);
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

			facet.selected = true;
			this.selectedFacet = facet;

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

		if (this.activeRoute) {
			this.selectFacet(this.getFacetFromRoute(this.activeRoute));
		}
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
	 */
	private fetchSolutions () {
		this.status.loading = true;
		this.racetrackInfoService.getRacetrack()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.solutions = result.solutions;
			this.status.loading = false;
		});

		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.selectedSolution = result;
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.selectedTechnology = result;
		});
	}

	/**
	 * Function used to fetch and build the assets & coverage facet
	 */
	private fetchCoverageCount () {
		const assetsFacet = _.find(this.facets, { key: 'assets' });
		assetsFacet.loading = true;
		this.contractsService.getCoverageCounts({ customerId: this.customerId })
		.subscribe((counts: CoverageCountsResponse) => {
			const covered = _.get(counts, 'covered', 0);
			const total = _.reduce(counts, (memo, value) => (memo + value), 0);

			const percent = ((covered / total) * 100);
			const gaugePercent = Math.floor(percent) || 0;
			assetsFacet.data = {
				gaugePercent,
				gaugeLabel: (percent > 0 && percent < 1) ? '<1%' : `${gaugePercent}%`,
			};

			assetsFacet.loading = false;
		},
		err => {
			assetsFacet.loading = false;
			this.logger.error('solution.component : fetchCoverageCount() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Fetches the counts for the advisories chart
	 */
	private fetchAdvisoryCounts () {
		const advisoryFacet = _.find(this.facets, { key: 'advisories' });

		advisoryFacet.loading = true;
		this.productAlertsService.getVulnerabilityCounts({ customerId: this.customerId })
		.subscribe((counts: VulnerabilityResponse) => {
			const seriesData = [];

			const advisories = _.get(counts, 'security-advisories', 0);
			const fieldNotices = _.get(counts, 'field-notices', 0);
			const bugs = _.get(counts, 'bugs', 0);

			if (advisories) {
				seriesData.push(
					{
						label: I18n.get('_SecurityAdvisories_'),
						value: advisories,
					},
				);
			}

			if (fieldNotices) {
				seriesData.push(
					{
						label: I18n.get('_FieldNotices_'),
						value: fieldNotices,
					},
				);
			}

			if (bugs) {
				seriesData.push(
					{
						label: I18n.get('_Bugs_'),
						value: bugs,
					},
				);
			}

			advisoryFacet.seriesData = seriesData;
			advisoryFacet.loading = false;
		},
		err => {
			advisoryFacet.loading = false;
			this.logger.error('solution.component : fetchAdvisoryCounts() ' +
			`:: Error : (${err.status}) ${err.message}`);
		});
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
			),
		)
		.subscribe(counts => {
			resolutionFacet.loading = false;

			this.casesCount = _.get(counts, [0, 'totalElements'], 0);
			this.RMACount = _.get(counts, [1, 'totalElements'], 0);
		});
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.fetchSolutions();
		this.initializeFacets();
		this.fetchCoverageCount();
		this.fetchAdvisoryCounts();
		this.getCaseAndRMACount();
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		if (this.eventsSubscribe) {
			_.invoke(this.eventsSubscribe, 'unsubscribe');
		}
		this.destroy$.next();
	}
}
