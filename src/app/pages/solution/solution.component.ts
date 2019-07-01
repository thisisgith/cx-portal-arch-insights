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
} from '@angular/router';

import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
import {
	Asset,
	ContractsService,
	RacetrackService,
	RacetrackResponse,
	RacetrackSolution,
	RacetrackTechnology,
	CoverageCountsResponse,
} from '@cui-x/sdp-api';
import { SolutionService } from './solution.service';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Interface representing a facet
 */
interface Facet {
	data?: any;
	key: string;
	label?: string;
	route: string;
	selected?: boolean;
	template: TemplateRef<{ }>;
	title: string;
}

/** Current CustomerID Implementation */
const customerId = '2431199';

/**
 * Solution Page
 */
@Component({
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit, OnDestroy {

	public shownTabs = 4;
	public selectedFacet: Facet;
	public selectedSolution: RacetrackSolution;
	public selectedTechnology: RacetrackTechnology;

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
	private assetSubscribe: Subscription;
	public solutions: RacetrackSolution[];

	@ViewChild('advisoriesFact', { static: true }) public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet', { static: true }) public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet', { static: true }) public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet', { static: true }) public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('securityFacet', { static: true }) public securityTemplate: TemplateRef<{ }>;

	constructor (
		private contractsService: ContractsService,
		private router: Router,
		private solutionService: SolutionService,
		private racetrackService: RacetrackService,
		private logger: LogService,
	) {
		this.eventsSubscribe = this.router.events.subscribe(
			(event: RouterEvent): void => {
				if (event instanceof NavigationEnd && event.url) {
					const route = (_.isArray(event.url)) ? event.url[0] : event.url;

					if (route.includes('solution')) {
						this.activeRoute = route;
						const routeFacet = _.find(this.facets, { route });
						if (routeFacet) {
							this.selectFacet(routeFacet);
						}
					}
				}
			},
		);

		this.assetSubscribe = this.solutionService.getCurrentAsset()
		.subscribe((asset: Asset) => {
			this.selectedAsset = asset;
		});
	}

	get technologies (): RacetrackTechnology[] {
		const name = _.get(this.selectedSolution, 'name');

		return _.get(_.find(this.solutions, { name }), 'technologies', []);
	}

	/**
	 * Change the selected fact
	 * @param facet the facet we've clicked on
	 */
	public selectFacet (facet: Facet) {
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
				this.router.navigate([facet.route]);
			}
			if (this.selectedSolution) {
				this.solutionService.sendCurrentSolution(this.selectedSolution);

				if (this.selectedTechnology) {
					this.solutionService.sendCurrentTechnology(this.selectedTechnology);
				}
			}
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
				route: '/solution/lifecycle',
				template: this.lifecycleTemplate,
				title: I18n.get('_Lifecycle_'),
			},
			{
				key: 'assets',
				label: I18n.get('_SupportCoverage_'),
				route: '/solution/assets',
				template: this.assetsTemplate,
				title: I18n.get('_Assets&Coverage_'),
			},
			// {
			// 	key: 'security',
			// 	route: '/solution/security',
			// 	template: this.securityTemplate,
			// 	title: I18n.get('_Security_'),
			// },
			{
				key: 'advisories',
				route: '/solution/advisories',
				template: this.advisoriesTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'resolution',
				route: '/solution/resolution',
				template: this.resolutionTemplate,
				title: I18n.get('_ProblemResolution_'),
			},
		];

		if (this.activeRoute) {
			this.selectFacet(_.find(this.facets, { route: this.activeRoute }));
		}
	}

	/**
	 * Change our technology
	 * @param technology the technology
	 */
	public changeTechnology (technology: RacetrackTechnology) {
		this.selectedTechnology = technology;
		this.solutionService.sendCurrentTechnology(technology);
	}

	/**
	 * Change the solution
	 * @param solution the selected solution
	 */
	public changeSolution (solution: RacetrackSolution) {
		this.selectedSolution = solution;
		this.solutionService.sendCurrentSolution(solution);

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
		this.racetrackService.getRacetrack({ customerId })
		.subscribe((results: RacetrackResponse) => {
			this.solutions = results.solutions;
			this.changeSolution(_.head(this.solutions));
			this.status.loading = false;
		},
		err => {
			this.status.loading = false;
			this.logger.error('solution.component : fetchSolutions() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Function used to fetch and build the assets & coverage facet
	 */
	private fetchCoverageCount () {
		this.contractsService.getCoverageCounts({ customerId })
		.subscribe((counts: CoverageCountsResponse) => {
			const covered = _.get(counts, 'covered', 0);
			const total = _.reduce(counts, (memo, value) => (memo + value), 0);

			const assetsFacet = _.find(this.facets, { key: 'assets' });
			assetsFacet.data = {
				gaugePercent: Math.floor((covered / total) * 100) || 0,
			};
		},
		err => {
			this.logger.error('solution.component : fetchCoverageCount() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.fetchSolutions();
		this.initializeFacets();
		this.fetchCoverageCount();
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		if (this.eventsSubscribe) {
			_.invoke(this.eventsSubscribe, 'unsubscribe');
		}

		if (this.assetSubscribe) {
			_.invoke(this.assetSubscribe, 'unsubscribe');
		}
	}
}
